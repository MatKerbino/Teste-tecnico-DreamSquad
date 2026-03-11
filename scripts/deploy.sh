#!/usr/bin/env bash
# =============================================================================
# Billing Manager — Full Automated Deploy
#
# Pré-requisitos: aws, terraform, docker 
#
# Uso:
#   ./scripts/deploy.sh             # Provisiona e deploya tudo
#   ./scripts/deploy.sh --destroy   # Destrói toda a infraestrutura
# =============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/src/backend"
LAMBDA_DIR="$ROOT_DIR/src/lambda"
FRONTEND_DIR="$ROOT_DIR/src/frontend"

cd "$ROOT_DIR"

# ─── Pre-flight ───────────────────────────────────────────────
step "Verificando pré-requisitos"
for tool in aws terraform docker; do
  command -v "$tool" &>/dev/null || error "'$tool' não encontrado."
done
docker info &>/dev/null || error "Docker daemon não está rodando."
success "aws, terraform e docker encontrados."

# ─── Destroy mode ────────────────────────────────────────────
if [[ "${1:-}" == "--destroy" ]]; then
  step "Destruindo infraestrutura"
  warn "Destruindo tudo em 5s..."
  sleep 5
  terraform destroy -auto-approve
  success "Infraestrutura destruída."
  exit 0
fi

# ─── Step 1: Build Lambda via Docker ─────────────────────────
step "1/6 Compilando Lambda"
"$SCRIPT_DIR/build-lambda.sh" "$LAMBDA_DIR" "--docker"

# ─── Step 2: Criar apenas o repositório ECR ──────────────────
step "2/6 Provisionando Repositório ECR"
terraform init -upgrade 2>&1 | grep -E "(Initializing|installed|complete|re-using)" || true
terraform validate && success "terraform validate Ok" || error "terraform validate falhou."

terraform apply -target=module.backend.aws_ecr_repository.backend -auto-approve \
  && success "ECR criado/verificado." \
  || error "Falha ao criar o ECR."

REGION=$(aws configure get region || echo "us-east-1")

ECR_URL=$(terraform output -raw ecr_repository_url)
info "ECR: $ECR_URL"
info "Região: $REGION"

# ─── Step 3: Build + push backend Docker ─────────────────────
step "3/6 Build e push da imagem backend para o ECR"
docker build -t billing-manager-backend "$BACKEND_DIR" \
  || error "docker build falhou."

"$SCRIPT_DIR/docker-push.sh" "$REGION" "$ECR_URL"

# ─── Step 4: Provisionar o resto da Infraestrutura ───────────
step "4/6 Provisionando o restante da infraestrutura (com a imagem real)"
terraform apply -var="backend_image_uri=${ECR_URL}:latest" -auto-approve \
  && success "Infraestrutura completa provisionada." \
  || error "terraform apply final falhou."

aws ecs update-service --cluster "${ROOT_DIR##*/}-cluster" --service "${ROOT_DIR##*/}-backend-service" --force-new-deployment &>/dev/null || true


ALB_DNS=$(terraform output -raw alb_url)
DYNAMODB_TABLE=$(terraform output -raw dynamodb_table_name)
FRONTEND_BUCKET=$(terraform output -raw frontend_bucket_name)

info "ALB:            $ALB_DNS"
info "DynamoDB:       $DYNAMODB_TABLE"
info "Frontend S3:    $FRONTEND_BUCKET"

# ─── Step 5: Seed via Docker ─────────────────────────────────
step "5/6 Seed do banco de dados (/seed no container)"
docker run --rm \
  -e AWS_ACCESS_KEY_ID="$(aws configure get aws_access_key_id     2>/dev/null || echo '')" \
  -e AWS_SECRET_ACCESS_KEY="$(aws configure get aws_secret_access_key 2>/dev/null || echo '')" \
  -e AWS_SESSION_TOKEN="$(aws configure get aws_session_token      2>/dev/null || echo '')" \
  -e AWS_REGION="$REGION" \
  -e DYNAMODB_TABLE="$DYNAMODB_TABLE" \
  --entrypoint /seed \
  "$ECR_URL:latest" \
  && success "Seed OK: admin@billing-manager.io / Billing Manager@2026" \
  || warn    "Seed falhou (os dados podem já existir — pode ignorar)."

# ─── Step 6: Build Frontend via Docker + sync S3 ─────────────
step "6/6 Build e deploy do Frontend (Docker: node:20-alpine)"
ALB_URL="$ALB_DNS"

CF_URL_BEFORE_BUILD=$(terraform output -raw cloudfront_url 2>/dev/null || echo "")

if [ "$CF_URL_BEFORE_BUILD" == "(aguardando CloudFront)" ] || [ -z "$CF_URL_BEFORE_BUILD" ]; then
  USED_API_URL=""
else
  USED_API_URL="$CF_URL_BEFORE_BUILD"
fi

docker build \
  --build-arg NEXT_PUBLIC_API_URL="$USED_API_URL" \
  -f "$FRONTEND_DIR/Dockerfile.build" \
  -t billing-manager-frontend-build \
  "$FRONTEND_DIR" \
  || error "docker build do frontend falhou."

FRONTEND_OUT="$ROOT_DIR/.frontend-out"
TEMP_CONTAINER=$(docker create billing-manager-frontend-build)
rm -rf "$FRONTEND_OUT" && mkdir -p "$FRONTEND_OUT"
docker cp "$TEMP_CONTAINER:/out/." "$FRONTEND_OUT/"
docker rm "$TEMP_CONTAINER" &>/dev/null

aws s3 sync "$FRONTEND_OUT/" "s3://${FRONTEND_BUCKET}/" --delete \
  && success "Frontend deployado → s3://$FRONTEND_BUCKET/" \
  || error "aws s3 sync falhou."
rm -rf "$FRONTEND_OUT"

CF_URL=$(terraform output -raw cloudfront_url 2>/dev/null || echo "(aguardando CloudFront)")
CF_ID=$(terraform output -raw cloudfront_id 2>/dev/null || echo "")

if [ -n "$CF_ID" ]; then
  step "7/7 Invalidando cache do CloudFront"
  aws cloudfront create-invalidation --distribution-id "$CF_ID" --paths "/*" &>/dev/null
  success "Cache do CloudFront invalidado."
fi

echo ""
echo -e "${BOLD}${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${GREEN}║            BILLING MANAGER DEPLOYADO COM SUCESSO         ║${NC}"
echo -e "${BOLD}${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${BOLD}Frontend:${NC}  $CF_URL"
echo -e "  ${BOLD}API:${NC}       $ALB_URL"
echo -e "  ${BOLD}Login:${NC}     admin@billing-manager.io  /  Billing Manager@2026"
echo -e "  ${BOLD}DynamoDB:${NC}  $DYNAMODB_TABLE"
echo ""
echo -e "  Para destruir: ${YELLOW}./scripts/deploy.sh --destroy${NC}"
echo ""

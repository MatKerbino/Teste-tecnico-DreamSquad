#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

REGION=${1:-}
ECR_REPO_URL=${2:-}

if [ -z "$REGION" ] || [ -z "$ECR_REPO_URL" ]; then
    error "Uso: $0 <region> <ecr_repo_url>"
fi

info "Logando no ECR na região $REGION..."
aws ecr get-login-password --region "$REGION" \
    | docker login --username AWS --password-stdin "$ECR_REPO_URL" \
    || error "Falha no login do ECR."

info "Enviando imagem billing-manager-backend:latest para o ECR..."
docker tag billing-manager-backend:latest "${ECR_REPO_URL}:latest" \
    || error "Falha na tag da imagem (ela existe localmente?)"

docker push "${ECR_REPO_URL}:latest" \
    && success "Imagem enviada para $ECR_REPO_URL:latest com sucesso." \
    || error "Falha no docker push."

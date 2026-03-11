# Guia de Desenvolvimento

Este guia explica como configurar o ambiente de desenvolvimento local e as variáveis de ambiente necessárias.

## Requisitos
- **Docker & Docker Compose**
- **Go 1.22+** (para rodar comandos via `go run` localmente se preferir)
- **Node.js 20+** (para rodar o frontend localmente se preferir)

## Variáveis de Ambiente

### Backend (API Go)
Injetadas via Docker Compose ou Terraform.

| Variável | Descrição | Valor (Local) |
|----------|-----------|---------------|
| `DYNAMODB_TABLE` | Nome da tabela no DynamoDB | `billing-manager_Data` |
| `AWS_REGION` | Região da AWS | `us-east-1` |
| `PORT` | Porta da API | `8080` |
| `JWT_SECRET` | Chave secreta de assinatura JWT | `billing-manager-secret` |
| `DYNAMODB_ENDPOINT` | Endpoint customizado (Localstack) | `http://localhost:4566` |
| `S3_ENDPOINT` | Endpoint customizado (Localstack) | `http://localhost:4566` |
| `BILLING_BUCKET` | Bucket para relatórios | `billing-reports` |
| `BACKUP_BUCKET` | Bucket para backups | `database-backups` |

### Frontend (Next.js)
| Variável | Descrição | Valor (Local) |
|----------|-----------|---------------|
| `NEXT_PUBLIC_API_URL` | URL Base da API | `http://localhost:8080` |

---

## Rodando Localmente

### Usando Docker (Recomendado)
O comando abaixo sobe o Localstack, Backend, Frontend e faz o setup inicial:
```bash
make dev
# Equivalente: bash scripts/dev.sh
```

### Rodando Componentes Isolados (Com Docker)

#### Apenas Backend + Infra
```bash
make backend-dev
# Equivalente: docker compose up localstack backend setup-db seed -d
```

#### Apenas Frontend
```bash
make frontend-dev
# Equivalente: docker compose up frontend -d
```

### Rodando Manualmente (Sem Docker)

1. **Infra (Localstack):** `docker compose up localstack`
2. **Backend:**
   ```bash
   cd src/backend
   export DYNAMODB_ENDPOINT=http://localhost:4566
   go run cmd/api/main.go
   ```
3. **Frontend:**
   ```bash
   cd src/frontend
   npm install
   npm run dev
   ```

---

## Troubleshooting Comum

### 1. Erro de Permissão no Docker (ECR)
**Erro:** `failed to push image to ECR`
**Solução:** Garanta que você está logado na AWS CLI e rode:
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <YOUR_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
```

### 2. Mudanças no Frontend não aparecem (CloudFront)
O CloudFront faz cache agressivo. Para forçar a atualização em produção, você deve criar uma invalidação:
```bash
aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"
```
(Pode levar até 10 minutos).

### 3. Erro `Table not found` no Localstack
Tente reiniciar o ambiente e garantir que o script de seed rodou:
```bash
make dev-down # Equivalente: docker compose down
make dev      # Equivalente: bash scripts/dev.sh
```

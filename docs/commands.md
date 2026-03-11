# Referência de Comandos

Este documento contém todos os comandos disponíveis no projeto para automação de tarefas, organizados por categoria. Você pode usá-los via `make` ou executando os scripts/comandos manualmente.

## Ambiente de Produção (AWS Cloud)

O deploy em produção é totalmente automatizado e orquestrado.

| Objetivo | Comando Make | Comando Equivalente (Sem Make) |
|----------|--------------|--------------------------------|
| **Deploy Completo** | `make deploy-all` | `./scripts/deploy.sh` |
| **Destruir Tudo** | `make destroy-all` | `./scripts/deploy.sh --destroy` |
| **Puxar Mudanças** | `make deploy` | `make docker-push && make apply` |
| **Ver Custos** | `make infracost` | `infracost breakdown --path .` |

---

## Ambiente de Desenvolvimento (Local)

Para desenvolvimento local, utilizamos **Localstack** para simular serviços AWS e suporte a Hot-reload.

| Objetivo | Comando Make | Comando Equivalente |
|----------|--------------|--------------------------------|
| **Subir Local** | `make dev` | `bash scripts/dev.sh` |
| **Parar Local** | `make dev-down` | `docker compose down` |
| **Popular Banco** | `make seed` | `cd src/backend && go run seed/seed.go` |
| **Build Backend** | `make go-build` | `cd src/backend && go build ./...` |
| **Apenas Backend** | `make backend-dev` | `docker compose up localstack backend setup-db seed -d` |
| **Apenas Frontend** | `make frontend-dev` | `docker compose up frontend -d` |
| **Ver Logs** | `make logs` | `docker compose logs -f` |

---

## Gestão de Infraestrutura (Terraform)

Comandos granulares para controle manual da infraestrutura na AWS.

| Objetivo | Comando Make | Comando Equivalente |
|----------|--------------|--------------------------------|
| **Iniciar** | `make init` | `terraform init` |
| **Validar** | `make validate` | `terraform fmt -recursive && terraform validate` |
| **Planejar** | `make plan` | `terraform plan -var="backend_image_uri=dummy" -out=tfplan` |
| **Aplicar** | `make apply` | `terraform apply tfplan` |
| **Destruir** | `make destroy` | `terraform destroy -auto-approve` |

---

## Imagens e Binários

| Objetivo | Comando Make | Comando Equivalente |
|----------|--------------|--------------------------------|
| **Build Docker** | `make build` | `docker build -t billing-manager-backend src/backend` |
| **Push ECR** | `make docker-push` | `bash scripts/docker-push.sh $(REGION) $(ECR_REPO_URL)` |
| **Build Lambda** | `make lambda-build` | `bash scripts/build-lambda.sh src/lambda` |

---

## Como Apagar Tudo e Parar de Pagar

Testou e não quer deixar nada rodando na conta AWS? Sem dor de cabeça:

```bash
./scripts/deploy.sh --destroy
```

Para mais detalhes sobre o que acontece durante a destruição, veja o [Guia de Deployment](./deployment.md#o-que-acontece-quando-voce-destroi-tudo).

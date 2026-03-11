ECR_REPO_URL ?= <YOUR_ECR_REPO_URL>
REGION       ?= us-east-1
LAMBDA_DIR   := src/lambda
BACKEND_DIR  := src/backend

.PHONY: help init validate plan apply destroy \
        build docker-push deploy deploy-all \
        lambda-build infracost seed go-build dev dev-down \
        backend-dev frontend-dev logs

help: ## Exibir comandos
	@bash scripts/help.sh $(MAKEFILE_LIST)

deploy-all: ## Deploy completo
	@bash scripts/deploy.sh

destroy-all: ## Destruir tudo via script
	@bash scripts/deploy.sh --destroy

dev: ## Ambiente de desenvolvimento local (Localstack + Hot-reload)
	@bash scripts/dev.sh

dev-down: ## Parar ambiente de desenvolvimento
	docker compose down

backend-dev: ## Rodar apenas Backend + Infra local
	docker compose up localstack backend setup-db seed -d

frontend-dev: ## Rodar apenas Frontend local
	docker compose up frontend -d

logs: ## Ver logs dos containers locais
	docker compose logs -f

go-build: ## Build backend Go
	cd $(BACKEND_DIR) && go mod tidy && go build ./...

init: ## Iniciar Terraform
	terraform init

validate: ## Validar Terraform
	terraform fmt -recursive
	terraform validate

plan: validate ## Planejar Terraform
	terraform plan -var="backend_image_uri=dummy" -out=tfplan

apply: ## Aplicar Terraform
	terraform apply tfplan

destroy: ## Destruir Terraform
	terraform destroy -auto-approve

build: ## Build imagem Docker
	docker build -t billing-manager-backend $(BACKEND_DIR)

docker-push: build ## Push imagem ECR
	@bash scripts/docker-push.sh $(REGION) $(ECR_REPO_URL)

deploy: docker-push apply ## Deploy imagem e Terraform

lambda-build: ## Build do Lambda
	@bash scripts/build-lambda.sh $(LAMBDA_DIR)

seed: ## Seed DynamoDB
	cd $(BACKEND_DIR) && go run seed/seed.go

infracost: ## Custos Infracost
	infracost breakdown --path .

# Billing Manager

> Sistema de gestão de faturamento e assinaturas multi-tenant, rodando 100% Serverless na AWS.
<!-- 
[![Demonstração da Arquitetura](https://img.youtube.com/vi/6dii4RSVOYc/maxresdefault.jpg)](https://youtu.be/6dii4RSVOYc?si=gfCWHd2ZUcf_xzk8)

> **Clique na imagem acima** para assistir à demonstração em vídeo da arquitetura, decisões de FinOps e execução do projeto (10 minutos). -->

---

## Pré-requisitos (O Mínimo Possível)

Para garantir a portabilidade, a esteira de deploy foi desenhada para não exigir a instalação local de linguagens ou SDKs. Você só precisa de:

1. **AWS CLI (v2)**: Para credenciais de acesso à nuvem.
2. **Terraform (>= 1.6)**: Para provisionar toda a infraestrutura (IaC).
3. **Docker (>= 24)**: Utilizado de forma efêmera no script para isolar a compilação do backend (Go) e a geração de estáticos do frontend (Next.js).

---

## Quick Start (Deploy Automatizado)

Para subir toda a infraestrutura e a aplicação na sua conta AWS em poucos minutos:

1. **Configure suas credenciais AWS:**
   ```bash
   aws configure
   ```

2. **Execute o script de deploy:**
   ```bash
   ./scripts/deploy.sh
   ```

### Acesso Inicial

* **URL da Aplicação:** O link seguro do CloudFront será exibido no final do log do script (ou rode `terraform output cloudfront_url`).
* **Credenciais Padrão:**
  * **Email:** `admin@billing.io`
  * **Senha:** `Billing@2026`

---

## Documentação Completa

Para detalhes técnicos e arquiteturais, acesse a nossa base de conhecimento:

1. **[Arquitetura e Componentes](./docs/architecture.md)**: Diagramas, decisões de Zero Trust, Fargate Spot e stack tecnológica.
2. **[Guia da API](./docs/api.md)**: Autenticação JWT, lista de endpoints e exemplos de requisições.
3. **[Referência de Comandos](./docs/commands.md)**: Tabela completa de comandos Make vs Shell para produção e desenvolvimento.
4. **[Desenvolvimento Local](./docs/development.md)**: Como rodar o ambiente via Docker Compose, variáveis de ambiente e troubleshooting.
5. **[Guia de Deployment](./docs/deployment.md)**: Fluxo de atualização, CI/CD e gerenciamento de estado.
6. **[Estimativa de Custos](./docs/costs.md)**: Detalhamento de gastos (FinOps) e análise com Infracost.

---

## Comandos Operacionais Rápidos

| Objetivo | Comando (Com Make) | Comando Equivalente (Sem Make) |
| --- | --- | --- |
| **Deploy Completo** | `make deploy-all` | `./scripts/deploy.sh` |
| **Ambiente Local** | `make dev` | `bash scripts/dev.sh` |
| **Ver Logs Locais** | `make logs` | `docker compose logs -f` |
| **Pausar Local** | `make dev-down` | `docker compose down` |
| **Destruir AWS** | `make destroy-all` | `./scripts/deploy.sh --destroy` |

---

## Clean Up (Evite Custos)

Este projeto provisiona recursos reais na AWS (ECS Fargate, Application Load Balancer, etc.) que geram custos por hora.

Ao finalizar a sua avaliação, limpe o ambiente rodando:

```bash
./scripts/deploy.sh --destroy
```

*(Nota: Os buckets S3 estão configurados com `force_destroy = true` no Terraform, garantindo que a conta fique totalmente limpa).*

---

## Desenvolvido por

**Matheus Jucá**

* Projeto Pessoal - Arquitetura Cloud Serverless (Mapeando melhores práticas da AWS)

# Estimativa de Custos (Cloud)

Este documento detalha os custos estimados para rodar o projeto na AWS, utilizando como referência a região `us-east-1` e ferramentas como o Infracost.

## Resumo Mensal Estimado

O projeto foi desenhado para ser econômico, utilizando serviços Serverless sempre que possível.

| Serviço AWS | Configuração | Custo Estimado / Mês |
|-------------|--------------|----------------------|
| **ECS Fargate** | 1 Task (0.25 vCPU / 0.5GB) | ~$7.00 |
| **Application Load Balancer (ALB)** | 1 Load Balancer | ~$16.00 |
| **DynamoDB** | PAY_PER_REQUEST | Grátis (Tier baixo uso) |
| **CloudFront + S3** | Static Website Hosting | Grátis (Free Tier) |
| **AWS Lambda** | 1 invocação diária (Go) | < $0.01 |
| **Outros (ECR, Logs)** | Armazenamento de imagens/logs | ~$1.00 - $3.00 |

**Total Estimado:** **~$23.00 - $30.00 / mês**

---

## Detalhes por Componente

### 1. Computação (ECS Fargate)
O custo é baseado no consumo de vCPU e Memória por hora. Como o Backend Go é muito leve, a configuração mínima (0.25 vCPU) é suficiente para a maioria dos casos de uso inicial.

### 2. Networking (ALB)
O Application Load Balancer é o componente com custo fixo mais alto (~$0.0225 por hora). Ele é necessário para gerenciar o tráfego HTTP para os containers Fargate de forma segura e escalável.

### 3. Banco de Dados (DynamoDB)
No modelo `On-Demand` (PAY_PER_REQUEST), você só paga pelo que consome. Para um ambiente de homologação ou uso moderado, o Free Tier da AWS cobre praticamente todo o custo.

### 4. CDN e Storage (CloudFront & S3)
O Frontend estático é extremamente barato. O CloudFront oferece 1TB de transferência gratuita de dados, o que é mais que suficiente para esta aplicação.

---

## Como gerar uma estimativa atualizada?

Se você alterou a infraestrutura (ex: aumentou a CPU do ECS) e quer ver o impacto financeiro, o projeto já está configurado para o **Infracost**.

1. Certifique-se de ter o Infracost instalado.
2. Na raiz do projeto, execute:
```bash
make infracost
# Equivalente: infracost breakdown --path .
```

# Guia de Deployment

O deploy do projeto é orquestrado para ser o mais simples possível, utilizando Terraform e Docker.

## Fluxo de Deploy Automatizado

O script `./scripts/deploy.sh` executa as seguintes etapas:

1. **Build do Worker (Lambda):** Compila o binário Go para Linux/AMD64.
2. **Setup da Infra Base:** Inicia o Terraform e cria o Repositório ECR e Buckets S3.
3. **Build & Push da API:** Constrói a imagem Docker do backend e envia para o ECR.
4. **Aplicação do Cloud:** Sobe o ECS Fargate, ALB, CloudFront e rotinas EventBridge.
5. **Seeding:** Popula o DynamoDB com o usuário admin inicial.
6. **Frontend Deploy:** Faz o build estático do Next.js e sincroniza com o S3.

## Workflow de Atualização

Para atualizar uma aplicação já em produção:

1. **Faça suas alterações** no código (src/backend ou src/frontend).
2. **Commit & Push** para seu repositório Git.
3. **Rode o deploy:**
   ```bash
   make deploy
   ```
   *Nota: O `make deploy` é uma versão curta que apenas atualiza as imagens Docker e aplica o Terraform, sem refazer o build do frontend se não for necessário.*

## CI/CD (GitHub Actions)

O projeto inclui um setup básico de CI no diretório `.github/workflows/`:
- **Main Workflow:** Roda lints de terraform, validação de segurança e builds de fumaça a cada Pull Request.

## Limpeza e Custos (Destruir Tudo)

Para evitar surpresas na fatura da AWS ao terminar seu uso, utilize o comando:

```bash
./scripts/deploy.sh --destroy
# Ou via Makefile: make destroy-all
```

### O que acontece quando você destrói tudo?
Ao executar o comando de destruição, o Terraform processa a remoção completa da infraestrutura para garantir **custo zero** e limpeza total na conta AWS:

1.  **Recursos de Computação e Rede**: O cluster ECS, tasks Fargate, o Application Load Balancer (ALB) e toda a topologia de rede (VPC, Subnets, Gateways) são removidos, interrompendo qualquer cobrança por hora.
2.  **Armazenamento e Dados (Limpeza Forçada)**:
    *   **Buckets S3**: Configuramos `force_destroy = true` em todos os buckets. Isso significa que o Terraform esvazia automaticamente os arquivos (como relatórios CSV e backups) antes de deletar o bucket, evitando erros manuais.
    *   **DynamoDB**: A tabela NoSQL é excluída permanentemente, limpando todos os dados de clientes, faturas e usuários.
3.  **Artefatos e Observabilidade**:
    *   O repositório **ECR** e as imagens Docker da aplicação são apagados.
    *   Os **Log Groups** do CloudWatch (onde ficam os logs da API e da Lambda) são removidos para não deixar "lixo" no seu console AWS.
4.  **Segurança (IAM)**: Todas as Roles e Policies criadas especificamente para o projeto são revogadas, seguindo o princípio de segurança.

**O resultado final** é uma conta AWS limpa, exatamente como estava antes do deploy, sem cobranças residuais.

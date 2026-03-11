# Documentação da API

A API do sistema é construída em Go e segue princípios RESTful.

## Autenticação

A API utilizat **JWT Bearer Tokens** para proteger os endpoints.

1. O usuário faz login no endpoint `/api/auth/login`.
2. A API retorna um token e os dados do usuário.
3. Todas as requisições protegidas devem enviar o header:
   `Authorization: Bearer <seu_token_aqui>`

### Exemplo de Login

**Request:** `POST /api/auth/login`
```json
{
  "email": "admin@billing.io",
  "password": "Billing@2026"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "u_123",
    "name": "Admin Master",
    "email": "admin@billing.io",
    "company_id": "c_default",
    "role": "admin"
  }
}
```

---

## Endpoints Principais

### Clientes

#### Listar Clientes
**GET** `/api/customers`
- **Auth:** Necessário.
- **Retorno:** Lista de clientes da empresa logada.

#### Criar Cliente
**POST** `/api/customers`
- **Request:**
```json
{
  "name": "Empresa Exemplo LTDA",
  "email": "contato@exemplo.com",
  "document": "12.345.678/0001-90"
}
```

---

### Assinaturas (Subscriptions)

#### Criar Assinatura
**POST** `/api/subscriptions`
- **Request:**
```json
{
  "target_company_id": "c_customer_123",
  "amount": 450.00,
  "due_day": 10
}
```

---

### Invoices (Faturas)

#### Listar Faturas
**GET** `/api/invoices`
- **Filtros:** Retorna todas as faturas da empresa. Master admins veem tudo.

#### Registrar Pagamento
**PATCH** `/api/invoices/:id/pay`

---

---

## Referência Completa de Endpoints

### Autenticação e Usuários
| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/api/auth/login` | Login e retorno de tokens JWT |
| `POST` | `/api/auth/register` | Cadastro de novo usuário e empresa |
| `POST` | `/api/auth/register-for-company` | Cadastro de usuário em empresa existente |
| `POST` | `/api/auth/impersonate` | Login como outra empresa (Master Admin) |
| `DELETE`| `/api/users/:email` | Remover usuário por email (Master Admin) |

### Empresas
| Método | Rota | Descrição |
|--------|------|-----------|
| `GET`  | `/api/companies/me` | Dados da empresa logada |
| `GET`  | `/api/companies` | Lista todas as empresas (Master Admin) |
| `POST` | `/api/companies` | Criar nova empresa |

### Clientes e Assinaturas
| Método | Rota | Descrição |
|--------|------|-----------|
| `GET/POST` | `/api/customers` | Listagem e criação de clientes |
| `PUT/DELETE` | `/api/customers/:id` | Atualizar ou remover cliente |
| `GET/POST` | `/api/subscriptions` | Listagem e criação de assinaturas |
| `PUT/DELETE` | `/api/subscriptions/:id` | Atualizar ou remover assinatura |

### Faturas (Invoices)
| Método | Rota | Descrição |
|--------|------|-----------|
| `GET`  | `/api/invoices` | Listagem de faturas (todas ou por empresa) |
| `PATCH`| `/api/invoices/:id/pay` | Registrar pagamento de fatura |
| `DELETE`| `/api/invoices/:id` | Remover fatura |

### Operações e Sistema
| Método | Rota | Descrição |
|--------|------|-----------|
| `GET`  | `/health` | Health check do sistema |
| `POST` | `/api/operations/billing` | Trigger rotina de faturamento manual |
| `POST` | `/api/operations/backup` | Gerar dump JSON do banco no S3 |
| `GET`  | `/api/operations/reports` | Listar relatórios no S3 |
| `GET`  | `/api/operations/reports/download` | Link temporário para download |
| `POST` | `/api/routines/system/billing` | Trigger interno (Lambda/Cron) |

---

## Modelo de Dados — DynamoDB Single-Table

O projeto utiliza uma única tabela para todas as entidades, otimizando o acesso e reduzindo latência.

| Entidade | PK (Partition Key) | SK (Sort Key) | GSI / Acesso |
|----------|--------------------|---------------|--------------|
| **Company** | `COMPANY#<id>` | `COMPANY#<id>` | Cadastro principal da empresa |
| **User** | `COMPANY#<id>` | `USER#<id>` | `GSI1`: busca por email global |
| **Customer** | `COMPANY#<id>` | `CUSTOMER#<id>` | Lista de clientes por empresa |
| **Subscription** | `COMPANY#<id>` | `SUBSCRIPTION#<id>` | `GSI2`: Filtro por `STATUS#active` e `DUEDAY#DD` |
| **Invoice** | `COMPANY#<id>` | `INVOICE#<id>` | Histórico de cobrança por empresa |

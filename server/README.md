# Backend — Gestão de Despesas

API REST em Node.js/Express + PostgreSQL (via Prisma).

## Setup

1. Copie `.env.example` para `.env` e preencha `DATABASE_URL` (connection string do Neon) e `JWT_SECRET` (qualquer string longa e aleatória).
2. Instale as dependências:
   ```
   npm install
   ```
3. Rode a migration inicial (cria as tabelas no banco):
   ```
   npm run prisma:migrate
   ```
4. Inicie o servidor em modo desenvolvimento:
   ```
   npm run dev
   ```
   A API fica disponível em `http://localhost:3001/api`.

## Testes

```
npm run test
```

Os testes rodam contra o banco configurado em `DATABASE_URL` e limpam os usuários de teste que criam ao final.

## Endpoints (Fase 1)

- `POST /api/auth/register` `{ name, email, password }`
- `POST /api/auth/login` `{ email, password }`
- `GET /api/auth/me` (requer `Authorization: Bearer <token>`)
- `PATCH /api/auth/me` `{ salary }`
- `GET/POST /api/categories`, `PATCH/DELETE /api/categories/:id`
- `GET /api/expenses?month=YYYY-MM&categoryId=...`, `POST /api/expenses`, `PATCH/DELETE /api/expenses/:id`

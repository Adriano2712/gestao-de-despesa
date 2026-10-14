# Gestão de Despesas

Aplicação fullstack de controle de gastos pessoais: React (Vite) no frontend e uma API em Node.js/Express + PostgreSQL (Prisma) no backend.

## Funcionalidades

- Autenticação multiusuário (registro, login, JWT).
- Categorias de despesas personalizáveis.
- CRUD completo de despesas (criar, editar, excluir), com filtro por mês.
- Despesas recorrentes (ex: aluguel, assinaturas) — materializadas automaticamente todo mês.
- Orçamento por categoria com barra de progresso.
- Relatórios: totais por categoria, tendência dos últimos meses e exportação em CSV.

## Estrutura

```text
.                   # frontend (React + Vite)
  src/
server/             # backend (Express + Prisma)
  src/
  prisma/
```

## Pré-requisitos

- Node.js 18+
- Um banco PostgreSQL (recomendado: [Neon](https://neon.com), tem plano gratuito)

## Configurando o backend

```bash
cd server
cp .env.example .env
# edite .env: DATABASE_URL, DIRECT_URL (connection string do Neon) e JWT_SECRET (string aleatória longa)
npm install
npm run prisma:migrate   # cria as tabelas no banco
npm run dev               # inicia a API em http://localhost:3001/api
```

Rodar os testes do backend (sobem contra o banco configurado em `DATABASE_URL`):

```bash
cd server
npm run test
```

## Configurando o frontend

Na raiz do projeto:

```bash
cp .env.example .env   # VITE_API_URL, já aponta para http://localhost:3001/api por padrão
npm install
npm run dev             # inicia em http://localhost:5173
```

Outros comandos úteis:

```bash
npm run build   # build de produção
npm run lint    # ESLint
npm run test    # testes de componente (Vitest + Testing Library)
```

## Rodando tudo junto

Em dois terminais separados:

```bash
# terminal 1
cd server && npm run dev

# terminal 2
npm run dev
```

Acesse `http://localhost:5173`, crie uma conta e comece a usar.

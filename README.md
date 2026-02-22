# Treino do Dia

Monorepo com separação por contexto de responsabilidade.

## Estrutura

- `frontend/`: aplicação web (`Next.js` + `React` + `Tailwind`).
- `backend/`: API (estrutura inicial para implementação).
- `database/`: schema, migrações e seeds.
- `docker/`: containers locais (ex.: PostgreSQL).
- `infra/`: IaC e automações de infraestrutura.

## Banco de dados

- Proposta de modelagem: `docs/postgres-schema-proposta.md`
- Schema MVP aplicado: `database/schema.sql`
- Migração SQL inicial: `database/migrations/001_init_workout_logs.sql`

## Como rodar o frontend

```bash
cd frontend
npm install
npm run dev
```

## Como subir banco local com Docker

```bash
cd docker
cp ../.env.example ../.env
docker compose up --build -d
```

Consulte também `docker/README.md` para deploy em Ubuntu/AWS com Nginx.

## Prisma (backend)

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
```

Arquivos Prisma:

- `backend/prisma/schema.prisma`
- `backend/prisma/migrations/`

## Variáveis de ambiente

- Template único: `.env.example`
- Arquivo local real: `.env` (ignorado por git)
- Não commitar segredos em PR ou branch.

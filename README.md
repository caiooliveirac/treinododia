# Treino do Dia

Monorepo com separação por contexto de responsabilidade.

## Estrutura

- `frontend/`: aplicação web (`Next.js` + `React` + `Tailwind`).
- `backend/`: API (estrutura inicial para implementação).
- `database/`: schema, migrações e seeds.
- `docker/`: containers locais (ex.: PostgreSQL).
- `infra/`: IaC e automações de infraestrutura.

## Como rodar o frontend

```bash
cd frontend
npm install
npm run dev
```

## Como subir banco local com Docker

```bash
cd docker
docker compose up -d
```

Banco padrão: `postgres://treinododia:treinododia@localhost:5432/treinododia`
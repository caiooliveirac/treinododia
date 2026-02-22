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

### Execução rápida em máquina nova

Para subir liso após `git pull`:

```bash
cp .env.example .env
cd docker
docker compose down -v
docker compose up --build -d
```

Detalhes de troubleshooting (P3005, seed manual e 502 transitório): `docker/README.md`.

Observação importante sobre credenciais

- Após copiar `.env.example` para `.env`, edite imediatamente os valores sensíveis e gere credenciais únicas (ex.: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `ADMIN_PASSWORD`, `CLIENT_PASSWORD`, `AUTH_SESSION_SECRET`).
- Não reutilize senhas/usuários padrão entre desenvolvedores ou entre ambientes (dev/staging/production). Use um gerador de senhas forte e um cofre de segredos quando disponível.
- Antes de rodar migrações ou seeds, confirme que as credenciais foram alteradas. Se for necessário compartilhar acesso temporário, rotacione (mude) essas credenciais depois da operação.
- Nunca commite o arquivo `.env` ou credenciais reais no repositório; mantenha apenas `.env.example` versionado.

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

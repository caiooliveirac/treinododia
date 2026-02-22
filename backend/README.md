# Backend

API Node.js (`Express` + `Prisma`) do projeto `Treino do Dia`.

## Stack

- Node.js
- Express 5
- Prisma 6
- PostgreSQL 16
- Zod (validação)
- bcryptjs (hash de senhas)
- express-rate-limit (proteção contra brute force)

## Configuração e execução

1. Suba o banco:

```bash
cd ../docker
docker compose up -d
```

2. Configure ambiente e dependências:

```bash
cd ../backend
npm install
```

As variáveis são definidas no arquivo raiz `../.env` (template: `../.env.example`).

3. Gere Prisma Client:

```bash
npm run prisma:generate
```

4. Aplique migrations versionadas:

```bash
npm run prisma:deploy
```

5. Rode a API:

```bash
npm run dev
```

API padrão em: `http://localhost:3333`

Para execução em containers e deploy Ubuntu/AWS, veja `../docker/README.md`.

## Sessão administrativa

Defina credenciais administrativas no `.env`:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `AUTH_SESSION_SECRET`
- `AUTH_SESSION_TTL`

Login administrativo:

- `POST /api/auth/session`

Login de usuário final:

- `POST /api/auth/user-session`
- `GET /api/auth/me` (requer bearer token)

RBAC simples aplicado:

- `admin`: acesso total e endpoints de administração.
- `user`: acesso apenas aos próprios recursos (`userId` escopado).

Com `Authorization: Bearer <token>`, use os endpoints de administração:

- `GET /api/admin/dashboard`
- `GET /api/admin/users`
- `GET /api/admin/plans`

## Scripts

- `npm run dev`: sobe API com `nodemon`
- `npm run start`: sobe API em modo normal
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run prisma:deploy`
- `npm run prisma:studio`

## Endpoints

### Autenticação
- `POST /api/auth/session` — login admin (rate limited)
- `POST /api/auth/user-session` — login usuário (rate limited)
- `GET /api/auth/me` — sessão atual (requer bearer token)

### Administração (requer token admin)
- `GET /api/admin/dashboard`
- `GET /api/admin/users`
- `GET /api/admin/plans`

### Perfil (requer token usuário)
- `GET /api/profile`
- `PATCH /api/profile/password`

### Recursos
- `GET /health`
- `GET /api/users` | `POST /api/users`
- `GET /api/workout-logs` | `POST /api/workout-logs` | `PUT /api/workout-logs/:id` | `DELETE /api/workout-logs/:id`
- `GET /api/exercise-categories`
- `GET /api/exercises` | `POST /api/exercises`
- `GET /api/workout-plans` | `POST /api/workout-plans` | `PUT /api/workout-plans/:id` | `DELETE /api/workout-plans/:id`
- `GET /api/workout-sessions` | `POST /api/workout-sessions` | `DELETE /api/workout-sessions/:id`

### Segurança
- Rate limiter global: 120 req/min
- Rate limiter auth: 8 tentativas/min
- Senhas hasheadas com bcrypt (admin e usuários via seed)

## Modelagem API x Frontend

Veja o mapeamento de campos e recursos em:

- `docs/api-model.md`

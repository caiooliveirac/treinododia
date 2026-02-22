# Docker / Deploy (local e AWS Ubuntu)

Este projeto usa um único arquivo de ambiente em `/.env` para o `docker compose`.

## 1) Preparar variáveis sem expor segredos

No servidor Ubuntu (via SSH), dentro da pasta do projeto:

```bash
cp .env.example .env
nano .env
```

Preencha os campos sensíveis com valores fortes:

- `POSTGRES_PASSWORD`
- `ADMIN_PASSWORD`
- `CLIENT_PASSWORD`
- `AUTH_SESSION_SECRET`

## 2) Subir stack

```bash
cd docker
docker compose up --build -d
```

### Primeira execução em outra máquina (fluxo recomendado)

Para garantir que a base e os dados demo fiquem consistentes já no primeiro `pull`, rode:

```bash
cd docker
docker compose down -v
docker compose up --build -d
```

Isso força volume novo do Postgres e evita resíduos de execução anterior.

Serviços:

- PostgreSQL: **não exposto externamente**
- Backend: `127.0.0.1:3333`
- Frontend: `127.0.0.1:3000`

## 3) Validar execução

```bash
docker compose ps
docker compose logs backend --tail 100
docker compose logs frontend --tail 100
```

Validação rápida da API e dashboard:

```bash
curl -sS -X POST http://127.0.0.1:3333/api/auth/session \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@treinododia.com","password":"Admin123!"}'
```

## 4) Nginx (servidor já existente)

Exemplo de `server` para proxy local:

```nginx
location / {
  proxy_pass http://127.0.0.1:3000;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}

location /api/ {
  proxy_pass http://127.0.0.1:3333/api/;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}
```

Depois:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 5) Credenciais iniciais (seed)

São criadas/atualizadas automaticamente no `docker compose up` com base no `.env`:

- ADMIN: `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- CLIENTE: `CLIENT_EMAIL` / `CLIENT_PASSWORD`

## 6) Comandos úteis

```bash
cd docker
docker compose down
docker compose up --build -d
docker compose logs -f backend
```

## 7) Troubleshooting (erros reais já vistos)

### Erro `P3005` no `prisma migrate deploy`

Sintoma nos logs do backend:

```text
Error: P3005 The database schema is not empty
```

Contexto: esperado quando o Postgres já foi inicializado via `database/schema.sql` no `docker-entrypoint-initdb.d`.
O container segue para seed/start e a aplicação funciona normalmente.

### `npm run db:seed` manual falha com `localhost:5432`

Ao executar seed via `docker compose exec backend npm run db:seed`, pode falhar porque o `DATABASE_URL` do `.env` usa `localhost` (válido fora do container).

Dentro do container, use o host `db`:

```bash
cd docker
docker compose exec -T backend sh -lc 'export DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}?schema=public && npm run db:seed'
```

### `502` logo após rebuild/restart

Pode ocorrer janela curta enquanto backend/frontend reiniciam.
Espere 3-5 segundos e tente novamente.

```bash
curl -sS -X POST http://127.0.0.1:3333/api/auth/session \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@treinododia.com","password":"Admin123!"}'
```

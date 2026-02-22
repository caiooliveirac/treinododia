# Docker / Deploy (local e AWS Ubuntu)

Este projeto usa um único arquivo de ambiente em `/.env` para o `docker compose`.

## Arquitetura

```
┌──────────────────────────────────────────────────────────┐
│  docker compose                                          │
│                                                          │
│   ┌────────┐   :80     ┌───────────┐   :3000            │
│   │  nginx  │──/treinos──▶ frontend │                    │
│   │ (proxy) │  /treinos/api         │                    │
│   └──┬─────┘──────────▶┌───────────┐   :3333            │
│      │                  │  backend  │                    │
│      │                  └────┬──────┘                    │
│      │                       │                           │
│      │                  ┌────▼──────┐                    │
│      │                  │  postgres │   :5432 (interno)  │
│      │                  └───────────┘                    │
│      │                                                   │
│      │  ── perguntas_proxy ──────────────────────────    │
│      └──▶ (rede externa do Nginx de produção)            │
└──────────────────────────────────────────────────────────┘
```

O container **nginx** simula localmente o proxy reverso de produção:
- `/treinos` → frontend Next.js (basePath = `/treinos`)
- `/treinos/api/` → backend Express (API)
- `/` → página estática explicando que a raiz pertence a outra aplicação

Na **produção**, o Nginx externo (instalado no host) ocupa essa mesma função,
roteando `mnrs.com.br/treinos` para os containers.

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

> **⚠️ SEGURANÇA:** Imediatamente após copiar `.env.example` para `.env`,
> substitua **todas** as credenciais padrão por valores únicos.
> Altere `POSTGRES_USER` e `POSTGRES_PASSWORD` **antes** de inicializar o banco.
> Nunca commite o `.env` com segredos.

## 2) Subir stack

```bash
cd docker
docker compose up --build -d
```

Isso sobe 4 containers: **nginx**, **frontend**, **backend** e **db**.

Acesse a aplicação em: **http://localhost/treinos**

### Primeira execução em outra máquina (fluxo recomendado)

Para garantir que a base e os dados demo fiquem consistentes já no primeiro `pull`, rode:

```bash
cd docker
docker compose down -v
docker compose up --build -d
```

Isso força volume novo do Postgres e evita resíduos de execução anterior.

### Serviços e portas

| Serviço    | Container            | Porta interna | Porta externa       |
|------------|----------------------|---------------|---------------------|
| nginx      | treinododia-nginx    | 80            | `${NGINX_PORT:-80}` |
| frontend   | treinododia-frontend | 3000          | `127.0.0.1:3000`    |
| backend    | treinododia-backend  | 3333          | `127.0.0.1:3333`    |
| db         | treinododia-db       | 5432          | não exposto          |

> As portas 3000 e 3333 ficam em `127.0.0.1` para acesso direto durante debug.
> Em uso normal, acesse tudo pela porta 80 via Nginx.

## 3) Validar execução

```bash
# Status dos containers
docker compose ps

# Logs
docker compose logs nginx --tail 50
docker compose logs backend --tail 100
docker compose logs frontend --tail 100
```

Validação rápida via Nginx (como o browser faria):

```bash
# Health check
curl -sS http://localhost/treinos/health

# Login admin via proxy
curl -sS -X POST http://localhost/treinos/api/auth/session \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@treinododia.com","password":"Admin123!"}'
```

Ou acesso direto ao backend (bypass do proxy):

```bash
curl -sS -X POST http://127.0.0.1:3333/api/auth/session \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@treinododia.com","password":"Admin123!"}'
```

## 4) Nginx — configuração

### Local (container, já incluso)

O arquivo `docker/nginx.conf` é montado automaticamente no container nginx.
Não é necessário instalar Nginx no host para desenvolvimento.

Para editar rotas, altere `docker/nginx.conf` e reinicie:

```bash
docker compose restart nginx
```

### Produção (Nginx no host Ubuntu)

No servidor, crie um `server` block que aponte para os containers:

```nginx
server {
    listen 80;
    server_name mnrs.com.br;

    # Outra aplicação na raiz
    location / {
        proxy_pass http://127.0.0.1:PORTA_OUTRA_APP;
    }

    # Treino do Dia
    location /treinos/api/ {
        proxy_pass http://127.0.0.1:3333/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /treinos/ {
        proxy_pass http://127.0.0.1:3000/treinos/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location = /treinos {
        return 301 /treinos/;
    }
}
```

```bash
sudo nginx -t
sudo systemctl reload nginx
```

> Na produção, o container nginx local **não** precisa rodar —
> o Nginx do host assume o papel de proxy. Pode desabilitar com:
> `docker compose up -d --scale nginx=0`

## 5) Variáveis de ambiente relevantes para proxy

| Variável                 | Com Nginx (prod/local) | Sem Nginx (dev direto) |
|--------------------------|------------------------|------------------------|
| `CORS_ORIGIN`            | `http://localhost`     | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL`    | `/treinos`             | `http://localhost:3333` |
| `NEXT_PUBLIC_BASE_PATH`  | `/treinos`             | `/treinos`              |
| `NGINX_PORT`             | `80`                   | _(não usado)_           |

## 6) Credenciais iniciais (seed)

Rode o seed manualmente após a primeira subida:

```bash
cd docker
docker compose exec -T backend sh -lc \
  'export DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}?schema=public && npm run db:seed'
```

Credenciais criadas (definidas no `.env`):

- **ADMIN:** `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- **CLIENTE:** `CLIENT_EMAIL` / `CLIENT_PASSWORD`

## 7) Comandos úteis

```bash
cd docker

# Parar tudo
docker compose down

# Rebuild e subir
docker compose up --build -d

# Logs em tempo real
docker compose logs -f backend

# Restart apenas o proxy
docker compose restart nginx

# Escalar sem nginx (ex: em produção com Nginx no host)
docker compose up -d --scale nginx=0
```

## 8) Troubleshooting (erros reais já vistos)

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
curl -sS http://localhost/treinos/health
```

### Porta 80 já em uso

Se outro serviço já ocupa a porta 80, altere no `.env`:

```env
NGINX_PORT=8080
```

E acesse via `http://localhost:8080/treinos`.

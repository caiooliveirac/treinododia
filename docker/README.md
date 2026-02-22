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

# Frontend - Treino do Dia (Next.js + Tailwind)

Aplicação de registro de treinos migrada para `Next.js` + `React` com visual moderno inspirado em SaaS marketing template (estilo Radiant).

## Stack

- `Next.js` (App Router)
- `React`
- `Tailwind CSS`

## Estrutura Principal

```
frontend
├── app
│   ├── globals.css
│   ├── layout.jsx
│   └── page.jsx
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── README.md
```

## Como rodar

Antes, suba o backend (`http://localhost:3333`) e o PostgreSQL.

Este frontend agora representa o painel administrativo e exige autenticação via sessão (`/api/auth/session`).

1. Instale as dependências:

```bash
npm install
```

2. Ambiente de desenvolvimento:

```bash
npm run dev
```

Opcional (API em outra URL):

```bash
set NEXT_PUBLIC_API_URL=http://localhost:3333
```

3. Build de produção:

```bash
npm run build
npm run start
```

Abra `http://localhost:3000` no navegador.

## Funcionalidades atuais

- Login administrativo com sessão.
- Dashboard de métricas globais (usuários, planos, sessões, logs).
- Listagem administrativa paginada de usuários.
- Listagem administrativa paginada de planos.
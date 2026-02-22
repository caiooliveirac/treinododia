# My Web App (Next.js + Tailwind)

Aplicação de registro de treinos migrada para `Next.js` + `React` com visual moderno inspirado em SaaS marketing template (estilo Radiant).

## Stack

- `Next.js` (App Router)
- `React`
- `Tailwind CSS`

## Estrutura Principal

```
my-web-app
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

1. Instale as dependências:

```bash
npm install
```

2. Ambiente de desenvolvimento:

```bash
npm run dev
```

3. Build de produção:

```bash
npm run build
npm run start
```

Abra `http://localhost:3000` no navegador.

## Próximos passos sugeridos

- Salvar treinos em `localStorage`.
- Exibir histórico dos treinos.
- Adicionar filtros por data.
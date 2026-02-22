# Frontend - Treino do Dia (Next.js + Tailwind)

Aplicação de registro de treinos migrada para `Next.js` + `React` com visual moderno inspirado em SaaS marketing template (estilo Radiant).

## Stack

- `Next.js 15` (App Router, basePath = `/treinos`)
- `React 18`
- `Tailwind CSS 3` (dark mode via classe)
- `Recharts` (gráficos de progresso)

## Estrutura Principal

```
frontend
├── app
│   ├── globals.css
│   ├── layout.jsx          # Layout raiz, script anti-FOLT
│   ├── page.jsx            # Dashboard admin
│   ├── lib/
│   │   └── api.ts          # Client API (fetch wrappers)
│   └── usuario/
│       └── page.jsx        # Dashboard usuário
├── components/
│   ├── admin-dashboard/    # AdminLoginGate, AdminStatCard, AdminUsersTable, AdminPlansTable
│   ├── shared/             # DashboardNav, Toast, Spinner
│   └── user-dashboard/     # UserGreeting, WeeklySummaryCard, RecentWorkoutsList,
│                           # ProgressChart, RegisterWorkoutModal, RestTimer,
│                           # SessionComparison, InactivityAlert, FloatingRegisterButton
├── hooks/
│   ├── useAdminDashboard.js
│   ├── useUserDashboard.js
│   └── useDarkMode.js
├── lib/
│   └── formatters.js
├── package.json
├── tailwind.config.js
└── next.config.js
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

## Funcionalidades

### Admin (`/`)
- Login administrativo com sessão
- Dashboard de métricas globais (usuários, planos, sessões, logs)
- Tabela paginada de usuários (busca por email, Enter para buscar)
- Tabela paginada de planos (filtro ativo/inativo)
- Status message com auto-hide (4s)
- Confirmação de logout

### Usuário (`/usuario`)
- Login de usuário com sessão
- Resumo semanal (treinos, tempo, streak)
- Gráfico de progresso dos últimos 7 dias (Recharts)
- Últimos 5 treinos
- Comparação entre sessões (navegação por pares)
- Registro de treino rápido (log) e sessão completa (modal)
- Timer de descanso com presets, beep sonoro e vibração
- Alerta de inatividade (dias sem treinar)
- Toast de confirmação (sucesso/erro)
- Confirmação de logout

### Geral
- Dark mode (toggle no navbar, persiste em localStorage)
- Anti-FOLT (script bloqueante no `<head>` lê preferência antes do paint)
- Spinner de carregamento animado
- Responsivo mobile-first
- Dockerfile multi-stage (builder + runner)
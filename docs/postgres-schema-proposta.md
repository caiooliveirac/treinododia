# Proposta de modelagem PostgreSQL — alinhada ao estado atual do app

A UI atual registra **data do treino** e **descrição**. Então, a melhor estratégia é começar com um schema enxuto (MVP) e evoluir sem quebrar o que já existe.

## 1) Leitura do estado atual (produto)

Hoje a aplicação tem:

- Campo `dataDoTreino` (date).
- Campo `treinoDeHoje` (texto livre).
- Feedback de envio, sem persistência ainda.

Ou seja: o dado mínimo de negócio hoje é um **registro diário de treino**.

---

## 2) Recomendação de estrutura em fases

## Fase A (MVP imediato)

Implementar **somente o necessário** para salvar o formulário atual.

### Tabelas

1. `users`
   - Dono dos registros.
2. `workout_logs`
   - Uma linha por treino registrado no formulário atual.

### DDL sugerido (MVP)

```sql
create extension if not exists "pgcrypto";

create table users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

create table workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  workout_date date not null,
  description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- evita duplicidade acidental para o mesmo usuário no mesmo dia
  unique (user_id, workout_date)
);

create index idx_workout_logs_user_date
  on workout_logs(user_id, workout_date desc);
```

### Por que essa é a melhor base agora

- Combina 1:1 com os campos da tela.
- Reduz complexidade inicial de backend.
- Garante histórico e filtro por período sem custo alto.
- Permite evoluir para modelo avançado via migrations incrementais.

---

## Fase B (evolução quando entrar “plano de treino”)

Quando surgir necessidade de estruturar exercícios/séries:

- `exercise_categories`
- `exercises`
- `workout_plans`
- `workout_plan_exercises`

Nesse momento, `workout_logs.description` pode continuar existindo como “anotação livre”, mesmo com o treino estruturado.

---

## Fase C (execução detalhada e métricas)

Ao evoluir para análise real de performance:

- `workout_sessions` (sessão executada)
- `workout_session_sets` (séries realizadas)

A partir disso entram métricas como volume, PR e consistência semanal.

---

## 3) Modelo avançado (referência futura)

> Use somente quando a Fase B/C fizer sentido no produto.

```sql
create table exercise_categories (
  id smallserial primary key,
  slug text not null unique,
  name text not null
);

create table exercises (
  id uuid primary key default gen_random_uuid(),
  category_id smallint references exercise_categories(id),
  name text not null,
  equipment text,
  is_unilateral boolean not null default false,
  created_at timestamptz not null default now(),
  unique (category_id, name)
);

create table workout_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  title text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table workout_plan_exercises (
  id uuid primary key default gen_random_uuid(),
  workout_plan_id uuid not null references workout_plans(id) on delete cascade,
  exercise_id uuid not null references exercises(id),
  sort_order int not null,
  target_sets int,
  target_reps_min int,
  target_reps_max int,
  target_weight_kg numeric(6,2),
  rest_seconds int,
  notes text,
  unique (workout_plan_id, sort_order)
);

create table workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  workout_plan_id uuid references workout_plans(id) on delete set null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  feeling_score smallint check (feeling_score between 1 and 5),
  notes text,
  created_at timestamptz not null default now()
);

create table workout_session_sets (
  id uuid primary key default gen_random_uuid(),
  workout_session_id uuid not null references workout_sessions(id) on delete cascade,
  exercise_id uuid not null references exercises(id),
  set_number int not null,
  reps int,
  weight_kg numeric(6,2),
  rpe numeric(3,1),
  completed boolean not null default true,
  created_at timestamptz not null default now(),
  unique (workout_session_id, exercise_id, set_number)
);
```

---

## 4) Consultas úteis já no MVP

### Histórico por usuário

```sql
select id, workout_date, description
from workout_logs
where user_id = $1
order by workout_date desc
limit 50;
```

### Registros no período

```sql
select id, workout_date, description
from workout_logs
where user_id = $1
  and workout_date between $2 and $3
order by workout_date desc;
```

---

## 5) Próximos passos práticos

1. Criar migration `001_init_workout_logs.sql` com a Fase A.
2. Conectar o submit do formulário para persistir em `workout_logs`.
3. Criar endpoint/listagem de histórico por usuário.
4. Só então decidir se já vale entrar na Fase B.

Essa abordagem evita overengineering e respeita a organização atual do projeto.

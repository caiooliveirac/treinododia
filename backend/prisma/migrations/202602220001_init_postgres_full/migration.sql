-- Baseline migration: schema completo (MVP + evolução)
create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  role text not null default 'user',
  created_at timestamptz not null default now()
);

create table if not exists workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  workout_date date not null,
  description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, workout_date),
  check (char_length(trim(description)) > 0)
);

create index if not exists idx_workout_logs_user_date
  on workout_logs(user_id, workout_date desc);

create table if not exists exercise_categories (
  id smallserial primary key,
  slug text not null unique,
  name text not null,
  check (char_length(trim(slug)) > 0),
  check (char_length(trim(name)) > 0)
);

create table if not exists exercises (
  id uuid primary key default gen_random_uuid(),
  category_id smallint references exercise_categories(id),
  name text not null,
  equipment text,
  is_unilateral boolean not null default false,
  created_at timestamptz not null default now(),
  unique (category_id, name),
  check (char_length(trim(name)) > 0)
);

create table if not exists workout_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  title text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (char_length(trim(title)) > 0)
);

create index if not exists idx_workout_plans_user_id
  on workout_plans(user_id);

create table if not exists workout_plan_exercises (
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
  unique (workout_plan_id, sort_order),
  check (sort_order > 0),
  check (target_sets is null or target_sets > 0),
  check (target_reps_min is null or target_reps_min > 0),
  check (target_reps_max is null or target_reps_max > 0),
  check (
    target_reps_min is null
    or target_reps_max is null
    or target_reps_min <= target_reps_max
  ),
  check (target_weight_kg is null or target_weight_kg >= 0),
  check (rest_seconds is null or rest_seconds >= 0)
);

create index if not exists idx_workout_plan_exercises_plan
  on workout_plan_exercises(workout_plan_id);

create index if not exists idx_workout_plan_exercises_exercise
  on workout_plan_exercises(exercise_id);

create table if not exists workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  workout_plan_id uuid references workout_plans(id) on delete set null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  feeling_score smallint,
  notes text,
  created_at timestamptz not null default now(),
  check (feeling_score is null or feeling_score between 1 and 5),
  check (finished_at is null or finished_at >= started_at)
);

create index if not exists idx_workout_sessions_user_started
  on workout_sessions(user_id, started_at desc);

create index if not exists idx_workout_sessions_plan
  on workout_sessions(workout_plan_id);

create table if not exists workout_session_sets (
  id uuid primary key default gen_random_uuid(),
  workout_session_id uuid not null references workout_sessions(id) on delete cascade,
  exercise_id uuid not null references exercises(id),
  set_number int not null,
  reps int,
  weight_kg numeric(6,2),
  rpe numeric(3,1),
  completed boolean not null default true,
  created_at timestamptz not null default now(),
  unique (workout_session_id, exercise_id, set_number),
  check (set_number > 0),
  check (reps is null or reps >= 0),
  check (weight_kg is null or weight_kg >= 0),
  check (rpe is null or (rpe >= 0 and rpe <= 10))
);

create index if not exists idx_workout_session_sets_session
  on workout_session_sets(workout_session_id);

create index if not exists idx_workout_session_sets_exercise
  on workout_session_sets(exercise_id);

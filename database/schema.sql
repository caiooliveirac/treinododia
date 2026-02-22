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
	unique (user_id, workout_date)
);

create index if not exists idx_workout_logs_user_date
	on workout_logs(user_id, workout_date desc);

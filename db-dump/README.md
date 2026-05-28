# Database dump: `treinododia`

Generated on 2026-05-28T14:12:18Z before archiving this application.

## Contents
- `treinododia.sql.gz` — full pg_dump (gzipped), generated with:
  ```bash
  pg_dump -p 5432 -d treinododia --clean --if-exists --no-owner --no-privileges | gzip -9
  ```

## Tables
- users, exercises, exercise_categories, workout_plans, workout_plan_exercises, workout_sessions, workout_session_sets, workout_logs


## Restore
```bash
createdb treinododia
gunzip -c treinododia.sql.gz | psql -d treinododia
```

Or in one shot (PostgreSQL must already have the target user/db):
```bash
gunzip -c treinododia.sql.gz | psql -d treinododia
```

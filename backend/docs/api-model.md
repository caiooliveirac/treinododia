# Modelo de API inicial (baseado no banco)

## Recursos e campos principais

### users

- `id` (uuid)
- `email` (string, único)
- `passwordHash` (string)
- `role` (`admin` | `user`)
- `createdAt` (datetime)

### workout_logs

- `id` (uuid)
- `userId` (uuid)
- `workoutDate` (date)
- `description` (string)
- `createdAt` (datetime)
- `updatedAt` (datetime)

### exercise_categories

- `id` (smallint)
- `slug` (string, único)
- `name` (string)

### exercises

- `id` (uuid)
- `categoryId` (smallint, opcional)
- `name` (string)
- `equipment` (string, opcional)
- `isUnilateral` (boolean)
- `createdAt` (datetime)

### workout_plans

- `id` (uuid)
- `userId` (uuid)
- `title` (string)
- `description` (string, opcional)
- `isActive` (boolean)
- `createdAt` (datetime)
- `updatedAt` (datetime)

### workout_plan_exercises

- `id` (uuid)
- `workoutPlanId` (uuid)
- `exerciseId` (uuid)
- `sortOrder` (int > 0)
- `targetSets` (int, opcional)
- `targetRepsMin` (int, opcional)
- `targetRepsMax` (int, opcional)
- `targetWeightKg` (decimal, opcional)
- `restSeconds` (int, opcional)
- `notes` (string, opcional)

### workout_sessions

- `id` (uuid)
- `userId` (uuid)
- `workoutPlanId` (uuid, opcional)
- `startedAt` (datetime)
- `finishedAt` (datetime, opcional)
- `feelingScore` (1..5, opcional)
- `notes` (string, opcional)
- `createdAt` (datetime)

### workout_session_sets

- `id` (uuid)
- `workoutSessionId` (uuid)
- `exerciseId` (uuid)
- `setNumber` (int > 0)
- `reps` (int, opcional)
- `weightKg` (decimal, opcional)
- `rpe` (0..10, opcional)
- `completed` (boolean)
- `createdAt` (datetime)

## Endpoints implementados agora

- `GET /health`
- `POST /api/auth/session`
- `POST /api/auth/user-session`
- `GET /api/auth/me` (autenticado)
- `GET /api/admin/dashboard` (autenticado)
- `GET /api/admin/users` (autenticado)
- `GET /api/admin/plans` (autenticado)
- `GET /api/users`
- `POST /api/users`
- `GET /api/workout-logs`
- `POST /api/workout-logs`
- `GET /api/exercise-categories`
- `GET /api/exercises`
- `POST /api/exercises`
- `GET /api/workout-plans`
- `POST /api/workout-plans`
- `GET /api/workout-sessions`
- `POST /api/workout-sessions`

## Campos que o frontend deve considerar já na UI

- Filtros por usuário: `userId`
- Logs: `workoutDate`, `description`
- Plano: `title`, `description`, `isActive`, lista ordenada de exercícios
- Prescrição por exercício no plano: `targetSets`, `targetRepsMin/Max`, `targetWeightKg`, `restSeconds`, `notes`
- Sessão: `startedAt`, `finishedAt`, `feelingScore`, `notes`
- Set executado: `setNumber`, `reps`, `weightKg`, `rpe`, `completed`

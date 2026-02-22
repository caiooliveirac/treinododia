export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
  'http://localhost:3333';

export const ADMIN_SESSION_STORAGE_KEY = 'treinododia_admin_session_token';
export const USER_SESSION_STORAGE_KEY = 'treinododia_user_session_token';

type RequestOptions = RequestInit & {
  headers?: Record<string, string>;
};

async function request(path: string, options: RequestOptions = {}) {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch {
    throw new Error('Falha de conexão com o servidor. Atualize a página e tente novamente.');
  }

  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    throw new Error(body?.message || `Erro na API (${response.status})`);
  }

  return body;
}

function authHeader(token?: string) {
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

export function createAdminSession(payload: { email: string; password: string }) {
  return request('/api/auth/session', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function createUserSession(payload: { email: string; password: string }) {
  return request('/api/auth/user-session', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getCurrentSession(token: string) {
  return request('/api/auth/me', {
    headers: {
      ...authHeader(token),
    },
  });
}

export function getAdminDashboard(token: string) {
  return request('/api/admin/dashboard', {
    headers: {
      ...authHeader(token),
    },
  });
}

export function getAdminUsers(
  token: string,
  params: { q?: string; page?: number; pageSize?: number } = {}
) {
  const searchParams = new URLSearchParams();

  if (params.q) searchParams.set('q', params.q);
  if (params.page) searchParams.set('page', String(params.page));
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize));

  const query = searchParams.toString();

  return request(`/api/admin/users${query ? `?${query}` : ''}`, {
    headers: {
      ...authHeader(token),
    },
  });
}

export function getAdminPlans(
  token: string,
  params: { activeOnly?: boolean; page?: number; pageSize?: number } = {}
) {
  const searchParams = new URLSearchParams();

  if (params.activeOnly) searchParams.set('activeOnly', 'true');
  if (params.page) searchParams.set('page', String(params.page));
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize));

  const query = searchParams.toString();

  return request(`/api/admin/plans${query ? `?${query}` : ''}`, {
    headers: {
      ...authHeader(token),
    },
  });
}

export function getUserWorkoutLogs(
  token: string,
  userId: string,
  params: { from?: string; to?: string } = {}
) {
  const searchParams = new URLSearchParams({ userId });

  if (params.from) searchParams.set('from', params.from);
  if (params.to) searchParams.set('to', params.to);

  return request(`/api/workout-logs?${searchParams.toString()}`, {
    headers: {
      ...authHeader(token),
    },
  });
}

export function getUserWorkoutSessions(
  token: string,
  userId: string,
  params: { from?: string; to?: string } = {}
) {
  const searchParams = new URLSearchParams({ userId });

  if (params.from) searchParams.set('from', params.from);
  if (params.to) searchParams.set('to', params.to);

  return request(`/api/workout-sessions?${searchParams.toString()}`, {
    headers: {
      ...authHeader(token),
    },
  });
}

export async function getAuthenticatedUserWorkouts(token: string) {
  const me = await getCurrentSession(token);
  const userId = me?.session?.userId;

  if (!userId) {
    throw new Error('Sessão de usuário inválida.');
  }

  const [workoutLogs, workoutSessions] = await Promise.all([
    getUserWorkoutLogs(token, userId),
    getUserWorkoutSessions(token, userId),
  ]);

  return {
    session: me.session,
    workoutLogs: Array.isArray(workoutLogs) ? workoutLogs : [],
    workoutSessions: Array.isArray(workoutSessions) ? workoutSessions : [],
  };
}

export function createWorkoutLog(
  token: string,
  payload: { userId: string; workoutDate: string; description: string }
) {
  return request('/api/workout-logs', {
    method: 'POST',
    headers: { ...authHeader(token) },
    body: JSON.stringify(payload),
  });
}

export function createWorkoutSession(
  token: string,
  payload: {
    userId: string;
    workoutPlanId?: string;
    startedAt?: string;
    finishedAt?: string;
    feelingScore?: number;
    notes?: string;
    sets?: Array<{
      exerciseId: string;
      setNumber: number;
      reps?: number;
      weightKg?: number;
      rpe?: number;
      completed?: boolean;
    }>;
  }
) {
  return request('/api/workout-sessions', {
    method: 'POST',
    headers: { ...authHeader(token) },
    body: JSON.stringify(payload),
  });
}

export function getExercises(token: string, params: { categoryId?: number; q?: string } = {}) {
  const searchParams = new URLSearchParams();
  if (params.categoryId) searchParams.set('categoryId', String(params.categoryId));
  if (params.q) searchParams.set('q', params.q);
  const query = searchParams.toString();

  return request(`/api/exercises${query ? `?${query}` : ''}`, {
    headers: { ...authHeader(token) },
  });
}

export function getExerciseCategories(token: string) {
  return request('/api/exercise-categories', {
    headers: { ...authHeader(token) },
  });
}

export function getUserProfile(token: string) {
  return request('/api/profile', {
    headers: { ...authHeader(token) },
  });
}

export function changePassword(
  token: string,
  payload: { currentPassword: string; newPassword: string }
) {
  return request('/api/profile/password', {
    method: 'PATCH',
    headers: { ...authHeader(token) },
    body: JSON.stringify(payload),
  });
}

export function getUserWorkoutPlans(token: string, userId: string, activeOnly = false) {
  const searchParams = new URLSearchParams({ userId });
  if (activeOnly) searchParams.set('activeOnly', 'true');

  return request(`/api/workout-plans?${searchParams.toString()}`, {
    headers: { ...authHeader(token) },
  });
}

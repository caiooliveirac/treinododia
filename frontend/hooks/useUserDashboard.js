'use client';

import { useEffect, useState } from 'react';

import {
  createUserSession,
  createWorkoutLog,
  createWorkoutSession,
  getAuthenticatedUserWorkouts,
  USER_SESSION_STORAGE_KEY,
} from '../app/lib/api';

function startOfTodayDate() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function toDateOnlyKey(value) {
  return new Date(value).toISOString().slice(0, 10);
}

function calculateStreak(dateKeys) {
  if (!dateKeys.length) return 0;

  const dateSet = new Set(dateKeys);
  const today = startOfTodayDate();
  const todayKey = today.toISOString().slice(0, 10);

  // Start from today if trained today, otherwise from yesterday
  let cursor = new Date(today);
  if (!dateSet.has(todayKey)) {
    cursor.setDate(cursor.getDate() - 1);
    if (!dateSet.has(cursor.toISOString().slice(0, 10))) return 0;
  }

  let streak = 0;

  while (true) {
    const key = cursor.toISOString().slice(0, 10);

    if (!dateSet.has(key)) break;

    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function computeSessionDurationMinutes(session) {
  if (!session?.startedAt || !session?.finishedAt) return null;

  const startedAt = new Date(session.startedAt).getTime();
  const finishedAt = new Date(session.finishedAt).getTime();
  const delta = finishedAt - startedAt;

  if (Number.isNaN(delta) || delta <= 0) return null;

  return Math.round(delta / 60000);
}

function mapRecentWorkouts(logs, sessions) {
  const sessionItems = sessions.map((session) => ({
    id: session.id,
    title: session.workoutPlan?.title || session.notes || 'Sessão de treino',
    date: session.startedAt || session.createdAt,
    durationMinutes: computeSessionDurationMinutes(session),
  }));

  const logItems = logs.map((log) => ({
    id: log.id,
    title: log.description,
    date: log.workoutDate,
    durationMinutes: null,
  }));

  return [...sessionItems, ...logItems]
    .filter((item) => item.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
}

function mapWeeklySummary(logs, sessions) {
  const today = startOfTodayDate();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);

  const allWorkoutDates = [
    ...logs.map((log) => log.workoutDate),
    ...sessions.map((session) => session.startedAt || session.createdAt),
  ].filter(Boolean);

  const weeklyWorkouts = allWorkoutDates.filter((value) => {
    const date = new Date(value);
    return date >= sevenDaysAgo && date <= new Date(today.getTime() + 86399999);
  });

  const totalMinutes = sessions
    .map((session) => {
      const date = new Date(session.startedAt || session.createdAt);
      if (date < sevenDaysAgo || date > new Date(today.getTime() + 86399999)) return null;
      return computeSessionDurationMinutes(session);
    })
    .filter((minutes) => minutes !== null)
    .reduce((acc, minutes) => acc + minutes, 0);

  const streakDateKeys = Array.from(new Set(allWorkoutDates.map(toDateOnlyKey)));

  return {
    totalWorkouts: weeklyWorkouts.length,
    totalMinutes,
    streakDays: calculateStreak(streakDateKeys),
  };
}

function getNameFromSessionEmail(email) {
  if (!email) return 'Usuário';

  const base = email.split('@')[0] || 'Usuário';
  // Split on dots, dashes, underscores and capitalize each part
  return base
    .split(/[.\-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function useUserDashboard() {
  const [token, setToken] = useState('');
  const [loadingBoot, setLoadingBoot] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('Sessão de usuário obrigatória.');

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [userName, setUserName] = useState('Usuário');
  const [userId, setUserId] = useState('');
  const [summary, setSummary] = useState({
    totalWorkouts: 0,
    totalMinutes: 0,
    streakDays: 0,
  });
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [workoutSessions, setWorkoutSessions] = useState([]);
  const [lastWorkoutDate, setLastWorkoutDate] = useState(null);
  const [submittingWorkout, setSubmittingWorkout] = useState(false);

  const clearDashboardState = () => {
    setUserName('Usuário');
    setUserId('');
    setRecentWorkouts([]);
    setWorkoutSessions([]);
    setLastWorkoutDate(null);
    setSummary({
      totalWorkouts: 0,
      totalMinutes: 0,
      streakDays: 0,
    });
  };

  const handleLogout = () => {
    setToken('');
    clearDashboardState();
    window.sessionStorage.removeItem(USER_SESSION_STORAGE_KEY);
    setStatusMessage('Sessão encerrada.');
    setErrorMessage('');
    setLoading(false);
  };

  const loadDashboard = async (sessionToken = token) => {
    if (!sessionToken) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const { session, workoutLogs, workoutSessions } = await getAuthenticatedUserWorkouts(sessionToken);

      setUserName(getNameFromSessionEmail(session?.email));
      setUserId(session?.userId || '');
      setRecentWorkouts(mapRecentWorkouts(workoutLogs, workoutSessions));
      setSummary(mapWeeklySummary(workoutLogs, workoutSessions));
      setWorkoutSessions(workoutSessions);

      const allDates = [
        ...workoutLogs.map((l) => l.workoutDate),
        ...workoutSessions.map((s) => s.startedAt || s.createdAt),
      ].filter(Boolean);

      if (allDates.length > 0) {
        const sorted = allDates.sort((a, b) => new Date(b) - new Date(a));
        setLastWorkoutDate(sorted[0]);
      } else {
        setLastWorkoutDate(null);
      }

      setStatusMessage('Dashboard carregado com sucesso.');
    } catch (error) {
      clearDashboardState();
      setErrorMessage(error.message || 'Não foi possível carregar seu dashboard.');

      if (String(error.message || '').toLowerCase().includes('sessão')) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedToken = window.sessionStorage.getItem(USER_SESSION_STORAGE_KEY);

    if (savedToken) {
      setToken(savedToken);
      setStatusMessage('Sessão recuperada. Carregando dashboard...');
    }

    setLoadingBoot(false);
  }, []);

  useEffect(() => {
    if (!token) return;

    loadDashboard(token);
  }, [token]);

  const handleLogin = async (event) => {
    event.preventDefault();

    setAuthenticating(true);
    setStatusMessage('Validando credenciais...');

    try {
      const response = await createUserSession({
        email: loginEmail,
        password: loginPassword,
      });

      setToken(response.token);
      window.sessionStorage.setItem(USER_SESSION_STORAGE_KEY, response.token);
      setLoginPassword('');
      setStatusMessage('Sessão iniciada com sucesso.');
    } catch (error) {
      setStatusMessage(error.message || 'Não foi possível autenticar.');
    } finally {
      setAuthenticating(false);
    }
  };

  return {
    token,
    isAuthenticated: Boolean(token),
    loadingBoot,
    authenticating,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    statusMessage,
    loading,
    errorMessage,
    userName,
    userId,
    summary,
    recentWorkouts,
    workoutSessions,
    lastWorkoutDate,
    submittingWorkout,
    handleLogin,
    handleLogout,
    reload: loadDashboard,
    submitWorkoutLog: async (payload) => {
      if (!token || !userId) return;
      setSubmittingWorkout(true);
      try {
        await createWorkoutLog(token, { userId, ...payload });
        await loadDashboard(token);
      } finally {
        setSubmittingWorkout(false);
      }
    },
    submitWorkoutSession: async (payload) => {
      if (!token || !userId) return;
      setSubmittingWorkout(true);
      try {
        const finishedAt = new Date();
        const durationMs = (payload.durationMinutes || 60) * 60 * 1000;
        const startedAt = new Date(finishedAt.getTime() - durationMs);
        await createWorkoutSession(token, {
          userId,
          startedAt: startedAt.toISOString(),
          finishedAt: finishedAt.toISOString(),
          feelingScore: payload.feelingScore,
          notes: payload.notes,
        });
        await loadDashboard(token);
      } finally {
        setSubmittingWorkout(false);
      }
    },
  };
}

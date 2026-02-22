'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  ADMIN_SESSION_STORAGE_KEY,
  createAdminSession,
  getAdminDashboard,
  getAdminPlans,
  getAdminUsers,
} from '../app/lib/api';

const EMPTY_PAGINATION = { page: 1, pageSize: 10, total: 0, totalPages: 1 };

const EMPTY_TABLE = {
  items: [],
  pagination: EMPTY_PAGINATION,
};

const AUTO_HIDE_KEYWORDS = ['atualizado', 'iniciada', 'recuperada', 'encerrada'];

export function useAdminDashboard() {
  const [token, setToken] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  const [loginEmail, setLoginEmail] = useState('admin@treinododia.com');
  const [loginPassword, setLoginPassword] = useState('');

  const [summary, setSummary] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentPlans, setRecentPlans] = useState([]);

  const [usersPage, setUsersPage] = useState(1);
  const [usersQuery, setUsersQuery] = useState('');
  const [usersData, setUsersData] = useState(EMPTY_TABLE);

  const [plansPage, setPlansPage] = useState(1);
  const [plansActiveOnly, setPlansActiveOnly] = useState(false);
  const [plansData, setPlansData] = useState(EMPTY_TABLE);

  const [loadingBoot, setLoadingBoot] = useState(true);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Sessão administrativa obrigatória.');

  const statusTimerRef = useRef(null);

  const setStatusWithAutoHide = useCallback((msg) => {
    if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    setStatusMessage(msg);
    if (AUTO_HIDE_KEYWORDS.some((kw) => msg.toLowerCase().includes(kw))) {
      statusTimerRef.current = setTimeout(() => setStatusMessage(''), 4000);
    }
  }, []);

  const resetDashboardData = () => {
    setSummary(null);
    setRecentUsers([]);
    setRecentPlans([]);
    setUsersData(EMPTY_TABLE);
    setPlansData(EMPTY_TABLE);
  };

  const handleLogout = () => {
    setToken('');
    setAdminEmail('');
    resetDashboardData();
    window.sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
    setStatusWithAutoHide('Sessão encerrada.');
  };

  const loadAdminDashboard = async (sessionToken, options = {}) => {
    const usersPageToLoad = options.usersPage ?? usersPage;
    const plansPageToLoad = options.plansPage ?? plansPage;
    const usersQueryToLoad = options.usersQuery ?? usersQuery;
    const plansActiveOnlyToLoad = options.plansActiveOnly ?? plansActiveOnly;

    setLoadingDashboard(true);

    try {
      const [dashboard, usersResult, plansResult] = await Promise.all([
        getAdminDashboard(sessionToken),
        getAdminUsers(sessionToken, {
          page: usersPageToLoad,
          pageSize: 8,
          q: usersQueryToLoad || undefined,
        }),
        getAdminPlans(sessionToken, {
          page: plansPageToLoad,
          pageSize: 8,
          activeOnly: plansActiveOnlyToLoad,
        }),
      ]);

      setSummary(dashboard.summary);
      setRecentUsers(dashboard.recentUsers || []);
      setRecentPlans(dashboard.recentPlans || []);
      setUsersData(usersResult);
      setPlansData(plansResult);
      setStatusWithAutoHide('Painel administrativo atualizado.');
    } catch (error) {
      if (error.message.toLowerCase().includes('sessão')) {
        handleLogout();
      }

      setStatusWithAutoHide(error.message || 'Falha ao carregar dados administrativos.');
    } finally {
      setLoadingDashboard(false);
    }
  };

  useEffect(() => {
    const savedToken = window.sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY);

    if (savedToken) {
      setToken(savedToken);
      setStatusWithAutoHide('Sessão recuperada. Carregando painel...');
    }

    setLoadingBoot(false);
  }, []);

  useEffect(() => {
    if (!token) return;

    loadAdminDashboard(token);
  }, [token]);

  const handleLogin = async (event) => {
    event.preventDefault();

    setAuthenticating(true);
    setStatusWithAutoHide('Validando credenciais administrativas...');

    try {
      const response = await createAdminSession({
        email: loginEmail,
        password: loginPassword,
      });

      setToken(response.token);
      setAdminEmail(response.admin?.email || loginEmail);
      window.sessionStorage.setItem(ADMIN_SESSION_STORAGE_KEY, response.token);
      setLoginPassword('');
      setStatusWithAutoHide('Sessão administrativa iniciada.');
    } catch (error) {
      setStatusWithAutoHide(error.message || 'Não foi possível autenticar.');
    } finally {
      setAuthenticating(false);
    }
  };

  const reloadUsersTable = async (nextPage, nextQuery) => {
    setUsersPage(nextPage);
    setUsersQuery(nextQuery);

    if (!token) return;

    try {
      const usersResult = await getAdminUsers(token, {
        page: nextPage,
        pageSize: 8,
        q: nextQuery || undefined,
      });
      setUsersData(usersResult);
    } catch (error) {
      if (error.message.toLowerCase().includes('sessão')) handleLogout();
      setStatusWithAutoHide(error.message || 'Falha ao carregar usuários.');
    }
  };

  const reloadPlansTable = async (nextPage, nextActiveOnly) => {
    setPlansPage(nextPage);
    setPlansActiveOnly(nextActiveOnly);

    if (!token) return;

    try {
      const plansResult = await getAdminPlans(token, {
        page: nextPage,
        pageSize: 8,
        activeOnly: nextActiveOnly,
      });
      setPlansData(plansResult);
    } catch (error) {
      if (error.message.toLowerCase().includes('sessão')) handleLogout();
      setStatusWithAutoHide(error.message || 'Falha ao carregar planos.');
    }
  };

  return {
    token,
    adminEmail,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    summary,
    recentUsers,
    recentPlans,
    usersQuery,
    setUsersQuery,
    usersData,
    plansActiveOnly,
    plansData,
    loadingBoot,
    loadingDashboard,
    authenticating,
    statusMessage,
    handleLogin,
    handleLogout,
    reloadUsersTable,
    reloadPlansTable,
  };
}

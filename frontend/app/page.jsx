'use client';

import { API_BASE_URL } from './lib/api';
import { AdminLoginGate } from '../components/admin-dashboard/AdminLoginGate';
import { AdminPlansTable } from '../components/admin-dashboard/AdminPlansTable';
import { AdminStatCard } from '../components/admin-dashboard/AdminStatCard';
import { AdminUsersTable } from '../components/admin-dashboard/AdminUsersTable';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import { formatDateTimeBr } from '../lib/formatters';

function formatDate(value) {
  return formatDateTimeBr(value);
}

export default function HomePage() {
  const {
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
  } = useAdminDashboard();

  if (loadingBoot) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-orange-100 via-orange-50 to-white px-4 py-6 md:px-8 md:py-8">
        <section className="mx-auto max-w-4xl rounded-2xl border border-orange-200 bg-white p-8 text-center text-slate-700 shadow-lg shadow-orange-100/70">
          Carregando sessão...
        </section>
      </main>
    );
  }

  if (!token) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-orange-100 via-orange-50 to-white px-4 py-6 md:px-8 md:py-8">
        <AdminLoginGate
          apiBaseUrl={API_BASE_URL}
          loginEmail={loginEmail}
          setLoginEmail={setLoginEmail}
          loginPassword={loginPassword}
          setLoginPassword={setLoginPassword}
          authenticating={authenticating}
          statusMessage={statusMessage}
          onSubmit={handleLogin}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-100 via-orange-50 to-white px-4 py-6 md:px-8 md:py-8">
      <section className="mx-auto w-full max-w-7xl space-y-6">
        <header className="rounded-2xl border border-orange-200 bg-white p-5 shadow-lg shadow-orange-100/70 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700">
                Administração autenticada
              </span>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Dashboard administrativo da aplicação
              </h1>
              <p className="mt-2 text-sm text-slate-600">Sessão ativa: {adminEmail || loginEmail}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Encerrar sessão
            </button>
          </div>
          <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            {loadingDashboard ? 'Atualizando indicadores...' : statusMessage}
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-5">
          <AdminStatCard label="Usuários" value={summary?.totalUsers ?? '-'} />
          <AdminStatCard label="Planos" value={summary?.totalPlans ?? '-'} />
          <AdminStatCard label="Planos ativos" value={summary?.activePlans ?? '-'} />
          <AdminStatCard label="Sessões" value={summary?.totalSessions ?? '-'} />
          <AdminStatCard label="Logs" value={summary?.totalWorkoutLogs ?? '-'} />
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <article className="rounded-2xl border border-orange-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-slate-900">Usuários recentes</h2>
            <div className="mt-4 space-y-2">
              {recentUsers.length === 0 ? (
                <p className="text-sm text-slate-500">Sem registros recentes.</p>
              ) : (
                recentUsers.map((user) => (
                  <div key={user.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="text-sm font-medium text-slate-900">{user.email}</p>
                    <p className="text-xs text-slate-500">{formatDate(user.createdAt)}</p>
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="rounded-2xl border border-orange-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-slate-900">Planos atualizados</h2>
            <div className="mt-4 space-y-2">
              {recentPlans.length === 0 ? (
                <p className="text-sm text-slate-500">Sem registros recentes.</p>
              ) : (
                recentPlans.map((plan) => (
                  <div key={plan.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-slate-900">{plan.title}</p>
                      <span className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-700">
                        {plan.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{plan.user?.email || '-'}</p>
                  </div>
                ))
              )}
            </div>
          </article>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <AdminUsersTable
            usersQuery={usersQuery}
            setUsersQuery={setUsersQuery}
            usersData={usersData}
            onSearch={() => reloadUsersTable(1, usersQuery)}
            onPrev={() => reloadUsersTable(usersData.pagination.page - 1, usersQuery)}
            onNext={() => reloadUsersTable(usersData.pagination.page + 1, usersQuery)}
            formatDate={formatDate}
          />

          <AdminPlansTable
            plansActiveOnly={plansActiveOnly}
            plansData={plansData}
            onToggleActiveOnly={(event) => reloadPlansTable(1, event.target.checked)}
            onPrev={() => reloadPlansTable(plansData.pagination.page - 1, plansActiveOnly)}
            onNext={() => reloadPlansTable(plansData.pagination.page + 1, plansActiveOnly)}
          />
        </section>
      </section>
    </main>
  );
}

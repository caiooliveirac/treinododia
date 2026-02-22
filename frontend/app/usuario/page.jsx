"use client";

import { FloatingRegisterButton } from '../../components/user-dashboard/FloatingRegisterButton';
import { ProgressChartPlaceholder } from '../../components/user-dashboard/ProgressChartPlaceholder';
import { RecentWorkoutsList } from '../../components/user-dashboard/RecentWorkoutsList';
import { UserGreeting } from '../../components/user-dashboard/UserGreeting';
import { UserLoginGate } from '../../components/user-dashboard/UserLoginGate';
import { WeeklySummaryCard } from '../../components/user-dashboard/WeeklySummaryCard';
import { useUserDashboard } from '../../hooks/useUserDashboard';

export default function UserDashboardPage() {
  const {
    isAuthenticated,
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
    summary,
    recentWorkouts,
    handleLogin,
    handleLogout,
    reload,
  } = useUserDashboard();

  if (loadingBoot) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-orange-100 via-orange-50 to-white px-4 py-6 md:px-8 md:py-8">
        <section className="mx-auto max-w-4xl rounded-2xl border border-orange-200 bg-white p-8 text-center text-slate-700 shadow-lg shadow-orange-100/70">
          Carregando sessão...
        </section>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-orange-100 via-orange-50 to-white px-4 py-6 md:px-8 md:py-8">
        <UserLoginGate
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
    <main className="min-h-screen bg-gradient-to-b from-orange-100 via-orange-50 to-white px-4 pb-24 pt-6 md:px-8 md:pt-8">
      <section className="mx-auto w-full max-w-6xl space-y-4 md:space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <UserGreeting userName={userName} />
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            Sair
          </button>
        </div>

        {loading ? (
          <section className="rounded-2xl border border-orange-200 bg-white p-5 text-sm text-slate-600 shadow-lg shadow-orange-100/70">
            Carregando seus dados...
          </section>
        ) : null}

        {errorMessage ? (
          <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5 shadow-lg shadow-rose-100/70">
            <p className="text-sm text-rose-800">{errorMessage}</p>
            <button
              type="button"
              onClick={reload}
              className="mt-3 rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
            >
              Tentar novamente
            </button>
          </section>
        ) : null}

        <WeeklySummaryCard summary={summary} />

        <section className="grid gap-4 lg:grid-cols-5 md:gap-5">
          <div className="lg:col-span-3">
            <ProgressChartPlaceholder />
          </div>
          <div className="lg:col-span-2">
            <RecentWorkoutsList workouts={recentWorkouts} />
          </div>
        </section>
      </section>

      <FloatingRegisterButton />
    </main>
  );
}

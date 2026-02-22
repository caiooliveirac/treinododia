"use client";

import { useCallback, useState } from 'react';
import { FloatingRegisterButton } from '../../components/user-dashboard/FloatingRegisterButton';
import { InactivityAlert } from '../../components/user-dashboard/InactivityAlert';
import { ProgressChart } from '../../components/user-dashboard/ProgressChart';
import { RecentWorkoutsList } from '../../components/user-dashboard/RecentWorkoutsList';
import { RegisterWorkoutModal } from '../../components/user-dashboard/RegisterWorkoutModal';
import { RestTimer } from '../../components/user-dashboard/RestTimer';
import { SessionComparison } from '../../components/user-dashboard/SessionComparison';
import { Toast } from '../../components/shared/Toast';
import { Spinner } from '../../components/shared/Spinner';
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
    workoutSessions,
    lastWorkoutDate,
    submittingWorkout,
    handleLogin,
    handleLogout,
    reload,
    submitWorkoutLog,
    submitWorkoutSession,
  } = useUserDashboard();

  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, variant = 'success') => {
    setToast({ message, variant, key: Date.now() });
  }, []);

  const handleSubmitLog = async (payload) => {
    await submitWorkoutLog(payload);
    showToast('Treino registrado com sucesso!');
  };

  const handleSubmitSession = async (payload) => {
    await submitWorkoutSession(payload);
    showToast('Sessão registrada com sucesso!');
  };

  const confirmLogout = () => {
    if (window.confirm('Deseja realmente encerrar a sessão?')) {
      handleLogout();
    }
  };

  if (loadingBoot) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-orange-100 via-orange-50 to-white px-4 py-6 md:px-8 md:py-8 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <section className="mx-auto max-w-4xl rounded-2xl border border-orange-200 bg-white p-8 text-center text-slate-700 shadow-lg shadow-orange-100/70 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <Spinner label="Carregando sessão..." />
        </section>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-orange-100 via-orange-50 to-white px-4 py-6 md:px-8 md:py-8 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
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
    <main className="min-h-screen bg-gradient-to-b from-orange-100 via-orange-50 to-white pb-24 pt-6 px-4 md:px-8 md:pt-8 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <section className="mx-auto w-full max-w-6xl space-y-4 md:space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <UserGreeting userName={userName} />
          </div>
          <button
            type="button"
            onClick={confirmLogout}
            className="rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            Sair
          </button>
        </div>

        <InactivityAlert lastWorkoutDate={lastWorkoutDate} />

        {loading ? (
          <section className="rounded-2xl border border-orange-200 bg-white p-5 text-sm text-slate-600 shadow-lg shadow-orange-100/70 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            <Spinner label="Carregando seus dados..." />
          </section>
        ) : null}

        {errorMessage ? (
          <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5 shadow-lg shadow-rose-100/70 dark:border-rose-800 dark:bg-rose-900/20">
            <p className="text-sm text-rose-800 dark:text-rose-300">{errorMessage}</p>
            <button
              type="button"
              onClick={reload}
              className="mt-3 rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-600 dark:bg-slate-700 dark:text-rose-300"
            >
              Tentar novamente
            </button>
          </section>
        ) : null}

        <WeeklySummaryCard summary={summary} />

        <section className="grid gap-4 lg:grid-cols-5 md:gap-5">
          <div className="lg:col-span-3">
            <ProgressChart workoutSessions={workoutSessions} />
          </div>
          <div className="lg:col-span-2">
            <RecentWorkoutsList workouts={recentWorkouts} />
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2 md:gap-5">
          <SessionComparison workoutSessions={workoutSessions} />
          <RestTimer defaultSeconds={90} />
        </section>
      </section>

      <FloatingRegisterButton onClick={() => setModalOpen(true)} />

      <RegisterWorkoutModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmitLog={handleSubmitLog}
        onSubmitSession={handleSubmitSession}
        submitting={submittingWorkout}
      />

      {toast && (
        <Toast
          key={toast.key}
          message={toast.message}
          variant={toast.variant}
          onDone={() => setToast(null)}
        />
      )}
    </main>
  );
}

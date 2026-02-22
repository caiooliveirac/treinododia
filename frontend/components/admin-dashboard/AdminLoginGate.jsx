export function AdminLoginGate({
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  authenticating,
  statusMessage,
  onSubmit,
}) {
  return (
    <section className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-2">
      <article className="rounded-2xl border border-orange-200 bg-white p-6 shadow-lg shadow-orange-100/70 dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
        <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700 dark:border-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
          Administração
        </span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Painel do produto</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Esta área é restrita e destinada ao acompanhamento administrativo da aplicação: usuários, planos e sessões.
        </p>
        <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <li>• Visão consolidada de crescimento da base.</li>
          <li>• Leitura operacional de planos e atividade.</li>
          <li>• Etapa seguinte: UX dedicada ao usuário final.</li>
        </ul>
      </article>

      <article className="rounded-2xl border border-orange-200 bg-white p-6 shadow-lg shadow-orange-100/70 dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Acesso autenticado</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Faça login como administrador para abrir o dashboard.</p>

        <form className="mt-5 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="admin-email">
              Email administrativo
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={loginEmail}
              onChange={(event) => setLoginEmail(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-orange-900/40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="admin-password">
              Senha
            </label>
            <input
              id="admin-password"
              type="password"
              required
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-orange-900/40"
            />
          </div>

          <button
            type="submit"
            disabled={authenticating}
            className="w-full rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {authenticating ? 'Entrando...' : 'Entrar no painel'}
          </button>
        </form>

        <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-300">
          {statusMessage}
        </p>
      </article>
    </section>
  );
}

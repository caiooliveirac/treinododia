export function WeeklySummaryCard({ summary }) {
  const safe = summary ?? {};

  const metrics = [
    { label: 'Treinos na semana', value: safe.totalWorkouts ?? 0 },
    { label: 'Tempo total', value: `${safe.totalMinutes ?? 0} min` },
    { label: 'Streak atual', value: `${safe.streakDays ?? 0} dias` },
  ];

  return (
    <section className="rounded-2xl border border-orange-200 bg-white p-5 shadow-lg shadow-orange-100/70 dark:border-slate-700 dark:bg-slate-800">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Resumo semanal</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-700/50">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{metric.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{metric.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function WeeklySummaryCard({ summary }) {
  const metrics = [
    { label: 'Treinos na semana', value: summary.totalWorkouts },
    { label: 'Tempo total', value: `${summary.totalMinutes} min` },
    { label: 'Streak atual', value: `${summary.streakDays} dias` },
  ];

  return (
    <section className="rounded-2xl border border-orange-200 bg-white p-5 shadow-lg shadow-orange-100/70">
      <h2 className="text-lg font-semibold text-slate-900">Resumo semanal</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">{metric.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{metric.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ProgressChartPlaceholder() {
  const bars = [40, 70, 55, 85, 60, 75, 50];

  return (
    <section className="rounded-2xl border border-orange-200 bg-white p-5 shadow-lg shadow-orange-100/70">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-900">Progresso da semana</h2>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
          Placeholder
        </span>
      </div>

      <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
        <div className="flex h-40 items-end gap-2">
          {bars.map((value, index) => (
            <div key={index} className="flex-1 rounded-t-md bg-orange-300" style={{ height: `${value}%` }} />
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Área reservada para gráfico real de evolução (volume/carga/frequência).
        </p>
      </div>
    </section>
  );
}

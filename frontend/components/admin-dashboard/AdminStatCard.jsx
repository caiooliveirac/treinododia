export function AdminStatCard({ label, value }) {
  return (
    <article className="rounded-xl border border-orange-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
    </article>
  );
}

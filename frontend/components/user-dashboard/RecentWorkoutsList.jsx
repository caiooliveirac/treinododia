import { formatDateBr } from '../../lib/formatters';

export function RecentWorkoutsList({ workouts }) {
  return (
    <section className="rounded-2xl border border-orange-200 bg-white p-5 shadow-lg shadow-orange-100/70 dark:border-slate-700 dark:bg-slate-800">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Últimos 5 treinos</h2>
      <div className="mt-4 space-y-3">
        {workouts.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Nenhum treino encontrado.</p>
        ) : (
          workouts.map((workout) => (
            <article key={workout.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-700/50">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{workout.title}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{formatDateBr(workout.date)}</p>
                </div>
                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
                  {workout.durationMinutes ?? '--'} min
                </span>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

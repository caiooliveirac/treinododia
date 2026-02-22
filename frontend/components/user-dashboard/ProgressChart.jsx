'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

function buildWeeklyChartData(workoutSessions) {
  const today = new Date();
  const days = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const key = date.toISOString().slice(0, 10);
    const dayLabel = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(date);

    days.push({
      key,
      label: dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1).replace('.', ''),
      volume: 0,
      sets: 0,
      duration: 0,
    });
  }

  for (const session of workoutSessions) {
    const sessionDate = (session.startedAt || session.createdAt || '').slice(0, 10);
    const dayEntry = days.find((d) => d.key === sessionDate);

    if (!dayEntry) continue;

    if (session.sets && Array.isArray(session.sets)) {
      for (const set of session.sets) {
        if (set.completed !== false) {
          dayEntry.sets += 1;
          const reps = set.reps || 0;
          const weight = set.weightKg || 0;
          dayEntry.volume += reps * weight;
        }
      }
    }

    if (session.startedAt && session.finishedAt) {
      const start = new Date(session.startedAt).getTime();
      const end = new Date(session.finishedAt).getTime();
      const delta = end - start;
      if (delta > 0) {
        dayEntry.duration += Math.round(delta / 60000);
      }
    }
  }

  return days;
}

function formatVolume(value) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}

export function ProgressChart({ workoutSessions = [] }) {
  const data = buildWeeklyChartData(workoutSessions);
  const hasData = data.some((d) => d.volume > 0 || d.sets > 0 || d.duration > 0);

  return (
    <section className="rounded-2xl border border-orange-200 bg-white p-5 shadow-lg shadow-orange-100/70 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Progresso da semana</h2>
        <span className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700 dark:border-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
          Últimos 7 dias
        </span>
      </div>

      {!hasData ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center dark:border-slate-600 dark:bg-slate-700/50">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Nenhum treino registrado nos últimos 7 dias. Registre uma sessão para ver seu progresso aqui.
          </p>
        </div>
      ) : (
        <div className="mt-4">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" tickFormatter={formatVolume} />
              <Tooltip
                contentStyle={{
                  borderRadius: '0.75rem',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.8rem',
                }}
                formatter={(value, name) => {
                  if (name === 'Volume (kg)') return [`${value.toLocaleString('pt-BR')} kg`, name];
                  if (name === 'Séries') return [value, name];
                  return [`${value} min`, name];
                }}
              />
              <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
              <Bar dataKey="volume" name="Volume (kg)" fill="#f97316" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sets" name="Séries" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="duration" name="Duração (min)" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-orange-50 p-2 dark:bg-orange-900/20">
              <p className="text-xs text-slate-500 dark:text-slate-400">Volume total</p>
              <p className="text-sm font-bold text-orange-700 dark:text-orange-300">
                {data.reduce((acc, d) => acc + d.volume, 0).toLocaleString('pt-BR')} kg
              </p>
            </div>
            <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/20">
              <p className="text-xs text-slate-500 dark:text-slate-400">Total séries</p>
              <p className="text-sm font-bold text-blue-700 dark:text-blue-300">
                {data.reduce((acc, d) => acc + d.sets, 0)}
              </p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-2 dark:bg-emerald-900/20">
              <p className="text-xs text-slate-500 dark:text-slate-400">Tempo total</p>
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                {data.reduce((acc, d) => acc + d.duration, 0)} min
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

'use client';

import { useState } from 'react';

export function SessionComparison({ workoutSessions = [] }) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const sorted = [...workoutSessions]
    .sort((a, b) => new Date(b.startedAt || b.createdAt) - new Date(a.startedAt || a.createdAt));

  if (sorted.length < 2) {
    return (
      <section className="rounded-2xl border border-orange-200 bg-white p-5 shadow-lg shadow-orange-100/70 dark:border-slate-700 dark:bg-slate-800">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Comparação entre sessões</h2>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Registre pelo menos 2 sessões para comparar sua evolução.
        </p>
      </section>
    );
  }

  // selectedIdx is the index of the "latest" session; compare with selectedIdx+1
  const maxIdx = sorted.length - 2;
  const safeIdx = Math.min(selectedIdx, maxIdx);
  const latest = sorted[safeIdx];
  const previous = sorted[safeIdx + 1];

  function computeSessionVolume(session) {
    return (session.sets || []).reduce((acc, set) => {
      if (set.completed === false) return acc;
      return acc + (set.reps || 0) * (set.weightKg || 0);
    }, 0);
  }

  function computeMaxWeight(session) {
    return Math.max(0, ...(session.sets || []).map((s) => s.weightKg || 0));
  }

  function computeTotalSets(session) {
    return (session.sets || []).filter((s) => s.completed !== false).length;
  }

  const latestVolume = computeSessionVolume(latest);
  const previousVolume = computeSessionVolume(previous);
  const volumeDiff = latestVolume - previousVolume;

  const latestMax = computeMaxWeight(latest);
  const previousMax = computeMaxWeight(previous);
  const maxDiff = latestMax - previousMax;

  const latestSets = computeTotalSets(latest);
  const previousSets = computeTotalSets(previous);
  const setsDiff = latestSets - previousSets;

  function diffBadge(diff, suffix = '') {
    if (diff === 0) return <span className="text-xs text-slate-500">=</span>;
    const positive = diff > 0;
    return (
      <span className={`text-xs font-semibold ${positive ? 'text-emerald-600' : 'text-rose-600'}`}>
        {positive ? '▲' : '▼'} {Math.abs(diff).toLocaleString('pt-BR')}{suffix}
      </span>
    );
  }

  const formatDate = (d) =>
    d
      ? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(new Date(d))
      : '-';

  return (
    <section className="rounded-2xl border border-orange-200 bg-white p-5 shadow-lg shadow-orange-100/70 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Comparação entre sessões</h2>
        {sorted.length > 2 && (
          <div className="flex gap-1">
            <button
              type="button"
              disabled={safeIdx <= 0}
              onClick={() => setSelectedIdx((i) => Math.max(0, i - 1))}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs disabled:opacity-40 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
              title="Par mais recente"
            >
              ←
            </button>
            <button
              type="button"
              disabled={safeIdx >= maxIdx}
              onClick={() => setSelectedIdx((i) => Math.min(maxIdx, i + 1))}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs disabled:opacity-40 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
              title="Par mais antigo"
            >
              →
            </button>
          </div>
        )}
      </div>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {formatDate(previous.startedAt || previous.createdAt)} → {formatDate(latest.startedAt || latest.createdAt)}
      </p>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <article className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center dark:border-slate-600 dark:bg-slate-700/50">
          <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Volume</p>
          <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
            {latestVolume.toLocaleString('pt-BR')} <span className="text-xs font-normal">kg</span>
          </p>
          {diffBadge(volumeDiff, ' kg')}
        </article>

        <article className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center dark:border-slate-600 dark:bg-slate-700/50">
          <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Carga máx</p>
          <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
            {latestMax} <span className="text-xs font-normal">kg</span>
          </p>
          {diffBadge(maxDiff, ' kg')}
        </article>

        <article className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center dark:border-slate-600 dark:bg-slate-700/50">
          <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Séries</p>
          <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{latestSets}</p>
          {diffBadge(setsDiff)}
        </article>
      </div>
    </section>
  );
}

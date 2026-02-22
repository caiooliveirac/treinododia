'use client';

import { useEffect, useRef, useState } from 'react';

export function RegisterWorkoutModal({ open, onClose, onSubmitLog, onSubmitSession, submitting }) {
  const [mode, setMode] = useState('log');
  const [workoutDate, setWorkoutDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');
  const [feelingScore, setFeelingScore] = useState(3);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const backdropRef = useRef(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) onClose();
  };

  const handleSubmitLog = async (e) => {
    e.preventDefault();
    setError('');

    if (!description.trim()) {
      setError('Descrição do treino é obrigatória.');
      return;
    }

    try {
      await onSubmitLog({ workoutDate, description: description.trim() });
      setDescription('');
      setWorkoutDate(new Date().toISOString().slice(0, 10));
      onClose();
    } catch (err) {
      setError(err.message || 'Erro ao registrar treino.');
    }
  };

  const handleSubmitSession = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await onSubmitSession({
        feelingScore,
        durationMinutes,
        notes: notes.trim() || undefined,
      });
      setNotes('');
      setFeelingScore(3);
      setDurationMinutes(60);
      onClose();
    } catch (err) {
      setError(err.message || 'Erro ao registrar sessão.');
    }
  };

  const feelings = [
    { score: 1, emoji: '😫', label: 'Péssimo' },
    { score: 2, emoji: '😕', label: 'Ruim' },
    { score: 3, emoji: '😐', label: 'OK' },
    { score: 4, emoji: '😊', label: 'Bom' },
    { score: 5, emoji: '🔥', label: 'Ótimo' },
  ];

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-2xl border border-orange-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Registrar treino</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setMode('log')}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              mode === 'log'
                ? 'bg-orange-500 text-white'
                : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200'
            }`}
          >
            Registro rápido
          </button>
          <button
            type="button"
            onClick={() => setMode('session')}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              mode === 'session'
                ? 'bg-orange-500 text-white'
                : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200'
            }`}
          >
            Sessão completa
          </button>
        </div>

        {error && (
          <p className="mt-3 rounded-lg bg-rose-50 p-2 text-sm text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
            {error}
          </p>
        )}

        {mode === 'log' ? (
          <form className="mt-4 space-y-4" onSubmit={handleSubmitLog}>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="reg-date">
                Data do treino
              </label>
              <input
                id="reg-date"
                type="date"
                value={workoutDate}
                onChange={(e) => setWorkoutDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="reg-desc">
                Descrição
              </label>
              <textarea
                id="reg-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Treino A - Agachamento 4x6, Supino 4x8..."
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
            >
              {submitting ? 'Salvando...' : 'Salvar registro'}
            </button>
          </form>
        ) : (
          <form className="mt-4 space-y-4" onSubmit={handleSubmitSession}>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Como você se sentiu?
              </label>
              <div className="mt-2 flex justify-between gap-1">
                {feelings.map((f) => (
                  <button
                    key={f.score}
                    type="button"
                    onClick={() => setFeelingScore(f.score)}
                    className={`flex flex-1 flex-col items-center rounded-xl p-2 text-sm transition ${
                      feelingScore === f.score
                        ? 'border-2 border-orange-400 bg-orange-50 dark:border-orange-500 dark:bg-orange-900/30'
                        : 'border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700'
                    }`}
                  >
                    <span className="text-xl">{f.emoji}</span>
                    <span className="mt-1 text-[10px] text-slate-600 dark:text-slate-300">{f.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="session-duration">
                Duração (minutos)
              </label>
              <input
                id="session-duration"
                type="number"
                min={1}
                max={300}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="session-notes">
                Notas (opcional)
              </label>
              <textarea
                id="session-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Como foi o treino? Observações..."
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
            >
              {submitting ? 'Salvando...' : 'Registrar sessão'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

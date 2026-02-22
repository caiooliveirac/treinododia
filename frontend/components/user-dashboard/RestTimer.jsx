'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function RestTimer({ defaultSeconds = 90 }) {
  const [seconds, setSeconds] = useState(defaultSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef(null);

  const stop = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    setIsFinished(false);
    setIsRunning(true);
  }, []);

  const reset = useCallback(() => {
    stop();
    setSeconds(defaultSeconds);
    setIsFinished(false);
  }, [defaultSeconds, stop]);

  const playBeep = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.value = 0.3;
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.value = 1100;
        gain2.gain.value = 0.3;
        osc2.start();
        osc2.stop(ctx.currentTime + 0.3);
      }, 300);
    } catch { /* AudioContext not available */ }

    try { navigator.vibrate?.([200, 100, 200]); } catch { /* vibrate not available */ }
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          stop();
          setIsFinished(true);
          playBeep();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, stop]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const progress = defaultSeconds > 0 ? ((defaultSeconds - seconds) / defaultSeconds) * 100 : 0;

  const presets = [30, 60, 90, 120, 180];

  return (
    <section className="rounded-2xl border border-orange-200 bg-white p-5 shadow-lg shadow-orange-100/70 dark:border-slate-700 dark:bg-slate-800">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Timer de descanso</h2>

      <div className="mt-4 flex flex-col items-center">
        <div className="relative flex h-32 w-32 items-center justify-center">
          <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="6" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={isFinished ? '#ef4444' : '#f97316'}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <span
            className={`text-2xl font-bold ${
              isFinished
                ? 'animate-pulse text-red-500'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            {display}
          </span>
        </div>

        {isFinished && (
          <p className="mt-2 animate-bounce text-sm font-semibold text-red-500">
            Descanso finalizado! Próxima série 💪
          </p>
        )}

        <div className="mt-4 flex gap-2">
          {!isRunning && !isFinished && (
            <button
              type="button"
              onClick={start}
              className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Iniciar
            </button>
          )}
          {isRunning && (
            <button
              type="button"
              onClick={stop}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
            >
              Pausar
            </button>
          )}
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
          >
            Resetar
          </button>
        </div>

        <div className="mt-4 flex gap-1.5">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                stop();
                setSeconds(preset);
                setIsFinished(false);
              }}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                seconds === preset && !isRunning
                  ? 'bg-orange-500 text-white'
                  : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300'
              }`}
            >
              {preset >= 60 ? `${preset / 60}min` : `${preset}s`}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

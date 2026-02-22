'use client';

import { useEffect, useState } from 'react';

const VARIANTS = {
  success: 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  error: 'border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  info: 'border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
};

export function Toast({ message, variant = 'success', duration = 3000, onDone }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDone?.(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDone]);

  return (
    <div
      className={`fixed bottom-24 left-1/2 z-[60] -translate-x-1/2 rounded-xl border px-5 py-3 text-sm font-medium shadow-lg transition-all duration-300 md:bottom-24 ${
        VARIANTS[variant] || VARIANTS.info
      } ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}

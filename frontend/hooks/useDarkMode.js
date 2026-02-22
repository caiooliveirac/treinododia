'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'treinododia_dark_mode';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (saved === 'true') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else if (saved === 'false') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
      if (prefersDark) document.documentElement.classList.add('dark');
    }
  }, []);

  const toggle = () => {
    setIsDark((prev) => {
      const next = !prev;
      window.localStorage.setItem(STORAGE_KEY, String(next));

      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      return next;
    });
  };

  return { isDark, toggle };
}

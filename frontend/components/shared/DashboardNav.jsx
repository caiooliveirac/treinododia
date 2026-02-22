'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDarkMode } from '../../hooks/useDarkMode';

function linkClass(isActive) {
  if (isActive) {
    return 'rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white dark:bg-orange-600';
  }

  return 'rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600';
}

export function DashboardNav() {
  const pathname = usePathname();
  const { isDark, toggle } = useDarkMode();

  return (
    <header className="sticky top-0 z-30 border-b border-orange-200 bg-white/95 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <p className="text-sm font-semibold text-slate-800 dark:text-white">Treino do Dia</p>
        <div className="flex items-center gap-2">
          <nav className="flex items-center gap-2" aria-label="Alternar dashboards">
            <Link href="/" className={linkClass(pathname === '/')}>
              Admin
            </Link>
            <Link href="/usuario" className={linkClass(pathname === '/usuario')}>
              Usuário
            </Link>
          </nav>
          <button
            type="button"
            onClick={toggle}
            className="ml-2 rounded-lg border border-slate-300 bg-white p-1.5 text-sm transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600"
            aria-label="Alternar modo escuro"
            title={isDark ? 'Modo claro' : 'Modo escuro'}
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

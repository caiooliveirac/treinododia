'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function linkClass(isActive) {
  if (isActive) {
    return 'rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white';
  }

  return 'rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100';
}

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-orange-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <p className="text-sm font-semibold text-slate-800">Treino do Dia</p>
        <nav className="flex items-center gap-2" aria-label="Alternar dashboards">
          <Link href="/" className={linkClass(pathname === '/')}>
            Admin
          </Link>
          <Link href="/usuario" className={linkClass(pathname === '/usuario')}>
            Usuário
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function UserGreeting({ userName }) {
  const hour = new Date().getHours();

  let greeting = 'Olá';

  if (hour < 12) greeting = 'Bom dia';
  else if (hour < 18) greeting = 'Boa tarde';
  else greeting = 'Boa noite';

  return (
    <header className="rounded-2xl border border-orange-200 bg-white p-5 shadow-lg shadow-orange-100/70">
      <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">Painel do usuário</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
        {greeting}, {userName}
      </h1>
      <p className="mt-2 text-sm text-slate-600 md:text-base">
        Veja seu progresso da semana e acompanhe seus últimos treinos.
      </p>
    </header>
  );
}

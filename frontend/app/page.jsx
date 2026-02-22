'use client';

import { useMemo, useState } from 'react';

function getTodayISO() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function HomePage() {
  const initialDate = useMemo(() => getTodayISO(), []);
  const [date, setDate] = useState(initialDate);
  const [description, setDescription] = useState('');
  const [feedback, setFeedback] = useState('Registro de treinos');

  const handleSubmit = (event) => {
    event.preventDefault();
    setFeedback('Treino registrado com sucesso!');
    setDescription('');
  };

  const handleReset = () => {
    setDate(initialDate);
    setDescription('');
    setFeedback('Registro de treinos');
  };

  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-orange-100 via-orange-50 to-white">

      <section className="mx-auto grid w-full max-w-6xl content-start gap-4 px-5 py-6 md:min-h-[100svh] md:grid-cols-2 md:items-start md:gap-6 md:px-8 md:py-8">
        <div>
          <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700">
            Treino do dia
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Bem vindo ao Treino do Dia
          </h1>
          <p className="mt-3 max-w-xl text-slate-600">
            Interface para registrar treinos rapidamente, acompanhar consistência e manter o foco no progresso.
          </p>

          <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
            <article className="rounded-xl border border-orange-200 bg-white p-3">
              <h2 className="text-sm font-semibold text-slate-900">Registro rápido</h2>
              <p className="mt-1 text-xs text-slate-600">Menos fricção para não perder o hábito diário.</p>
            </article>
            <article className="rounded-xl border border-orange-200 bg-white p-3">
              <h2 className="text-sm font-semibold text-slate-900">Foco no essencial</h2>
              <p className="mt-1 text-xs text-slate-600">Data + descrição para começar sem complexidade.</p>
            </article>
            <article className="rounded-xl border border-orange-200 bg-white p-3">
              <h2 className="text-sm font-semibold text-slate-900">Pronto para crescer</h2>
              <p className="mt-1 text-xs text-slate-600">Base perfeita para evoluir com histórico e métricas.</p>
            </article>
          </div>
        </div>

        <section className="min-w-0 rounded-2xl border border-orange-200 bg-white p-5 shadow-lg shadow-orange-100/70 sm:p-6">
          <p className="text-base font-semibold text-slate-700">{feedback}</p>

          <form onSubmit={handleSubmit} onReset={handleReset} className="mt-4 space-y-4">
            <div className="min-w-0 space-y-1">
              <label htmlFor="dataDoTreino" className="block text-sm font-semibold text-slate-700">
                Data do treino
              </label>
              <input
                id="dataDoTreino"
                name="dataDoTreino"
                type="date"
                required
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="block w-full min-w-0 max-w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-800 outline-none transition [font-size:16px] focus:border-orange-400 focus:ring-4 focus:ring-orange-100 md:text-sm md:[font-size:14px]"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="treinoDeHoje" className="block text-sm font-semibold text-slate-700">
                Descrição do treino
              </label>
              <textarea
                id="treinoDeHoje"
                name="treinoDeHoje"
                required
                placeholder="Como foi seu treino hoje?"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="min-h-24 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="reset"
                className="rounded-lg border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Limpar
              </button>
              <button
                type="submit"
                className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Enviar
              </button>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}

export function AdminPlansTable({ plansActiveOnly, plansData, onToggleActiveOnly, onPrev, onNext }) {
  return (
    <article className="rounded-2xl border border-orange-200 bg-white p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">Planos de treino</h2>
        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={plansActiveOnly}
            onChange={onToggleActiveOnly}
            className="h-4 w-4 rounded border-slate-300"
          />
          Somente ativos
        </label>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[460px] text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="pb-2">Plano</th>
              <th className="pb-2">Usuário</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Exercícios</th>
            </tr>
          </thead>
          <tbody>
            {plansData.items.length === 0 ? (
              <tr>
                <td className="py-3 text-slate-500" colSpan={4}>
                  Nenhum plano encontrado.
                </td>
              </tr>
            ) : (
              plansData.items.map((plan) => (
                <tr key={plan.id} className="border-t border-slate-100">
                  <td className="py-2 text-slate-900">{plan.title}</td>
                  <td className="py-2 text-slate-600">{plan.user?.email || '-'}</td>
                  <td className="py-2 text-slate-600">{plan.isActive ? 'Ativo' : 'Inativo'}</td>
                  <td className="py-2 text-slate-600">{plan.planExercises?.length || 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
        <span>
          Página {plansData.pagination.page} de {plansData.pagination.totalPages}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={plansData.pagination.page <= 1}
            onClick={onPrev}
            className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            type="button"
            disabled={plansData.pagination.page >= plansData.pagination.totalPages}
            onClick={onNext}
            className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      </div>
    </article>
  );
}

export function AdminUsersTable({ usersQuery, setUsersQuery, usersData, onSearch, onPrev, onNext, formatDate }) {
  return (
    <article className="rounded-2xl border border-orange-200 bg-white p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">Base de usuários</h2>
        <div className="flex items-center gap-2">
          <input
            value={usersQuery}
            onChange={(event) => setUsersQuery(event.target.value)}
            placeholder="Buscar por email"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
          />
          <button
            type="button"
            onClick={onSearch}
            className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Buscar
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="pb-2">Email</th>
              <th className="pb-2">Criado em</th>
            </tr>
          </thead>
          <tbody>
            {usersData.items.length === 0 ? (
              <tr>
                <td className="py-3 text-slate-500" colSpan={2}>
                  Nenhum usuário encontrado.
                </td>
              </tr>
            ) : (
              usersData.items.map((user) => (
                <tr key={user.id} className="border-t border-slate-100">
                  <td className="py-2 text-slate-900">{user.email}</td>
                  <td className="py-2 text-slate-600">{formatDate(user.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
        <span>
          Página {usersData.pagination.page} de {usersData.pagination.totalPages}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={usersData.pagination.page <= 1}
            onClick={onPrev}
            className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            type="button"
            disabled={usersData.pagination.page >= usersData.pagination.totalPages}
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

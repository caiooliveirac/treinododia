export function FloatingRegisterButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-5 right-5 z-20 rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-300/40 transition hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-200 md:bottom-8 md:right-8 dark:shadow-orange-900/40"
    >
      + Registrar treino
    </button>
  );
}

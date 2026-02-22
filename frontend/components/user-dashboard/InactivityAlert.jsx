'use client';

export function InactivityAlert({ lastWorkoutDate }) {
  if (!lastWorkoutDate) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
          👋 Você ainda não registrou nenhum treino. Comece agora!
        </p>
      </div>
    );
  }

  const now = new Date();
  const last = new Date(lastWorkoutDate);
  const diffMs = now.getTime() - last.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) return null;

  let message = '';
  let severity = 'info';

  if (diffDays <= 3) {
    message = `Faz ${diffDays} dias desde seu último treino. Bora voltar? 💪`;
    severity = 'info';
  } else if (diffDays <= 7) {
    message = `Já se passaram ${diffDays} dias sem treinar. Não perca o ritmo!`;
    severity = 'warning';
  } else {
    message = `Faz ${diffDays} dias que você não treina. Volte quando puder, cada treino conta! 🏋️`;
    severity = 'alert';
  }

  const styles = {
    info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    warning: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300',
    alert: 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-300',
  };

  return (
    <div className={`rounded-xl border p-4 ${styles[severity]}`}>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

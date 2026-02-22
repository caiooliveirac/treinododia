import './globals.css';

export const metadata = {
  title: 'Treino do Dia',
  description: 'Registro de treinos com visual moderno',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

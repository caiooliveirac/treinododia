import './globals.css';
import { DashboardNav } from '../components/shared/DashboardNav';

export const metadata = {
  title: 'Treino do Dia',
  description: 'Registro de treinos com visual moderno',
};

const DARK_MODE_SCRIPT = `
(function(){
  try {
    var s = localStorage.getItem('treinododia_dark_mode');
    if (s === 'true' || (s === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  } catch(e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: DARK_MODE_SCRIPT }} />
      </head>
      <body>
        <DashboardNav />
        {children}
      </body>
    </html>
  );
}

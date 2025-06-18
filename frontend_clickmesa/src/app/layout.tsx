import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] }); // Configuração

export const metadata = {
  title: 'Meu App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}> {/* Fonte aplicada */}
        {children}
      </body>
    </html>
  );
}
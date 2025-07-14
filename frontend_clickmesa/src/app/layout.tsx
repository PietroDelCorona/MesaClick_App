import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
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
        <Toaster
          position='top-center'
          reverseOrder={false}
          toastOptions={{
            style: {
              borderRadius: '8px',
              background: '#fff',
              color: '#333',
              minWidth: '400px',
            },
          }}
        />
      </body>
    </html>
  );
}
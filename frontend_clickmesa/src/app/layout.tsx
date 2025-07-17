import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

// Metadata padrão
export const metadata = {
  title: 'Meu App',
};

// Novo export para viewport (Next.js 13.2+)
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  // userScalable: false, // Opcional se quiser bloquear zoom
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster
          position='top-center'
          reverseOrder={false}
          toastOptions={{
            style: {
              borderRadius: '8px',
              background: 'hsl(var(--background))',
              color: 'hsl(var(--foreground))',
              minWidth: '400px',
            },
          }}
        />
      </body>
    </html>
  );
}
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/store/AppProvider';
import { SessionProvider } from 'next-auth/react';
import { Setting } from '@/definitions';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Inversiones Jeicar, C.A.',
  description:
    'Aplicación de inventario y facturación para negocios personales',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AppProvider userSettings={{} as Setting}>
          <main>{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}

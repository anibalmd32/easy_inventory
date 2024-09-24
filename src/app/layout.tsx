import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ViewTransitions } from 'next-view-transitions';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Inventario Fácil',
  description:
    'Aplicación de inventario y facturación para negocios personales',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="es">
        <body className={inter.className}>
          <main>{children}</main>
        </body>
      </html>
    </ViewTransitions>
  );
}

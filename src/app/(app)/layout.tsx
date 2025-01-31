'use client';
import { AppMenu } from '@/components/shared/AppMenu';
import { AppHeader } from '@/components/shared/AppHeader';
import { PageContainer } from '@/components/shared/PageContainer';
import { Toaster } from '@/components/ui/toaster';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { SessionProvider } from 'next-auth/react';
import { useDolarStore } from '@/store/dolarStore';
import { useEffect } from 'react';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { getDolarPrice } = useDolarStore();

  useEffect(() => {
    getDolarPrice();
  }, [getDolarPrice]);

  return (
    <SessionProvider>
      <main className="relative">
        <AppHeader appName="Inversiones Jeicar, C.A." appLogo="/logo.png" />
        <PageContainer>{children}</PageContainer>
        <AppMenu />
        <Toaster />
        <ProgressBar
          height="4px"
          color="#fff"
          options={{ showSpinner: false }}
          shallowRouting
        />
      </main>
    </SessionProvider>
  );
}

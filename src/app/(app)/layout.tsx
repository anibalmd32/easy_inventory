'use client';
import { AppMenu } from '@/components/shared/AppMenu';
import { AppHeader } from '@/components/shared/AppHeader';
import { PageContainer } from '@/components/shared/PageContainer';
import { Toaster } from '@/components/ui/toaster';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { SessionProvider } from 'next-auth/react';
import { useSession } from 'next-auth/react';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

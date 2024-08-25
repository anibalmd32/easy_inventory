"use client";
import { AppMenu } from '@/components/shared/AppMenu';
import { AppHeader } from '@/components/shared/AppHeader';
import { AppBackground } from '@/components/shared/AppBackground'
import { PageContainer } from '@/components/shared/PageContainer'

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	return (
		<main className='relative'>
			<AppHeader appName="Easy Inventory" appLogo="/billing.svg" />
			<PageContainer>{ children }</PageContainer>
			<AppMenu />
			<AppBackground />
		</main>
	)
}

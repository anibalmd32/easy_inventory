import { AppMenu } from '@/components/shared/AppMenu';
import { AppHeader } from '@/components/shared/AppHeader';

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	return (
		<main className='w-full text-slate-300 bg-gray-700 h-screen'>
			<AppHeader appName="Next.js + Tailwind CSS" appLogo="/next-logo.png" />
			<div className='w-full md:container px-2 py-16'>
				{children}
			</div>
			<AppMenu />
		</main>
	)
}

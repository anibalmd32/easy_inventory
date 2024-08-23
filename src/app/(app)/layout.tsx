import { AppMenu } from '@/components/shared/AppMenu';
import { AppHeader } from '@/components/shared/AppHeader';

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	return (
		<div className="relative">
			<AppHeader appName="Next.js + Tailwind CSS" appLogo="/logo.png" />
			
			{children}

			<AppMenu />
		</div>
	)
}

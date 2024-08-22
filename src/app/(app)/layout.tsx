import { AppMenu } from '@/components/shared/AppMenu';

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	return (
		<div className="relative">
			<h1>Home layot</h1>
			{children}

			<AppMenu />
		</div>
	)
}

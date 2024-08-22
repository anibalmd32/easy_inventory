import Menu from "@/components/shared/AppMenu/AppMenu";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	return (
		<div className="relative">
			<h1>Home layot</h1>
			{children}

			<Menu />
		</div>
	)
}

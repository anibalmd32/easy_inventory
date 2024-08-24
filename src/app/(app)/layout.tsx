"use client";
import { AppMenu } from '@/components/shared/AppMenu';
import { AppHeader } from '@/components/shared/AppHeader';
import { cn } from "@/lib/utils";
import DotPattern from "@/components/magicui/dot-pattern";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	return (
		<main>
			<AppHeader appName="Easy Inventory" appLogo="/billing.svg" />
			<div className='w-full mt-[56px] pt-8 md:pt-10 text-slate-300 bg-gray-700 min-h-screen h-full overflow-auto'>
				<div className='w-full md:container px-2'>
					{children}
				</div>
				<AppMenu />

			</div>
			<DotPattern
				className={cn(
				"[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
				)}
			/>
		</main>
	)
}

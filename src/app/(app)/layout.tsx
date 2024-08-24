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
		<main className='w-full text-slate-300 bg-gray-700 min-h-screen h-full'>
			<AppHeader appName="Next.js + Tailwind CSS" appLogo="/next-logo.png" />
			<div className='w-full md:container px-2 py-16'>
				{children}
			</div>
			<AppMenu />
			<DotPattern
				className={cn(
				"[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
				)}
			/>
		</main>
	)
}

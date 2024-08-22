'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const NavLink = ({ href, children }: {
	href: string;
	children: React.ReactNode;
}) => {
	const pathname = usePathname();
	const isActiveLink = (href: string) => pathname === href;

	return (
		<Link
			href={href}
			className={isActiveLink(href)
				? 'bg-gray-100/20 block p-2 md:rounded-md'
				: 'block p-2'}
		>
			{children}
		</Link>
	);
}

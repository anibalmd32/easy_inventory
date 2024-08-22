'use client'

import Link from 'next/link';
import { useRouter } from 'next/router';

export const NavLink = ({ href, children }: {
	href: string;

	children: React.ReactNode;
}) => {
	const router = useRouter();

	return (
		<Link href={href} className={router.pathname === href ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}>
		{children}
		</Link>
	)
}

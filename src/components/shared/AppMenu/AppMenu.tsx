'use client'

import { usePathname } from 'next/navigation';
import { Home, Sheet, CircleDollarSign, Settings } from 'lucide-react';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Menu() {
	const pathname = usePathname();
	const isActiveLink = (href: string) => pathname === href;

	return (
		<div className="w-full h-32 md:w-fit text-gray-300 flex justify-center mx-auto">
			<ul className="bg-gray-900 border md:rounded-lg w-full md:w-fit border-gray-700 flex gap-10 justify-around text-xl md:p-2 fixed bottom-0 md:bottom-10 m-auto">
				<li>
					<TooltipProvider>
						<Tooltip >
							<TooltipTrigger asChild>
								<Link
									href={'/'}
									className={isActiveLink('/')
										? 'bg-gray-100/20 block p-2 md:rounded-md'
										: 'block p-2'}
									>
									<Home className={`w-6 h-6 hover:scale-150 transition-transform duration-300`}/>
								</Link>
							</TooltipTrigger>
							<TooltipContent>
								<p>Inicio</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</li>
				<li>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href={'/inventory'}
									className={isActiveLink('/inventory')
										? 'bg-gray-100/20 block p-2 md:rounded-md'
										: 'block p-2'}
								>
								<Sheet className={`w-6 h-6 hover:scale-150 transition-transform duration-300`}/>
							</Link>
							</TooltipTrigger>
							<TooltipContent>
								<p>Inventario</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</li>
				<li>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href={'/invoices'}
									className={isActiveLink('/invoices')
										? 'bg-gray-100/20 block p-2 md:rounded-md'
										: 'block p-2'}
									>
								<CircleDollarSign className={`w-6 h-6 hover:scale-150 transition-transform duration-300`}/>
							</Link>
							</TooltipTrigger>
							<TooltipContent>
								<p>Facturas</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</li>
				<li>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href={'/settings'}
									className={isActiveLink('/settings')
										? 'bg-gray-100/20 block p-2 md:rounded-md'
										: 'block p-2'}
								>
									<Settings className={`w-6 h-6 hover:scale-150 transition-transform duration-300 `}/>
								</Link>
							</TooltipTrigger>
							<TooltipContent>
								<p>Configuraciones</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</li>
			</ul>
		</div>
	);
}

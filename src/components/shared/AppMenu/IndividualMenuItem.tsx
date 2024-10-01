'use client';

import { MenuItem } from './menu.data';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function IndividualMenuItem({ href, name, icon: Icon }: MenuItem) {
  const pathname = usePathname();
  const isActiveLink = (href: string) => pathname === href;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={
              isActiveLink(href)
                ? 'bg-gray-100/20 block p-2 md:rounded-md'
                : 'block p-2'
            }
          >
            <Icon className="w-6 h-6 hover:scale-150 transition-transform duration-300" />
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>{name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

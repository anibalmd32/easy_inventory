'use client'

import { MenuItem } from "./menu.data";
import { NavLink } from "../NavLink/NavLink";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function IndividualMenuItem({ href, name, icon: Icon }: MenuItem) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<NavLink href={href}>
						<Icon className={`w-6 h-6 hover:scale-150 transition-transform duration-300`} />
					</NavLink>
				</TooltipTrigger>
				<TooltipContent>
					<p>{name}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

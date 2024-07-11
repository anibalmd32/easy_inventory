import { component$, useStylesScoped$ } from "@builder.io/qwik";
import menuStyles from './menu.css?inline'
import type { IconType } from "~/definitions";
import { Button } from "../button/Button";

export interface MenuItems {
	label: string;
	Icon: IconType;
	url?: string;
}

export interface MenuProps {
	title: string;
	items: MenuItems[]
}

export const Menu = component$<MenuProps>(({
	title,
	items,
}) => {
	useStylesScoped$(menuStyles)

	return (
		<div class='menu'>
			<Button type="button" size="md" variant="outline">
				{title}
			</Button>
			
			<ul class='options'>
				{items.length > 0 && items.map(i => {
					return (
						<li key={i.label} class='item'>
							<span>
								<i.Icon />
							</span>
							<span>
								{i.label}
							</span>
						</li>
					)
				})}
			</ul>
		</div>
	)
})

import {
	$,
	component$, 
	type Signal,
	useSignal,
	useStylesScoped$
} from "@builder.io/qwik";
import {
	HiHomeSolid,
	HiTableCellsSolid,
	HiCurrencyDollarOutline,
	HiCog6ToothSolid
} from '@qwikest/icons/heroicons'
import { NavLink } from "../NavLink/NavLink";
import menuStyles from './menu.css?inline'

export const Menu = component$(() => {
	const isHoveringHome = useSignal(false);
	const isHoveringInventory = useSignal(false);
	const isHoveringInvoices = useSignal(false);
	const isHoveringSettings = useSignal(false);

	const createHoverHandler = (hoverSignal: Signal<boolean>) => $(() => hoverSignal.value = !hoverSignal.value);

	useStylesScoped$(menuStyles)

	return (
		<div class='menu'>			
			<ul class='options'>
				<li
					class='item'
					onMouseEnter$={createHoverHandler(isHoveringHome)}
					onMouseLeave$={createHoverHandler(isHoveringHome)}
				>
					<NavLink href="/" activeClass="active">
						<span>
							<HiHomeSolid />
						</span>
						<span class={`tooltip ${isHoveringHome.value && 'is-hovergin'}`}>
							Inicio
						</span>
					</NavLink>
				</li>
				<li
					class='item'
					onMouseEnter$={createHoverHandler(isHoveringInventory)}
					onMouseLeave$={createHoverHandler(isHoveringInventory)}
				>
					<NavLink href="/inventory" activeClass="active">
						<span>
							<HiTableCellsSolid />
						</span>
						<span class={`tooltip ${isHoveringInventory.value && 'is-hovergin'}`}>
							Inventario
						</span>
					</NavLink>
				</li>
				<li
					class='item'
					onMouseEnter$={createHoverHandler(isHoveringInvoices)}
					onMouseLeave$={createHoverHandler(isHoveringInvoices)}
				>
					<NavLink href="/invoices" activeClass="active">
						<span>
							<HiCurrencyDollarOutline />
						</span>
						<span class={`tooltip ${isHoveringInvoices.value && 'is-hovergin'}`}>
							Facturas
						</span>
					</NavLink>
				</li>
				<li
					class='item'
					onMouseEnter$={createHoverHandler(isHoveringSettings)}
					onMouseLeave$={createHoverHandler(isHoveringSettings)}
				>
					<NavLink href="/settings" activeClass="active">
						<span>
							<HiCog6ToothSolid />
						</span>
						<span class={`tooltip ${isHoveringSettings.value && 'is-hovergin'}`}>
							Configuracion
						</span>
					</NavLink>
				</li>
			</ul>
		</div>
	)
})

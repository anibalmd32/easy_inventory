/** IMPORTS */
import { component$, type QRL, Slot, useStylesScoped$ } from "@builder.io/qwik";
import { Button } from "../button/Button";
import { HiXMarkOutline } from '@qwikest/icons/heroicons'
import drawerStyles from './drawer.css?inline'

/** INTERFACES */
export interface DrawerProps {
	title: string;
	open: boolean;
	direction: 'right' | 'left'
	toggle: QRL<() => void>;
	description?: string;
}

/** COMPONENT */
/**
 * @component
 * @description - A panel that slides in from the edge of the screen.
 * 
 * @param {string} title
 * @param {boolean} open
 * @param {'right' | 'left'} direction
 * @param {QRL<() => void>} toggle
 * @param {string} [description]
 * 
 * @example
 * <Drawer
 * 	title='My Drawer'
 * 	description='Drawer for some action'
 * 	direction: 'right'
 * 	open: {false}
 * 	toggle: $(() => console.log('Toggle'))
 * >
 * 	...some nested component
 * </Drawer>
 */
export const Drawer = component$<DrawerProps>(({
	direction,
	open,
	title,
	toggle,
	description
}) => {

	useStylesScoped$(drawerStyles)
	return (
		<div
			class={`drawer-container dark ${open && 'open'}`}
			onClick$={toggle}
		>
			<div class={`drawer ${direction}`}>
				<div title="close" role="button" class='drawer-close-btn'>
					<HiXMarkOutline />
				</div>
				<div class='drawer-header'>
					<h2>{title}</h2>
					{description && <p>{description}</p>}
				</div>

				<div class='drawer-body'>
					<Slot />
				</div>

				<div class={`drawer-footer ${direction}`}>
					<Button
						size="md"
						type="button"
						variant="outline"
						onClick={toggle}
					>
						Cancel
					</Button>
					<Button
						size="md"
						type="button"
						variant="solid"
					>
						Confirm
					</Button>
				</div>
			</div>
		</div>
	)
})

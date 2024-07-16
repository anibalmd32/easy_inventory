/**
 * ===================
 * | IMPORTS         |
 * ===================
 */
import { component$, useStylesScoped$, type QRL } from '@builder.io/qwik'
import dialogStyles from './dialog.css?inline'
// import { Button } from '../button/Button'

/**
 * ===================
 * | INTERFACE       |
 * ===================
 */
export interface DialogProps {
	title: string;
	onConfirm: QRL<() => void>
	show: boolean;
	toggle: QRL<() => void>
	description?: string;
}

/**
 * ===================
 * | COMPONENT       |
 * ===================
 */
/**
 * @component
 * @description - A modal window that appears on top of the main content.
 */
export const Dialog = component$<DialogProps>(({
	onConfirm,
	show,
	title,
	toggle,
	description
}) => {

	useStylesScoped$(dialogStyles)
	return (
		<div class={`dialog-container ${show ? 'show' : 'hiden'}`}>
			<dialog class='dialog'>
				<h2>{title}</h2>
				<p>{description}</p>

				{/* <div class='dialog-btns'>
					<Button
						size='sm'
						type='button'
						variant='outline'
						onClick={toggle}
					>
						Cancel
					</Button>
					<Button
						size='sm'
						type='button'
						variant='solid'
						onClick={onConfirm}
					>
						Confirm
					</Button>
				</div> */}
			</dialog>
		</div>
	)
})

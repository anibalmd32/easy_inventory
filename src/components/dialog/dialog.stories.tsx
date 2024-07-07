import type { Meta, StoryObj } from 'storybook-framework-qwik'
import { Dialog, type DialogProps } from './Dialog'
import { $ } from '@builder.io/qwik'

const meta: Meta<DialogProps> = {
	component: Dialog
}

type Story = StoryObj<DialogProps>

export default meta

export const Base: Story = {
	args: {
		description: 'Este recurso sera eliminado permanantemente. Desea continuar?',
		onConfirm: $(() => {
			console.log('Accion confirmada')
		}),
		show: true,
		title: 'Eliminar recurso',
		toggle: $(() => {
			
		})
	},
	render: ((props) => <Dialog {...props} />)
}

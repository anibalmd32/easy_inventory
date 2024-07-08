import type { Meta, StoryObj } from 'storybook-framework-qwik'
import { Drawer, type DrawerProps } from './Drawer'
import { $ } from '@builder.io/qwik'

const meta: Meta<DrawerProps> = {
	component: Drawer
}

type Story = StoryObj<DrawerProps>

export default meta

export const Base: Story = {
	args: {
		title: 'My Drawer',
		description: 'Drawer for some action',
		direction: 'right',
		open: false,
		toggle: $(() => {
			console.log('Toggle')
		})
	},
	render: (props) => <Drawer {...props} />
}

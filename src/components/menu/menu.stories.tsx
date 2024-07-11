import type { Meta, StoryObj } from "storybook-framework-qwik";
import { Menu, type MenuProps } from "./Menu";
import { HiUserCircleSolid, HiBanknotesSolid, HiCog6ToothSolid } from '@qwikest/icons/heroicons'
import { $ } from "@builder.io/qwik";

const meta: Meta<MenuProps> = {
	component: Menu
}

type Story = StoryObj<MenuProps>

export default meta

export const Base: Story = {
	args: {
		title: 'Option\'s menu',
		items: [
			{
				Icon: $(HiUserCircleSolid),
				label: 'Profile'
			},
			{
				Icon: $(HiBanknotesSolid),
				label: 'Billing'
			},
			{
				Icon: $(HiCog6ToothSolid),
				label: 'Settings'
			}
		]
	},
	render: (props) => <Menu {...props} />
}

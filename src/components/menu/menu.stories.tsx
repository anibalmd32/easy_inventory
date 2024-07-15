import type { Meta, StoryObj } from "storybook-framework-qwik";
import { Menu } from "./Menu";

const meta: Meta = {
	component: Menu
}

type Story = StoryObj

export default meta

export const Base: Story = {
	render: () => <Menu />
}

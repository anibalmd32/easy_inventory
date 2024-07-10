import type { Meta, StoryObj } from "storybook-framework-qwik";
import { InputText, type InputTextProps } from "./InputText";
import type { FormController } from "~/definitions";
import { $ } from "@builder.io/qwik";

interface FormValueMock {
	name: string;
	email: string;
	active: boolean;
}

const controlMock: FormController<FormValueMock> = {
	name: 'name',
	error: 'username already exists',
	value: 'bluecode',
	onChange: $((value) => {
		console.log(value)
	})
}

const meta: Meta<InputTextProps<FormValueMock>> = {
	component: InputText
}

type Story = StoryObj<InputTextProps<FormValueMock>>

export default meta

export const Base: Story = {
	args: {
		label: 'Username',
		name: 'name',
		placeholder: 'Your name here',
		control: controlMock
	},
	render: (props) => <InputText {...props} />
}

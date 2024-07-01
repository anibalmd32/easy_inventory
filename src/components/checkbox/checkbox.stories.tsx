import type { StoryObj, Meta } from "storybook-framework-qwik";
import { Checkbox, type CheckboxProps } from "./Checkbox";

const meta: Meta<CheckboxProps> = {
    component: Checkbox
}

type Story = StoryObj<CheckboxProps>

export default meta;

/**
 * CHECKBOX STORIES
 */
export const BaseCheckbox: Story = {
    args: {
        label: 'Activar',
        name: 'active',
        value: false,
    },
    render: (props) => (
        <Checkbox {...props} />
    )
}

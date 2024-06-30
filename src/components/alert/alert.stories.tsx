import type { StoryObj, Meta } from "storybook-framework-qwik";
import { Alert, type AlertProps } from "./Alert";
import { HiBellAlertOutline } from '@qwikest/icons/heroicons'
import { $ } from "@builder.io/qwik";


const meta: Meta<AlertProps> = {
    component: Alert
}

type Story = StoryObj<AlertProps>

export default meta;

/**
 * ALERT STORIES
 */

export const Base: Story = {
    args: {
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur auctor cursus risus, ac facilisis odio ultricies a. Ut quis lacus facilisis, vehicula ipsum vitae, porta enim. Maecenas a scelerisque nulla.',
        Icon: $(HiBellAlertOutline),
        title: 'Alerta'
    },
    render: (props) => <Alert {...props} />
}

import type { StoryObj, Meta } from "storybook-framework-qwik";
import { Combobox, type ComboboxProps } from "./Combobox";
import { $ } from "@builder.io/qwik";

const meta: Meta<ComboboxProps> = {
    component: Combobox
}

type Story = StoryObj<ComboboxProps>

export default meta;

export const Base: Story = {
    args: {
        label: 'Usuarios',
        placeholder: 'Seleccione a un usuario',
        options: [
            {
                name: 'anibal',
                value: 1
            },
            {
                name: 'ezequiel',
                value: 2
            },
            {
                name: 'carolina',
                value: 3
            },
            {
                name: 'animal',
                value: 4
            }
        ],
        selectHandler: $((opt) => {
            console.log('Ha selecionado a:', opt)
        })
    },
    render: (props) => <Combobox {...props} />
}

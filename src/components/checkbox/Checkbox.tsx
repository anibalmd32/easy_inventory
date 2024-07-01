/**
 * ===================
 * | IMPORTS         |
 * ===================
 */
import { type QRL, component$, useStylesScoped$, $ } from "@builder.io/qwik";
import checkboxStyles from './checkbox.css?inline'

/**
 * ===================
 * | INTERFACE       |
 * ===================
 */
export interface CheckboxProps {
    label: string;
    value: boolean;
    name: string;
    onChange: QRL<(value: boolean) => void>
}

/**
 * ===================
 * | COMPONENT       |
 * ===================
 */
/**
 * @component
 * 
 * @description A control element that allow for multiple selections within a set
 * 
 * @param {string} label - Input label
 * @param {boolean} value - Value for check state
 * @param {string} name - Name for control
 * @param {QRL<(value: boolean) => void>} onChange - Function to execute when the input change
 * 
 * @example
 * <Checkbox
 *  lable='activate'
 *  value={false}
 *  name="isActive"
 *  onChange={$((value) => isActive.value = value)}
 * />
 */
export const Checkbox = component$<CheckboxProps>(({ label, onChange, value, name }) => {
    useStylesScoped$(checkboxStyles)

    const changeHandler = $((e: Event, t: HTMLInputElement) => {
        onChange(t.checked)
    })

    return (
        <label for="checkbox" class='checkbox'>
            <input
                class='checkbox-input'
                type="checkbox"
                name={name}
                checked={value}
                id="checkbox"
                onChange$={changeHandler}
            />

            <span class='checkbox-label'>
                {label}
            </span>
        </label>
    )
})

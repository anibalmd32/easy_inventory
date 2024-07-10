/* eslint-disable qwik/valid-lexical-scope */
import { component$, useStylesScoped$ } from "@builder.io/qwik";
import inputTextStyles from './inputText.css?inline'
import type { FormController } from "~/definitions";

export interface InputTextProps<T> {
	label: string;
	name: keyof T;
	placeholder: string;
	control: FormController<T>
}

export const InputText = component$<InputTextProps<any>>(({
	label,
	name,
	placeholder,
	control
}) => {

	useStylesScoped$(inputTextStyles)

	return (
		<label for={String(name)} class='input-text'>
			<span class='label'>{label}</span>
			<input
				class='input'
				type="text"
				id={String(name)}
				placeholder={placeholder}
				value={String(control.name) === name ? control.value : null}
				onChange$={() => {
					if (String(control.name) === name) {
						control.onChange(control.value)
					}
				}}
			/>

			{control.error ? (
				<span class='error'>{control.error}</span>
			) : null}
		</label>
	)
})

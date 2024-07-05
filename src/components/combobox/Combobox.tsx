/**
 * ===================
 * | IMPORTS         |
 * ===================
 */
import {
    $,
    component$,
    useStylesScoped$,
    useSignal,
    useStore,
    useTask$,
    type QRL,
} from "@builder.io/qwik";
import { HiChevronDoubleDownSolid, HiChevronDoubleUpSolid } from '@qwikest/icons/heroicons'
import comboboxStyles from './combobox.css?inline'

/**
 * ===================
 * | INTERFACE       |
 * ===================
 */
export interface ComboboxOptions {
    name: string;
    value: string | number;
}

export interface ComboboxProps {
    label: string;
    placeholder: string;
    options: ComboboxOptions[];
    selectHandler: QRL<(optionSelectd: ComboboxOptions) => void>;
}

interface OptionsStore {
    options: ComboboxOptions[];
    searchOption: QRL<(this: OptionsStore, searchname: string) => void>
}

/**
 * ===================
 * | COMPONENT       |
 * ===================
 */
/**
 * @component
 * @description - A single input field that combinate
 */
export const Combobox = component$<ComboboxProps>(({
    label,
    placeholder,
    options,
    selectHandler
}) => {
    const displayOtions = useSignal(false)
    const inputValue = useSignal('')

    const optionsStore = useStore<OptionsStore>({
        options: options,
        searchOption: $(function(this, searchname) {
            if (searchname) {
                const foundOption = options.filter(opt => opt.name.toLowerCase().includes(searchname.toLowerCase()))
                this.options = foundOption
            } else {
                this.options = options
            }
        })
    })

    const showOptions = $(() => {
        displayOtions.value = !displayOtions.value
    })

    useTask$(({track}) => {
        track(() => inputValue.value)

        if (inputValue.value) {
            optionsStore.searchOption(inputValue.value)
            displayOtions.value = true
            
            const selectedOption = options.find(opt => opt.name === inputValue.value)
    
            if (selectedOption) {
                selectHandler(selectedOption)
            }
        } else {
            optionsStore.options = options
        }
    })

    useStylesScoped$(comboboxStyles)

    return (
        <div class='combobox'>
            <label 
                for="combobox-input"
                class='label'
            >
                <div class='label-text'>
                    <span>{label}</span>
                </div>
                <div class='input'>
                    <input
                        autoComplete={'off'}
                        bind:value={inputValue}
                        type="text"
                        id="combobox-input"
                        placeholder={placeholder}
                        class='label-input'
                        onFocus$={showOptions}
                    />
                    {displayOtions.value
                        ? <HiChevronDoubleUpSolid class='label-icon' />
                        : <HiChevronDoubleDownSolid class='label-icon' />
                    }
                </div>
            </label>

            <div class={`
                options
                ${
                    displayOtions.value && optionsStore.options.length !== 0
                    ? 'display'
                    : 'hide'
                }`
            }>
                {optionsStore.options.length !== 0 && optionsStore.options.map(opt => (
                    <option
                        class='option-item'
                        key={opt.value}
                        value={opt.value}
                        onClick$={$(() => {
                            inputValue.value = opt.name
                            showOptions()
                        })}
                    >
                        {opt.name}
                    </option>
                ))}
            </div>
        </div>
    )
})

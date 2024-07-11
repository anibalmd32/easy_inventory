/**
 * ===================
 * | IMPORTS         |
 * ===================
 */
import { component$, useStylesScoped$, Slot, type QRL } from "@builder.io/qwik";
import buttonStyles from './button.css?inline'
import type { IconType, ComponentSize, ComponentVariant, ButtonType } from "~/definitions";

/**
 * ===================
 * | INTERFACE       |
 * ===================
 */
export interface ButtonProps {
  variant: ComponentVariant;
  size: ComponentSize;
  type: ButtonType;
  onClick?: QRL<() => void>
  Icon?: IconType;
}

/**
 * ===================
 * | COMPONENT       |
 * ===================
 */
/**
 * @component
 * @description - An interactive element used to trigger actions
 * 
 * @param {ComponentVariant} variant - Style variant: 'solid' | 'subtle' | 'outline'
 * @param {ComponentSize} size - Size of element: 'sm' | 'md' | 'lg'
 * @param {ButtonType} type - Type of button: 'button' | 'submit' | 'reset'
 * @param {QRL<() => void>} [onClick] - Optional function to execute when the onClick event occurrs
 * @param {IconType} [Icon] - Optional icon to describe the button purpose
 * 
 * @example
 * <Button
 *  variant='solid'
 *  size='md'
 *  type='button'
 *  onClick={$(() => console.log('The button has been clicked'))}
 *  Icon={HiArrowRightSolid}
 * >
 *  Action
 * </Button>
 */

export const Button = component$<ButtonProps>(({
  size,
  type,
  variant,
  Icon,
  onClick
}) => {

  useStylesScoped$(buttonStyles)
  
  return (
    <button
      class={`button ${variant} ${size}`}
      type={type}
      onClick$={onClick}
    >
      <div class="button-text">
        <Slot />
      </div>

      {Icon && (
        <div class="button-icon">
          <Icon />
        </div>
      )}
    </button>
  );
});

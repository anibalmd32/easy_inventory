import { component$, useStylesScoped$, Slot, type QRL } from "@builder.io/qwik";
import buttonStyles from './button.css?inline'
import type { IconType, ComponentSize, ComponentVariant, ButtonType } from "~/definitions";

export interface ButtonProps {
  variant: ComponentVariant;
  size: ComponentSize;
  type: ButtonType;
  onClick?: QRL<() => void>
  Icon?: IconType;
}
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

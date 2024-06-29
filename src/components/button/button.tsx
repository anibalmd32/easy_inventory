import { component$, useStylesScoped$, Slot } from "@builder.io/qwik";
import buttonStyles from './button.css?inline'
import type { IconType, ComponentSize, ComponentVariant, ButtonType } from "~/definitions";

export interface ButtonProps {
  variant: ComponentVariant;
  size: ComponentSize;
  type: ButtonType;
  Icon?: IconType;
}
export const Button = component$<ButtonProps>(({
  size,
  type,
  variant,
  Icon
}) => {

  useStylesScoped$(buttonStyles)
  
  return (
    <button class={`button ${variant} ${size}`} type={type}>
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

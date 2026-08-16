import { useStore } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import { useFieldContext } from "../hooks/form-context";

interface TextInputProps {
  label: string;
  placeholder?: string;
  type?: "text" | "password" | "email" | "number";
  autoComplete?: string;
  inputMode?: "text" | "email" | "numeric";
  autoCapitalize?: "none" | "sentences" | "words";
  /** Solo para `type="number"`. */
  min?: number;
  max?: number;
}

export const TextInput = ({
  label,
  placeholder = "",
  type = "text",
  autoComplete = "off",
  inputMode,
  autoCapitalize,
  min,
  max,
}: TextInputProps) => {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (state) => state.meta.errors);
  const { t } = useTranslation("validations");

  return (
    <fieldset className="fieldset w-full">
      <legend className="fieldset-legend">{label}</legend>
      <input
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        className={
          field.state.meta.isValid ? "input w-full" : "input input-error w-full"
        }
        inputMode={inputMode}
        max={max}
        min={min}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        value={field.state.value}
      />
      {!field.state.meta.isValid &&
        errors.map((error, idx) => (
          <em className="text-error" key={idx} role="alert">
            {t(error?.message)}
          </em>
        ))}
    </fieldset>
  );
};

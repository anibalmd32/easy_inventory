import { useStore } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import { useFieldContext } from "../hooks/form-context";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
}

export const SelectInput = ({
  label,
  options,
  placeholder = "",
  disabled = false,
}: SelectInputProps) => {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (state) => state.meta.errors);
  const { t } = useTranslation("validations");

  return (
    <fieldset className="fieldset w-full">
      <legend className="fieldset-legend">{label}</legend>
      <select
        className={
          field.state.meta.isValid
            ? "select w-full"
            : "select select-error w-full"
        }
        disabled={disabled}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        value={field.state.value}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {!field.state.meta.isValid &&
        errors.map((error, idx) => (
          <em className="text-error" key={idx} role="alert">
            {t(error?.message)}
          </em>
        ))}
    </fieldset>
  );
};

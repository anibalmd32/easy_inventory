import { useStore } from "@tanstack/react-form";
import { useFieldContext } from "../hooks/form-context";

interface TextInputProps {
  label: string;
  placeholder?: string;
  type?: "text" | "password" | "email";
}

export const TextInput = ({
  label,
  placeholder = "",
  type = "text",
}: TextInputProps) => {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <fieldset className="fieldset w-full">
      <legend className="fieldset-legend">{label}</legend>
      <input
        className={field.state.meta.isValid ? "input" : "input input-error"}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        value={field.state.value}
      />
      {!field.state.meta.isValid &&
        errors.map((error, idx) => (
          <em className="text-error" key={idx} role="alert">
            {error?.message}
          </em>
        ))}
    </fieldset>
  );
};

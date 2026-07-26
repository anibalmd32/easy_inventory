import { useFieldContext } from "../hooks/form-context";

interface CheckboxInputProps {
  label: string;
  hint?: string;
}

export const CheckboxInput = ({ label, hint }: CheckboxInputProps) => {
  const field = useFieldContext<boolean>();

  return (
    <label className="label w-full cursor-pointer justify-start gap-3 py-3">
      <input
        checked={field.state.value}
        className="checkbox checkbox-primary"
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.checked)}
        type="checkbox"
      />
      <span className="flex flex-col items-start">
        <span className="label-text">{label}</span>
        {hint ? <span className="text-xs opacity-60">{hint}</span> : null}
      </span>
    </label>
  );
};

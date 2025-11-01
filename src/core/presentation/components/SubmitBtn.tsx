import { useFormContext } from "../hooks/form-context";

export const SubmitBtn = ({ label }: { label: string }) => {
  const form = useFormContext();
  return (
    <form.Subscribe
      selector={(state) => [
        state.canSubmit,
        state.isSubmitting,
      ]}
    >
      {([canSubmit, isSubmitting]) => (
        <button
          className="btn btn-primary w-full mt-4"
          disabled={!canSubmit || isSubmitting}
          type="submit"
        >
          {label}
        </button>
      )}
    </form.Subscribe>
  );
};

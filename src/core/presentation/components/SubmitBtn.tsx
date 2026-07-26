import { useFormContext } from "../hooks/form-context";

interface SubmitBtnProps {
  label: string;
  /**
   * Estado de carga externo (por ejemplo el de una mutación) para los casos
   * en que el envío no se resuelve dentro del propio `onSubmit`.
   */
  isLoading?: boolean;
}

export const SubmitBtn = ({ label, isLoading = false }: SubmitBtnProps) => {
  const form = useFormContext();

  return (
    <form.Subscribe
      selector={(state) => [
        state.canSubmit,
        state.isSubmitting,
      ]}
    >
      {([canSubmit, isSubmitting]) => {
        const busy = isSubmitting || isLoading;

        return (
          <button
            className="btn btn-primary btn-block mt-2"
            disabled={!canSubmit || busy}
            type="submit"
          >
            {busy ? <span className="loading loading-spinner" /> : null}
            {label}
          </button>
        );
      }}
    </form.Subscribe>
  );
};

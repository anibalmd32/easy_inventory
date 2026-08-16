import { useTranslation } from "react-i18next";
import { MdWarningAmber } from "react-icons/md";
import { FormAlert } from "./FormAlert";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  errorMessage?: string | null;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Confirmación para acciones que destruyen algo. */
export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel,
  errorMessage,
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const { t } = useTranslation();

  if (!open) {
    return null;
  }

  return (
    <dialog className="modal modal-open modal-bottom sm:modal-middle">
      <div className="modal-box">
        <div className="flex items-start gap-3">
          <MdWarningAmber className="mt-1 shrink-0 text-warning" size={24} />
          <div className="min-w-0">
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="mt-1 text-sm opacity-70">{description}</p>
          </div>
        </div>

        {errorMessage ? (
          <div className="mt-4">
            <FormAlert message={errorMessage} />
          </div>
        ) : null}

        <div className="modal-action flex-col gap-2 sm:flex-row">
          <button
            className="btn btn-error btn-block sm:btn-auto"
            disabled={isPending}
            onClick={onConfirm}
            type="button"
          >
            {isPending ? <span className="loading loading-spinner" /> : null}
            {confirmLabel}
          </button>
          <button
            className="btn btn-ghost btn-block sm:btn-auto"
            disabled={isPending}
            onClick={onCancel}
            type="button"
          >
            {t("buttons.cancel.label")}
          </button>
        </div>
      </div>
    </dialog>
  );
};

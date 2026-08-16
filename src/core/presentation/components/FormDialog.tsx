import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { MdClose } from "react-icons/md";

interface FormDialogProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Envoltorio de los formularios que se abren sobre la pantalla.
 *
 * En móvil sube desde abajo (`modal-bottom`), que es donde llega el pulgar; a
 * partir de `sm` se centra. El formulario que va dentro es el que cierra el
 * diálogo cuando termina.
 */
export const FormDialog = ({
  open,
  title,
  description,
  onClose,
  children,
}: FormDialogProps) => {
  const { t } = useTranslation();

  if (!open) {
    return null;
  }

  return (
    <dialog className="modal modal-open modal-bottom sm:modal-middle">
      <div className="modal-box">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-lg font-bold">{title}</h3>
            {description ? (
              <p className="mt-1 text-sm opacity-70">{description}</p>
            ) : null}
          </div>
          <button
            aria-label={t("buttons.close.label")}
            className="btn btn-ghost btn-circle btn-sm shrink-0"
            onClick={onClose}
            type="button"
          >
            <MdClose size={18} />
          </button>
        </div>

        {children}
      </div>

      {/* Cerrar tocando fuera. El <form method="dialog"> es el patrón de
          daisyUI, pero aquí el estado lo lleva React. */}
      <button
        aria-label={t("buttons.close.label")}
        className="modal-backdrop"
        onClick={onClose}
        type="button"
      />
    </dialog>
  );
};

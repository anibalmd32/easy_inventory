import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdFingerprint } from "react-icons/md";
import { useBiometricAvailability } from "../hooks/useBiometricAvailability";
import { useBiometricEnrollment } from "../hooks/useBiometricEnrollment";
import { useUserStore } from "../stores/useUserStore";
import { FormAlert } from "./FormAlert";

/**
 * Ofrece activar el desbloqueo biométrico la primera vez que el usuario entra,
 * sea cual sea su rol.
 *
 * Se muestra una sola vez por usuario: tanto aceptar como rechazar dejan
 * sellada la columna `biometric_prompted_at`. A partir de ahí la opción vive
 * en el perfil.
 */
export const BiometricEnrollmentPrompt = () => {
  const { t } = useTranslation();
  const { isAvailable } = useBiometricAvailability();
  const { toggle, dismiss, isBusy } = useBiometricEnrollment();
  const userData = useUserStore((state) => state.userData);
  const [failed, setFailed] = useState(false);

  const shouldAsk =
    isAvailable && userData !== null && !userData.settings.biometric_prompted;

  if (!shouldAsk) {
    return null;
  }

  const handleEnable = async () => {
    const result = await toggle.mutateAsync(true);

    // Si canceló, el diálogo sigue abierto sin regañarle: puede reintentar o
    // elegir "Ahora no".
    setFailed(!result.ok && !result.cancelledByUser);
  };

  return (
    <dialog className="modal modal-open modal-bottom sm:modal-middle">
      <div className="modal-box">
        <div className="flex flex-col items-center gap-3 text-center">
          <MdFingerprint className="text-primary" size={48} />
          <h3 className="text-lg font-bold">{t("biometric.enrollTitle")}</h3>
          <p className="text-sm opacity-70">{t("biometric.enrollBody")}</p>
        </div>

        {failed ? (
          <div className="mt-4">
            <FormAlert message={t("errors.auth.biometric_failed")} />
          </div>
        ) : null}

        <div className="modal-action flex-col gap-2 sm:flex-row">
          <button
            className="btn btn-primary btn-block sm:btn-auto"
            disabled={isBusy}
            onClick={handleEnable}
            type="button"
          >
            {toggle.isPending ? (
              <span className="loading loading-spinner" />
            ) : null}
            {t("biometric.enableAction")}
          </button>
          <button
            className="btn btn-ghost btn-block sm:btn-auto"
            disabled={isBusy}
            onClick={() => dismiss.mutate()}
            type="button"
          >
            {t("biometric.notNowAction")}
          </button>
        </div>
      </div>
    </dialog>
  );
};

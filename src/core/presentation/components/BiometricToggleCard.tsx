import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdFingerprint } from "react-icons/md";
import { useBiometricAvailability } from "../hooks/useBiometricAvailability";
import { useBiometricEnrollment } from "../hooks/useBiometricEnrollment";
import { useUserStore } from "../stores/useUserStore";
import { FormAlert } from "./FormAlert";

/** Activar o desactivar el desbloqueo biométrico desde el perfil. */
export const BiometricToggleCard = () => {
  const { t } = useTranslation();
  const { isAvailable } = useBiometricAvailability();
  const { toggle, isBusy } = useBiometricEnrollment();
  const userData = useUserStore((state) => state.userData);
  const [failed, setFailed] = useState(false);

  // En escritorio no hay plugin, así que la tarjeta ni aparece.
  if (!isAvailable || !userData) {
    return null;
  }

  const isEnabled = userData.settings.biometric_enabled;

  const handleChange = async (enabled: boolean) => {
    const result = await toggle.mutateAsync(enabled);

    setFailed(!result.ok && !result.cancelledByUser);
  };

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body gap-3 p-4 sm:p-6">
        <label className="flex cursor-pointer items-center gap-3">
          <MdFingerprint className="shrink-0" size={28} />
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">
              {t("biometric.settingTitle")}
            </span>
            <span className="block text-xs opacity-60">
              {t("biometric.settingHint")}
            </span>
          </span>
          <input
            checked={isEnabled}
            className="toggle toggle-primary"
            disabled={isBusy}
            onChange={(event) => handleChange(event.target.checked)}
            type="checkbox"
          />
        </label>

        {failed ? (
          <FormAlert message={t("errors.auth.biometric_failed")} />
        ) : null}
      </div>
    </div>
  );
};

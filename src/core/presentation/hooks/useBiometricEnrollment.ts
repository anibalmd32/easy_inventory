import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  biometricService,
  biometricSettingsService,
} from "../../infrastructure/container";
import { useUserStore } from "../stores/useUserStore";

export type BiometricToggleResult =
  | {
      ok: true;
      enabled: boolean;
    }
  | {
      ok: false;
      cancelledByUser: boolean;
    };

/**
 * Activa, desactiva o descarta el desbloqueo biométrico de la sesión actual.
 *
 * Para activarlo se exige superar antes la verificación del dispositivo: no
 * tiene sentido guardar una preferencia que luego el hardware no va a poder
 * cumplir. Para desactivarlo no se pide nada, porque quitarse una capa de
 * seguridad estando ya dentro de la sesión no necesita otra prueba.
 */
export const useBiometricEnrollment = () => {
  const { t } = useTranslation();
  const userData = useUserStore((state) => state.userData);
  const biometricEmail = useUserStore((state) => state.biometricEmail);
  const setBiometricPreference = useUserStore(
    (state) => state.setBiometricPreference,
  );
  const setBiometricEmail = useUserStore((state) => state.setBiometricEmail);

  const toggle = useMutation({
    mutationFn: async (enabled: boolean): Promise<BiometricToggleResult> => {
      if (!userData) {
        return {
          ok: false,
          cancelledByUser: false,
        };
      }

      if (enabled) {
        const result = await biometricService.authenticate(
          t("biometric.reasonEnable"),
          {
            title: t("biometric.promptTitle"),
            subtitle: t("biometric.reasonEnable"),
            cancelTitle: t("buttons.cancel.label"),
          },
        );

        if (!result.ok) {
          return {
            ok: false,
            cancelledByUser: result.cancelledByUser,
          };
        }
      }

      await biometricSettingsService.setEnabled(userData.id, enabled);
      setBiometricPreference(enabled);

      if (enabled) {
        setBiometricEmail(userData.email);
      } else if (biometricEmail === userData.email) {
        // Solo se limpia si el dueño del desbloqueo era esta misma cuenta.
        setBiometricEmail(null);
      }

      return {
        ok: true,
        enabled,
      };
    },
  });

  const dismiss = useMutation({
    mutationFn: async () => {
      if (!userData) {
        return;
      }

      await biometricSettingsService.dismissPrompt(userData.id);
      setBiometricPreference(false);
    },
  });

  return {
    toggle,
    dismiss,
    isBusy: toggle.isPending || dismiss.isPending,
  };
};

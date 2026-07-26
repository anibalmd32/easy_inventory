import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdFingerprint } from "react-icons/md";
import { biometricService, loginService } from "../../infrastructure/container";
import { useAuth } from "../hooks/useAuth";
import { useAuthErrorMessage } from "../hooks/useAuthErrorMessage";
import { useBiometricAvailability } from "../hooks/useBiometricAvailability";
import { useUserStore } from "../stores/useUserStore";
import { FormAlert } from "./FormAlert";

type BiometricLoginOutcome = "success" | "cancelled" | "failed";

/**
 * Entrada por huella en la pantalla de login.
 *
 * Solo aparece si el dispositivo puede y si alguna cuenta activó el
 * desbloqueo aquí. La verificación identifica al dueño del dispositivo; el
 * email guardado es lo que dice de qué cuenta se trata.
 */
export const BiometricLoginButton = () => {
  const { t } = useTranslation();
  const { isAvailable } = useBiometricAvailability();
  const { startSession } = useAuth();
  const resolveErrorMessage = useAuthErrorMessage();
  const biometricEmail = useUserStore((state) => state.biometricEmail);
  const rememberedEmail = useUserStore((state) => state.rememberedEmail);
  const setBiometricEmail = useUserStore((state) => state.setBiometricEmail);
  const [failed, setFailed] = useState(false);

  const login = useMutation({
    mutationFn: async (email: string): Promise<BiometricLoginOutcome> => {
      const result = await biometricService.authenticate(
        t("biometric.reasonLogin"),
        {
          title: t("biometric.promptTitle"),
          subtitle: t("biometric.reasonLogin"),
          cancelTitle: t("buttons.cancel.label"),
        },
      );

      if (!result.ok) {
        return result.cancelledByUser ? "cancelled" : "failed";
      }

      const user = await loginService.executeWithBiometrics(email);

      // Se conserva la preferencia de "recordar correo" tal cual estaba: la
      // huella no debería cambiar una casilla que el usuario eligió aparte.
      await startSession(user, rememberedEmail !== null);

      return "success";
    },
    // Cancelar no es un error: no se le dice nada y puede reintentar.
    onSuccess: (outcome) => setFailed(outcome === "failed"),
    onError: () => {
      // La cuenta desactivó la biometría por otra vía: se retira la oferta
      // para no dejar un botón que ya no lleva a ninguna parte.
      setBiometricEmail(null);
    },
  });

  if (!isAvailable || !biometricEmail) {
    return null;
  }

  const errorMessage = resolveErrorMessage(login.error);

  return (
    <div className="flex flex-col gap-2">
      <div className="divider my-1 text-xs opacity-60">
        {t("biometric.orDivider")}
      </div>

      {errorMessage ? <FormAlert message={errorMessage} /> : null}
      {failed && !errorMessage ? (
        <FormAlert message={t("errors.auth.biometric_failed")} />
      ) : null}

      <button
        className="btn btn-outline btn-block"
        disabled={login.isPending}
        onClick={() => {
          setFailed(false);
          login.mutate(biometricEmail);
        }}
        type="button"
      >
        {login.isPending ? (
          <span className="loading loading-spinner" />
        ) : (
          <MdFingerprint size={20} />
        )}
        {t("biometric.loginAction")}
      </button>
      <p className="text-center text-xs opacity-60">{biometricEmail}</p>
    </div>
  );
};

import { useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import type { AuthUserData } from "../../domain/data/AuthUserData";
import { useUserStore } from "../stores/useUserStore";

export const useAuth = () => {
  const router = useRouter();
  const { i18n } = useTranslation();
  const setSession = useUserStore((state) => state.setSession);
  const clearSession = useUserStore((state) => state.clearSession);
  const setRememberedEmail = useUserStore((state) => state.setRememberedEmail);

  /**
   * Deja la sesión lista y manda al usuario a la home de su rol.
   * `remember` solo guarda el email; la contraseña nunca se persiste.
   */
  const startSession = async (user: AuthUserData, remember: boolean) => {
    setSession(user);
    setRememberedEmail(remember ? user.email : null);
    await i18n.changeLanguage(user.settings.language);
    await router.navigate({
      to: "/$role",
      params: {
        role: user.role.name,
      },
    });
  };

  /** Cierra sesión conservando el email recordado. */
  const logout = async () => {
    clearSession();
    await router.navigate({
      to: "/auth",
    });
  };

  return {
    startSession,
    logout,
  };
};

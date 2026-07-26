import * as zustand from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AuthUserData } from "../../domain/data/AuthUserData";
import { DEFAULT_USER_SETTINGS } from "../../domain/enums/defaultValues";

interface UserState {
  userData: AuthUserData | null;
  isAuthenticated: boolean;
  /**
   * Idioma de la interfaz. Vive fuera de `userData` para que el selector de
   * idioma del login siga funcionando sin sesión iniciada.
   */
  language: string;
  /**
   * Email recordado del último inicio de sesión. Sobrevive al logout; la
   * contraseña nunca se guarda.
   */
  rememberedEmail: string | null;
  /**
   * Intentos de inicio de sesión fallidos consecutivos. Al llegar a
   * `FAILED_LOGINS_BEFORE_RECOVERY` el login ofrece recuperar la contraseña.
   * Se persiste para que el enlace no desaparezca al reiniciar la app.
   */
  failedLoginAttempts: number;
  setSession: (user: AuthUserData) => void;
  clearSession: () => void;
  setRememberedEmail: (email: string | null) => void;
  registerFailedLogin: () => void;
  resetFailedLogins: () => void;
  setUserLanguage: (language: string) => void;
  getUserLang: () => string;
  hasPermission: (permission: string) => boolean;
}

export const useUserStore = zustand.create<UserState>()(
  persist(
    (set, get) => ({
      userData: null,
      isAuthenticated: false,
      language: DEFAULT_USER_SETTINGS.LANGUAGE,
      rememberedEmail: null,
      failedLoginAttempts: 0,
      setSession: (user: AuthUserData) =>
        set({
          userData: user,
          isAuthenticated: true,
          language: user.settings.language,
          failedLoginAttempts: 0,
        }),
      clearSession: () =>
        set({
          userData: null,
          isAuthenticated: false,
        }),
      setRememberedEmail: (email: string | null) =>
        set({
          rememberedEmail: email,
        }),
      registerFailedLogin: () =>
        set((state) => ({
          failedLoginAttempts: state.failedLoginAttempts + 1,
        })),
      resetFailedLogins: () =>
        set({
          failedLoginAttempts: 0,
        }),
      setUserLanguage: (language: string) =>
        set((state) => ({
          language,
          userData: state.userData
            ? {
                ...state.userData,
                settings: {
                  ...state.userData.settings,
                  language,
                },
              }
            : null,
        })),
      getUserLang: () => get().language,
      hasPermission: (permission: string) =>
        get().userData?.role.permissions.includes(permission) ?? false,
    }),
    {
      // Clave nueva: el estado persistido con la forma anterior (`id`,
      // `userData` sin nulos) ya no es compatible y debe ignorarse.
      name: "easy-inventory-user",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

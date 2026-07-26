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
  /**
   * Cuenta que tiene el desbloqueo biométrico activo en ESTE dispositivo.
   *
   * La huella identifica al dueño del móvil, no a un usuario concreto de la
   * app, así que hace falta saber a quién corresponde. Se guarda aquí y no se
   * deduce de la base de datos porque es una decisión por dispositivo: la
   * última cuenta que lo activó es la que se ofrece en el login.
   */
  biometricEmail: string | null;
  setSession: (user: AuthUserData) => void;
  clearSession: () => void;
  setRememberedEmail: (email: string | null) => void;
  setBiometricEmail: (email: string | null) => void;
  /** Refleja en la sesión la preferencia ya guardada en la base de datos. */
  setBiometricPreference: (enabled: boolean) => void;
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
      biometricEmail: null,
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
      setBiometricEmail: (email: string | null) =>
        set({
          biometricEmail: email,
        }),
      setBiometricPreference: (enabled: boolean) =>
        set((state) => ({
          userData: state.userData
            ? {
                ...state.userData,
                settings: {
                  ...state.userData.settings,
                  biometric_enabled: enabled,
                  // Guardar la preferencia implica que ya se le preguntó, así
                  // que el aviso de bienvenida no vuelve a salir.
                  biometric_prompted: true,
                },
              }
            : null,
        })),
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

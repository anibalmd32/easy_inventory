import * as zustand from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { UserData } from "../../domain/data/UserData";
import { DEFAULT_USER_SETTINGS } from "../../domain/enums/defaultValues";

interface UserState {
  id: string;
  userData: UserData;
  isAuthenticated: boolean;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setUserData: (data: UserData) => void;
  setId: (id: string) => void;
  setUserLanguage: (language: string) => void;
  getUserLang: () => string;
}

export const useUserStore = zustand.create<UserState>()(
  persist(
    (set, get) => ({
      id: "",
      userData: {
        role: {
          name: "admin",
        },
        settings: {
          language: DEFAULT_USER_SETTINGS.LANGUAGE,
          theme: DEFAULT_USER_SETTINGS.THEME_VARIANT,
        },
      } as UserData,
      isAuthenticated: false,
      setAuthenticated: (isAuthenticated: boolean) =>
        set({
          isAuthenticated,
        }),
      setUserData: (data: UserData) =>
        set({
          userData: data,
        }),
      setId: (id: string) =>
        set({
          id,
        }),
      setUserLanguage: (language: string) =>
        set((state) => ({
          userData: {
            ...state.userData,
            settings: {
              ...state.userData.settings,
              language,
            },
          },
        })),
      getUserLang: () => {
        const state = get();
        return state.userData.settings.language;
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

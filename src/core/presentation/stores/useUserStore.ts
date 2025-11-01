import * as zustand from "zustand";
import type { UserData } from "../../domain/data/UserData";

interface UserState {
  id: string;
  userData: UserData;
  isAuthenticated: boolean;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setUserData: (data: UserData) => void;
  setId: (id: string) => void;
}

export const useUserStore = zustand.create<UserState>()((set) => ({
  id: "",
  userData: {
    role: {
      name: "admin",
    },
  } as UserData,
  isAuthenticated: true,
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
}));

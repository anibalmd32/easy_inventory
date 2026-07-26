import { create } from "zustand";

type BusinessSettings = {
  name: string;
  logoUrl: string;
};
type BusinessSettingsStore = {
  businessSettings: BusinessSettings;
  setBusinessSettings: (settings: BusinessSettings) => void;
  clearBusinessSettings: () => void;
};

export const useBusinessSettings = create<BusinessSettingsStore>((set) => ({
  businessSettings: {
    // Provisional hasta que el usuario configure su negocio: es su nombre
    // comercial el que debe salir aquí, no el de la app.
    name: "Inventario fácil",
    logoUrl: "/logo.png",
  },
  setBusinessSettings: (settings) =>
    set({
      businessSettings: settings,
    }),
  clearBusinessSettings: () =>
    set({
      businessSettings: {
        name: "",
        logoUrl: "",
      },
    }),
}));

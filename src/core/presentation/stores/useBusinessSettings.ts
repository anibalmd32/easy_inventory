import { create } from "zustand";

type BusinessSettings = {
  name: string;
  logoUrl: string;
};
type BusinessSettingsStore = {
  businessSettings: BusinessSettings;
  setBusinessSettings: (settings: BusinessSettings) => void;
  /**
   * Rellena el store con lo que hay en la base de datos. Si el negocio aún
   * no tiene nombre o logo, se mantienen los provisionales de la app.
   */
  hydrateBusinessSettings: (settings: {
    name: string;
    logoUrl: string | null;
  }) => void;
  clearBusinessSettings: () => void;
};

/** Valores provisionales que se muestran hasta que la BD diga otra cosa. */
const PROVISIONAL_SETTINGS: BusinessSettings = {
  // Provisional hasta que el usuario configure su negocio: es su nombre
  // comercial el que debe salir aquí, no el de la app.
  name: "Inventario fácil",
  logoUrl: "/logo.png",
};

export const useBusinessSettings = create<BusinessSettingsStore>((set) => ({
  businessSettings: PROVISIONAL_SETTINGS,
  setBusinessSettings: (settings) =>
    set({
      businessSettings: settings,
    }),
  hydrateBusinessSettings: ({ name, logoUrl }) =>
    set({
      businessSettings: {
        name: name.trim() !== "" ? name : PROVISIONAL_SETTINGS.name,
        logoUrl: logoUrl ?? PROVISIONAL_SETTINGS.logoUrl,
      },
    }),
  clearBusinessSettings: () =>
    set({
      businessSettings: {
        name: "",
        logoUrl: "",
      },
    }),
}));

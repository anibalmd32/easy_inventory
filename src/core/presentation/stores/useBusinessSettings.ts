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
    name: "Easy Inventory",
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

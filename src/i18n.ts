import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import { useUserStore } from "./core/presentation/stores/useUserStore";

const userLang = useUserStore.getState().getUserLang();

i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init({
  fallbackLng: "es",
  debug: true,
  lng: userLang,
});

export default i18n;

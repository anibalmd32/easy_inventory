import { useTranslation } from "react-i18next";
import { SiGoogletranslate } from "react-icons/si";
import { useDetailsDropdown } from "../hooks/useDetailsDropdown";
import { useUserStore } from "../stores/useUserStore";

const LANGUAGES = [
  {
    code: "es",
    label: "Español",
  },
  {
    code: "en",
    label: "English",
  },
];

export const LangSelect = () => {
  const { t, i18n } = useTranslation();
  const setUserLanguage = useUserStore((state) => state.setUserLanguage);
  const { isOpen, detailsRef, close, syncOpenState } = useDetailsDropdown();

  const changeLanguage = (lng: string) => {
    setUserLanguage(lng);
    i18n.changeLanguage(lng);
    close();
  };

  return (
    <details
      className="dropdown dropdown-end"
      onToggle={syncOpenState}
      open={isOpen}
      ref={detailsRef}
    >
      <summary
        aria-label={t("common.language")}
        className="btn btn-ghost btn-circle"
      >
        <SiGoogletranslate size={20} />
      </summary>
      <ul className="dropdown-content menu z-1 mt-1 w-40 rounded-box bg-base-100 p-2 shadow-sm">
        {LANGUAGES.map((lang) => (
          <li key={lang.code}>
            {/* Antes era un <li onClick>: no se podía activar con teclado. */}
            <button
              className={i18n.language === lang.code ? "menu-active" : ""}
              onClick={() => changeLanguage(lang.code)}
              type="button"
            >
              {lang.label}
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
};

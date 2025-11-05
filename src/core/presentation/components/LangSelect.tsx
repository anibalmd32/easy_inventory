import { useTranslation } from "react-i18next";
import { SiGoogletranslate } from "react-icons/si";
import { useUserStore } from "../stores/useUserStore";

export const LangSelect = () => {
  const { i18n } = useTranslation();
  const setUserLanguage = useUserStore((state) => state.setUserLanguage);

  const changeLanguage = (lng: string) => {
    setUserLanguage(lng);
    i18n.changeLanguage(lng);
  };

  const langList = [
    {
      code: "es",
      label: "Español",
    },
    {
      code: "en",
      label: "English",
    },
  ];

  return (
    <div className="dropdown dropdown-hover">
      <button className="btn m-1" tabIndex={0} type="button">
        <SiGoogletranslate size={20} />
      </button>
      <ul
        className="dropdown-content menu bg-base-100 rounded-box z-1 p-2 shadow-sm flex flex-col gap-2"
        tabIndex={-1}
      >
        {langList.map((lang) => (
          <li
            className={`hover:bg-primary cursor-pointer px-2 rounded-sm ${i18n.language === lang.code ? "bg-primary font-bold" : ""}`}
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            onKeyDown={() => {}}
          >
            {lang.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

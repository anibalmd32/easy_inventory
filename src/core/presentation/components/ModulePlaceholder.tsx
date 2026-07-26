import { useTranslation } from "react-i18next";
import { FiTool } from "react-icons/fi";

interface ModulePlaceholderProps {
  title: string;
}

/** Pantalla provisional de los módulos que todavía no están construidos. */
export const ModulePlaceholder = ({ title }: ModulePlaceholderProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex flex-col items-center gap-2 rounded-box border border-base-300 border-dashed p-8 text-center">
        <FiTool className="opacity-40" size={32} />
        <p className="text-sm opacity-70">{t("common.comingSoon")}</p>
      </div>
    </div>
  );
};

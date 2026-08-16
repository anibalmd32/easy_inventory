import type { TFunction } from "i18next";
import { FiSettings } from "react-icons/fi";
import type { NavItem } from "../../core/presentation/components/AsidePanel/AsidePanel";

/**
 * En el panel lateral la configuración es una sola entrada que lleva al hub.
 * Antes colgaba de ahí cada submódulo, pero repartir botones de configuración
 * hace fácil creer que estás ajustando un módulo cuando estás en otro.
 */
export const getSettingsNavItems = (t: TFunction, role: string): NavItem[] => {
  return [
    {
      label: t("common.settings"),
      href: `/${role}/settings`,
      Icon: FiSettings,
    },
  ];
};

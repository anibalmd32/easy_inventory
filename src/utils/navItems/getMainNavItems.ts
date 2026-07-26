import type { TFunction } from "i18next";
import { FiDollarSign, FiFileText, FiHome, FiPackage } from "react-icons/fi";
import type { NavItem } from "../../core/presentation/components/AsidePanel/AsidePanel";

/**
 * Módulos funcionales del MVP. Son los que aparecen en el dock de mobile:
 * lo que el usuario usa a diario, no la administración.
 */
export const getMainNavItems = (t: TFunction, role: string): NavItem[] => {
  return [
    {
      label: t("common.home"),
      href: `/${role}`,
      Icon: FiHome,
      // Sin esto la home quedaría activa en todas las rutas, porque `/$role`
      // es prefijo de todas las demás.
      exact: true,
    },
    {
      label: t("common.inventory"),
      href: `/${role}/inventory`,
      Icon: FiPackage,
    },
    {
      label: t("common.invoicing"),
      href: `/${role}/invoicing`,
      Icon: FiFileText,
    },
    {
      label: t("common.debts"),
      href: `/${role}/debts`,
      Icon: FiDollarSign,
    },
  ];
};

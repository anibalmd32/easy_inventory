import type { TFunction } from "i18next";
import { FiSettings, FiShield } from "react-icons/fi";
import type { NavItem } from "../../core/presentation/components/AsidePanel/AsidePanel";

export const getSettingsNavItems = (t: TFunction, role: string): NavItem[] => {
  return [
    {
      label: t("common.settings"),
      href: "",
      Icon: FiSettings,
      children: [
        {
          // El rol se interpola: antes estaba fijo en "/admin/...", así que
          // para cualquier otro rol el enlace rebotaba contra el guard de
          // `/$role` y la pantalla quedaba inalcanzable.
          label: t("common.roles"),
          href: `/${role}/settings/roles`,
          Icon: FiShield,
        },
      ],
    },
  ];
};

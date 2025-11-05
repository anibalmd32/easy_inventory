import type { TFunction } from "i18next";
import { FiSettings, FiShield } from "react-icons/fi";
import type { NavItem } from "../../core/presentation/components/AsidePanel/AsidePanel";

export const getSettingsNavItems = (t: TFunction): NavItem[] => {
  return [
    {
      label: t("common.settings"),
      href: "",
      Icon: FiSettings,
      children: [
        {
          label: t("common.roles"),
          href: "/admin/settings/roles",
          Icon: FiShield,
        },
      ],
    },
  ];
};

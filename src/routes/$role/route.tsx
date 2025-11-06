import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
  AsidePanel,
  type NavSection,
} from "../../core/presentation/components/AsidePanel/AsidePanel";
import { useUserStore } from "../../core/presentation/stores/useUserStore";
import { getSettingsNavItems } from "../../utils/navItems/getSettingsNavItems";

export const Route = createFileRoute("/$role")({
  beforeLoad: () => {
    const { isAuthenticated } = useUserStore.getState();

    if (!isAuthenticated) {
      throw redirect({
        to: "/auth",
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  const navigationSections: NavSection[] = [
    {
      section: t("common.administration"),
      items: getSettingsNavItems(t),
    },
  ];

  return (
    <div className="flex gap-4 h-screen">
      <AsidePanel sections={navigationSections} />
      <div className="flex-1 p-4 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

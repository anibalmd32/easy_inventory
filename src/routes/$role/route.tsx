import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { AppDock } from "../../core/presentation/components/AppDock";
import { AppTopBar } from "../../core/presentation/components/AppTopBar";
import {
  AsidePanel,
  type NavSection,
} from "../../core/presentation/components/AsidePanel/AsidePanel";
import { BiometricEnrollmentPrompt } from "../../core/presentation/components/BiometricEnrollmentPrompt";
import { useUserStore } from "../../core/presentation/stores/useUserStore";
import { getMainNavItems } from "../../utils/navItems/getMainNavItems";
import { getSettingsNavItems } from "../../utils/navItems/getSettingsNavItems";

export const Route = createFileRoute("/$role")({
  beforeLoad: ({ params }) => {
    const { isAuthenticated, userData } = useUserStore.getState();

    if (!isAuthenticated || !userData) {
      throw redirect({
        to: "/auth",
      });
    }

    // El segmento de la URL no es una credencial: si no coincide con el rol
    // real de la sesión se corrige, no se acepta.
    if (params.role !== userData.role.name) {
      throw redirect({
        to: "/$role",
        params: {
          role: userData.role.name,
        },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const { role } = Route.useParams();

  const mainNavItems = getMainNavItems(t, role);

  const navigationSections: NavSection[] = [
    {
      section: t("common.modules"),
      items: mainNavItems,
    },
    {
      section: t("common.administration"),
      items: getSettingsNavItems(t, role),
    },
  ];

  return (
    // `px-safe` cubre el apaisado: en un móvil con muesca, el recorte se come
    // un lateral de la pantalla.
    <div className="flex h-dvh px-safe">
      {/* Se oculta solo a sí mismo por debajo de `lg`. */}
      <AsidePanel sections={navigationSections} />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopBar />
        <main className="flex-1 overflow-y-auto px-4 pt-4 pb-dock lg:pb-4">
          <Outlet />
        </main>
      </div>

      <AppDock items={mainNavItems} />

      {/* Vive en el layout y no en la home para que el aviso salga sea cual
          sea la primera pantalla a la que llegue el usuario. */}
      <BiometricEnrollmentPrompt />
    </div>
  );
}

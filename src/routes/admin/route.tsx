import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import {
  AsidePanel,
  type NavSection,
} from "../../core/presentation/components/AsidePanel/AsidePanel";
import { useUserStore } from "../../core/presentation/stores/useUserStore";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    const { userData, isAuthenticated } = useUserStore.getState();

    if (!isAuthenticated) {
      throw redirect({
        to: "/auth",
      });
    } else {
      if (userData.role.name !== "admin") {
        throw redirect({
          to: "/guest",
        });
      }
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navigationSections: NavSection[] = [];

  return (
    <div className="flex gap-4 h-screen">
      <AsidePanel sections={navigationSections} />
      <Outlet />
    </div>
  );
}

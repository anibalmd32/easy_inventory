import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useUserStore } from "../../core/presentation/stores/useUserStore";

export const Route = createFileRoute("/auth")({
  beforeLoad: () => {
    const { userData, isAuthenticated } = useUserStore.getState();

    if (isAuthenticated) {
      if (userData.role.name === "admin") {
        throw redirect({
          to: "/admin",
        });
      }

      throw redirect({
        to: "/guest",
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

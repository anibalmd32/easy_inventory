import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { LangSelect } from "../../core/presentation/components/LangSelect";
import { useUserStore } from "../../core/presentation/stores/useUserStore";

export const Route = createFileRoute("/auth")({
  beforeLoad: () => {
    const { userData, isAuthenticated } = useUserStore.getState();
    const userRole = userData?.role.name;

    if (isAuthenticated) {
      if (userRole) {
        throw redirect({
          to: "/$role",
          params: {
            role: userRole,
          },
        });
      }
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <LangSelect />
      <Outlet />
    </div>
  );
}

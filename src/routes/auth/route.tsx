import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { LangSelect } from "../../core/presentation/components/LangSelect";
import { useBusinessSettings } from "../../core/presentation/stores/useBusinessSettings";
import { useUserStore } from "../../core/presentation/stores/useUserStore";

export const Route = createFileRoute("/auth")({
  beforeLoad: () => {
    const { userData, isAuthenticated } = useUserStore.getState();

    if (isAuthenticated && userData) {
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
  const businessSettings = useBusinessSettings(
    (state) => state.businessSettings,
  );

  return (
    <div className="flex min-h-dvh flex-col bg-base-200">
      <header className="flex items-center justify-between gap-2 px-4 pt-4">
        <div className="flex min-w-0 items-center gap-2">
          <img
            alt=""
            className="h-8 w-8 shrink-0 object-contain"
            src={businessSettings.logoUrl}
          />
          <span className="truncate font-semibold">
            {businessSettings.name}
          </span>
        </div>
        <LangSelect />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

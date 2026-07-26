import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Outlet,
  redirect,
} from "@tanstack/react-router";

export interface RouterContext {
  /** Permite que los `beforeLoad` consulten la BD sin refetchear de más. */
  queryClient: QueryClient;
}

const RootLayout = () => {
  return <Outlet />;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/") {
      throw redirect({
        to: "/auth",
      });
    }
  },
  component: RootLayout,
});

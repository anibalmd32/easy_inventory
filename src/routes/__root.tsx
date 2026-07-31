import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { superAdminExistsQueryOptions } from "../core/presentation/queries/authQueries";

export interface RouterContext {
  /** Permite que los `beforeLoad` consulten la BD sin refetchear de más. */
  queryClient: QueryClient;
}

const RootLayout = () => {
  return <Outlet />;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ location, context }) => {
    if (location.pathname !== "/") {
      return;
    }

    // A dónde entra la app se decide aquí y no en `/auth`.
    //
    // Antes el guard vivía en la pantalla de login: si no había superadmin,
    // rebotaba al setup. Eso hacía imposible ofrecer un "ya tengo cuenta"
    // desde el setup, porque el login lo devolvía en bucle. Poniendo la
    // decisión en el arranque, el primer uso sigue llevando al setup pero
    // ambas pantallas quedan alcanzables entre sí.
    const hasSuperAdmin = await context.queryClient.ensureQueryData(
      superAdminExistsQueryOptions,
    );

    throw redirect({
      to: hasSuperAdmin ? "/auth" : "/auth/setup",
    });
  },
  component: RootLayout,
});

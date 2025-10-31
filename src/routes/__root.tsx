import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";

const RootLayout = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export const Route = createRootRoute({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/") {
      throw redirect({
        to: "/auth",
      });
    }
  },
  component: RootLayout,
});

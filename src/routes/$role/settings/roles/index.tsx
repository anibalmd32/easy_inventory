import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$role/settings/roles/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/$role/settings/roles/"!</div>;
}

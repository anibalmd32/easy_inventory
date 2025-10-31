import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/guest/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/guest/"!</div>;
}

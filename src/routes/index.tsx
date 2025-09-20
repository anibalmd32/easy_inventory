import { createFileRoute } from "@tanstack/react-router";
import HomePage from "../core/presentation/pages/Home";

export const Route = createFileRoute("/")({
  component: HomePage,
});

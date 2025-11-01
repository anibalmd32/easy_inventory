import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "../../core/presentation/forms/LoginForm/LoginForm";

export const Route = createFileRoute("/auth/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex justify-center items-center flex-col h-screen gap-4">
      <h1 className="text-2xl font-bold">Welcome Back</h1>
      <LoginForm />
    </div>
  );
}

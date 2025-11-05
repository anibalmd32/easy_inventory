import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { LoginForm } from "../../core/presentation/forms/LoginForm/LoginForm";

export const Route = createFileRoute("/auth/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  return (
    <div className="flex justify-center items-center flex-col h-screen gap-4">
      <h1 className="text-2xl font-bold">{t("pages.auth.login.title")}</h1>
      <LoginForm />
    </div>
  );
}

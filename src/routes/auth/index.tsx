import { createFileRoute, redirect } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { BiometricLoginButton } from "../../core/presentation/components/BiometricLoginButton";
import { LoginForm } from "../../core/presentation/forms/LoginForm/LoginForm";
import { superAdminExistsQueryOptions } from "../../core/presentation/queries/authQueries";

export const Route = createFileRoute("/auth/")({
  beforeLoad: async ({ context }) => {
    const hasSuperAdmin = await context.queryClient.ensureQueryData(
      superAdminExistsQueryOptions,
    );

    // Primer arranque de la app: todavía no hay a quién autenticar.
    if (!hasSuperAdmin) {
      throw redirect({
        to: "/auth/setup",
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <div className="card w-full max-w-sm bg-base-100 shadow-sm">
      <div className="card-body gap-1 p-6">
        <h1 className="text-2xl font-bold">{t("pages.auth.login.title")}</h1>
        <p className="mb-2 text-sm opacity-70">
          {t("pages.auth.login.subtitle")}
        </p>
        <LoginForm />
        <BiometricLoginButton />
      </div>
    </div>
  );
}

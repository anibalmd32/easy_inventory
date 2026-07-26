import { createFileRoute, redirect } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PasswordRecoveryForm } from "../../core/presentation/forms/PasswordRecoveryForm/PasswordRecoveryForm";
import { superAdminExistsQueryOptions } from "../../core/presentation/queries/authQueries";

export const Route = createFileRoute("/auth/recover")({
  beforeLoad: async ({ context }) => {
    const hasSuperAdmin = await context.queryClient.ensureQueryData(
      superAdminExistsQueryOptions,
    );

    // Sin cuentas creadas no hay nada que recuperar.
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
        <h1 className="text-2xl font-bold">{t("pages.auth.recover.title")}</h1>
        <p className="mb-2 text-sm opacity-70">
          {t("pages.auth.recover.subtitle")}
        </p>
        <PasswordRecoveryForm />
      </div>
    </div>
  );
}

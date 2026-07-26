import { createFileRoute, redirect } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { SetupSuperAdminForm } from "../../../core/presentation/forms/SetupSuperAdminForm/SetupSuperAdminForm";
import {
  securityQuestionsQueryOptions,
  superAdminExistsQueryOptions,
} from "../../../core/presentation/queries/authQueries";

export const Route = createFileRoute("/auth/setup/")({
  beforeLoad: async ({ context }) => {
    const hasSuperAdmin = await context.queryClient.ensureQueryData(
      superAdminExistsQueryOptions,
    );

    // Solo puede existir un superadmin: si ya está creado, esta pantalla
    // deja de ser alcanzable para siempre.
    if (hasSuperAdmin) {
      throw redirect({
        to: "/auth",
      });
    }
  },
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(securityQuestionsQueryOptions),
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <div className="card w-full max-w-md bg-base-100 shadow-sm">
      <div className="card-body gap-1 p-6">
        <h1 className="text-2xl font-bold">{t("pages.auth.setup.title")}</h1>
        <p className="mb-2 text-sm opacity-70">
          {t("pages.auth.setup.subtitle")}
        </p>
        <SetupSuperAdminForm />
      </div>
    </div>
  );
}

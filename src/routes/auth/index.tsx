import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { BiometricLoginButton } from "../../core/presentation/components/BiometricLoginButton";
import { LoginForm } from "../../core/presentation/forms/LoginForm/LoginForm";
import { superAdminExistsQueryOptions } from "../../core/presentation/queries/authQueries";

// Sin guard a propósito: esta pantalla debe poder abrirse aunque el
// dispositivo todavía no tenga ninguna cuenta, para quien ya la tiene creada
// en otro sitio. Quién entra primero al setup lo decide la ruta raíz.
export const Route = createFileRoute("/auth/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const { data: hasSuperAdmin } = useQuery(superAdminExistsQueryOptions);

  return (
    <div className="card w-full max-w-sm bg-base-100 shadow-sm">
      <div className="card-body gap-1 p-6">
        <h1 className="text-2xl font-bold">{t("pages.auth.login.title")}</h1>
        <p className="mb-2 text-sm opacity-70">
          {t("pages.auth.login.subtitle")}
        </p>
        <LoginForm />
        <BiometricLoginButton />

        {/* Solo mientras el dispositivo no tenga dueño: una vez creado, el
            superadmin es único y no hay nada que registrar desde aquí. */}
        {hasSuperAdmin === false ? (
          <p className="mt-3 text-center text-sm opacity-70">
            {t("pages.auth.login.noAccount")}{" "}
            <Link className="link link-primary" to="/auth/setup">
              {t("pages.auth.login.goToSetup")}
            </Link>
          </p>
        ) : null}
      </div>
    </div>
  );
}

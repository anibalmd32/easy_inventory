import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { MdArrowBack } from "react-icons/md";
// import { BusinessLogoCard } from "../../../../core/presentation/forms/BusinessSettings/BusinessLogoCard";
import { BusinessInfoCard } from "../../../../core/presentation/forms/BusinessSettings/BusinessInfoCard";
import { BusinessNameCard } from "../../../../core/presentation/forms/BusinessSettings/BusinessNameCard";
import { ThemePickerCard } from "../../../../core/presentation/forms/BusinessSettings/ThemePickerCard";

export const Route = createFileRoute("/$role/settings/business/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const { role } = Route.useParams();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <div>
        <Link
          className="mb-2 inline-flex items-center gap-1 text-sm opacity-70 hover:opacity-100"
          params={{
            role,
          }}
          to="/$role/settings"
        >
          <MdArrowBack size={16} />
          {t("pages.settings.title")}
        </Link>
        <h1 className="text-2xl font-bold">
          {t("pages.settings.groups.business.title")}
        </h1>
        <p className="text-sm opacity-70">
          {t("pages.settings.groups.business.description")}
        </p>
      </div>

      <BusinessNameCard />

      <BusinessInfoCard />

      {/*
        Subida del logo desactivada, no eliminada.
        Para reactivarla basta con descomentar el import de arriba y esta línea.

        Todo lo que necesita sigue en su sitio y compilando: el componente
        `BusinessLogoCard`, el `LogoSchema`, y los métodos `updateLogo` del
        servicio y del repositorio. La columna `logo` de `business_setting`
        tampoco se toca, así que un logo guardado antes no se pierde.

        Mientras esté desactivada, la app usa el logo provisional definido en
        `useBusinessSettings` (`/logo.png`).
      */}
      {/* <BusinessLogoCard /> */}

      <ThemePickerCard />
    </div>
  );
}

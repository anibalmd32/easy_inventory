import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { MdArrowBack } from "react-icons/md";
import { CreditToggleCard } from "../../../../core/presentation/forms/DebtSettings/CreditToggleCard";
import { DebtTermsCard } from "../../../../core/presentation/forms/DebtSettings/DebtTermsCard";

export const Route = createFileRoute("/$role/settings/debts/")({
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
          {t("pages.settings.groups.debts.title")}
        </h1>
        <p className="text-sm opacity-70">
          {t("pages.settings.groups.debts.description")}
        </p>
      </div>

      <CreditToggleCard />
      <DebtTermsCard />
    </div>
  );
}

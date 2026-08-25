import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { MdArrowBack } from "react-icons/md";
import type { PaymentMethodData } from "../../../../core/domain/data/PaymentMethodData";
import { posSettingsService } from "../../../../core/infrastructure/container";
import { CatalogSection } from "../../../../core/presentation/components/CatalogSection";
import { CurrencyCard } from "../../../../core/presentation/forms/PosSettings/CurrencyCard";
import { ExchangeRateCard } from "../../../../core/presentation/forms/PosSettings/ExchangeRateCard";
import { InvoiceCard } from "../../../../core/presentation/forms/PosSettings/InvoiceCard";
import { PaymentMethodForm } from "../../../../core/presentation/forms/PosSettings/PaymentMethodForm";
import {
  paymentMethodsQueryOptions,
  posSettingsKeys,
} from "../../../../core/presentation/queries/posSettingsQueries";

export const Route = createFileRoute("/$role/settings/pos/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const { role } = Route.useParams();
  const methods = useQuery(paymentMethodsQueryOptions);

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
          {t("pages.settings.groups.pos.title")}
        </h1>
        <p className="text-sm opacity-70">
          {t("pages.settings.groups.pos.description")}
        </p>
      </div>

      <ExchangeRateCard />

      <CurrencyCard />

      <InvoiceCard />

      <CatalogSection<PaymentMethodData>
        addLabel={t("pages.settings.pos.paymentMethods.add")}
        createTitle={t("pages.settings.pos.paymentMethods.createTitle")}
        deleteDescription={(name) =>
          t("pages.settings.pos.paymentMethods.deleteDescription", {
            name,
          })
        }
        deleteTitle={t("pages.settings.pos.paymentMethods.deleteTitle")}
        description={t("pages.settings.pos.paymentMethods.description")}
        editTitle={t("pages.settings.pos.paymentMethods.editTitle")}
        emptyBody={t("pages.settings.pos.paymentMethods.emptyBody")}
        emptyTitle={t("pages.settings.pos.paymentMethods.emptyTitle")}
        isLoading={methods.isPending}
        items={methods.data}
        listKey={posSettingsKeys.paymentMethods}
        onDelete={(id) => posSettingsService.deletePaymentMethod(id)}
        renderForm={({ item, onDone }) => (
          <PaymentMethodForm item={item} onDone={onDone} />
        )}
        title={t("pages.settings.pos.paymentMethods.title")}
      />
    </div>
  );
}

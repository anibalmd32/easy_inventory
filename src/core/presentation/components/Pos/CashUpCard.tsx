import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { MdPointOfSale } from "react-icons/md";
import { CURRENCY, CURRENCY_SYMBOL } from "../../../domain/enums/currencies";
import { cashUpQueryOptions } from "../../queries/salesQueries";
import { PriceDisplay } from "../PriceDisplay";

interface CashUpCardProps {
  day: string;
  /** `null` = todos los cajeros; un id = solo ese. */
  userId: number | null;
  onUserIdChange: (userId: number | null) => void;
  /** El cajero de la sesión, para poder ofrecer "solo lo mío". */
  currentUserId: number | null;
  /** Si esta persona puede ver lo que vendieron los demás. */
  canSeeEveryone: boolean;
}

const AMOUNT_FORMATTER = new Intl.NumberFormat("es-VE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * El cierre de caja del día: cuánto se vendió y cuánto debería haber en la
 * gaveta, desglosado por forma de pago.
 *
 * El desglose va en la moneda con la que cobraron —los bolívares en
 * bolívares— porque lo que hace el cajero al cerrar es contar billetes, no
 * convertir.
 */
export const CashUpCard = ({
  day,
  userId,
  onUserIdChange,
  currentUserId,
  canSeeEveryone,
}: CashUpCardProps) => {
  const { t } = useTranslation();
  const cashUp = useQuery(
    cashUpQueryOptions({
      day,
      userId,
    }),
  );

  const data = cashUp.data;

  return (
    <section className="card bg-base-100 shadow-sm">
      <div className="card-body gap-3 p-4">
        <header className="flex flex-wrap items-start justify-between gap-2">
          <h2 className="card-title flex items-center gap-2 text-base">
            <MdPointOfSale size={20} />
            {t("pages.invoicing.cashUp.title")}
          </h2>

          {canSeeEveryone && currentUserId !== null ? (
            <div className="join">
              <button
                className={
                  userId === null
                    ? "btn btn-xs join-item btn-active"
                    : "btn btn-xs join-item"
                }
                onClick={() => onUserIdChange(null)}
                type="button"
              >
                {t("pages.invoicing.cashUp.everyone")}
              </button>
              <button
                className={
                  userId !== null
                    ? "btn btn-xs join-item btn-active"
                    : "btn btn-xs join-item"
                }
                onClick={() => onUserIdChange(currentUserId)}
                type="button"
              >
                {t("pages.invoicing.cashUp.mine")}
              </button>
            </div>
          ) : null}
        </header>

        {cashUp.isPending ? <div className="skeleton h-24 w-full" /> : null}

        {data ? (
          <>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm opacity-70">
                {t("pages.invoicing.cashUp.sold", {
                  count: data.sales_count,
                })}
              </span>
              <PriceDisplay amountUsd={data.total_usd} size="lg" />
            </div>

            {data.methods.length > 0 ? (
              <dl className="flex flex-col gap-1 rounded-box bg-base-200 p-3 text-sm">
                {data.methods.map((method) => (
                  <div
                    className="flex justify-between gap-3"
                    key={`${method.payment_method_name}-${method.currency}`}
                  >
                    <dt className="truncate opacity-70">
                      {method.payment_method_name}
                    </dt>
                    <dd className="shrink-0 font-medium">
                      {CURRENCY_SYMBOL[method.currency]}
                      {method.currency === CURRENCY.VES ? " " : ""}
                      {AMOUNT_FORMATTER.format(method.amount)}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="rounded-box border border-base-300 border-dashed p-3 text-center text-sm opacity-70">
                {t("pages.invoicing.cashUp.nothing")}
              </p>
            )}

            <dl className="flex flex-col gap-1 text-sm">
              {data.change_usd > 0 ? (
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="opacity-70">
                    {t("pages.invoicing.cashUp.change")}
                  </dt>
                  <dd>
                    <PriceDisplay amountUsd={data.change_usd} size="sm" />
                  </dd>
                </div>
              ) : null}

              {data.credit_usd > 0 ? (
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-warning">
                    {t("pages.invoicing.cashUp.credit")}
                  </dt>
                  <dd>
                    <PriceDisplay amountUsd={data.credit_usd} size="sm" />
                  </dd>
                </div>
              ) : null}

              {data.voided_count > 0 ? (
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="opacity-70">
                    {t("pages.invoicing.cashUp.voided")}
                  </dt>
                  <dd>{data.voided_count}</dd>
                </div>
              ) : null}
            </dl>
          </>
        ) : null}
      </div>
    </section>
  );
};

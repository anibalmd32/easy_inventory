import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MdBlock,
  MdCheckCircle,
  MdSave,
  MdShare,
  MdShoppingCartCheckout,
} from "react-icons/md";
import { formatQuantity } from "../../../../utils/formatQuantity";
import { formatDateTime } from "../../../../utils/localDay";
import { CURRENCY, CURRENCY_SYMBOL } from "../../../domain/enums/currencies";
import { SALE_STATUS } from "../../../domain/enums/sales";
import { pointOfSaleService } from "../../../infrastructure/container";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import { useSaleReceipt } from "../../hooks/useSaleReceipt";
import { inventoryKeys } from "../../queries/inventoryQueries";
import { saleDetailQueryOptions, salesKeys } from "../../queries/salesQueries";
import { useUserStore } from "../../stores/useUserStore";
import { ConfirmDialog } from "../ConfirmDialog";
import { FormAlert } from "../FormAlert";
import { FormDialog } from "../FormDialog";
import { PriceDisplay } from "../PriceDisplay";

interface SaleDetailDialogProps {
  /** `null` cuando no hay ninguna venta abierta. */
  saleId: number | null;
  onClose: () => void;
  /** Acaba de emitirse: se enseña el aviso de listo y el botón de empezar otra. */
  justIssued?: boolean;
  canVoid: boolean;
}

const AMOUNT_FORMATTER = new Intl.NumberFormat("es-VE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * El detalle de una venta: qué se llevó, cuánto pagó y con qué.
 *
 * Es la misma pantalla nada más cobrar y al mirar una venta del historial,
 * porque lo que se quiere hacer con las dos es lo mismo: mandarle el recibo al
 * cliente o comprobar qué se cobró.
 */
export const SaleDetailDialog = ({
  saleId,
  onClose,
  justIssued = false,
  canVoid,
}: SaleDetailDialogProps) => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const resolveErrorMessage = useErrorMessage();
  const receipt = useSaleReceipt();
  const userId = useUserStore((state) => state.userData?.id ?? null);

  const [isVoiding, setIsVoiding] = useState(false);

  const sale = useQuery({
    ...saleDetailQueryOptions(saleId ?? 0),
    enabled: saleId !== null,
  });

  const voidSale = useMutation({
    mutationFn: () => {
      if (saleId === null || userId === null) {
        throw new Error("No hay venta que anular");
      }

      return pointOfSaleService.voidSale(saleId, userId, null);
    },
    onSuccess: async () => {
      setIsVoiding(false);
      await queryClient.invalidateQueries({
        queryKey: salesKeys.all,
      });
      // Anular devolvió la mercancía: el inventario cambió.
      await queryClient.invalidateQueries({
        queryKey: inventoryKeys.all,
      });
    },
  });

  if (saleId === null) {
    return null;
  }

  const data = sale.data;
  const isVoided = data?.status === SALE_STATUS.VOIDED;
  const errorMessage = resolveErrorMessage(receipt.share.error);

  const showPaid = (amount: number, currency: CURRENCY): string =>
    `${CURRENCY_SYMBOL[currency]}${
      currency === CURRENCY.VES ? " " : ""
    }${AMOUNT_FORMATTER.format(amount)}`;

  return (
    <>
      <FormDialog
        onClose={onClose}
        open
        title={
          justIssued
            ? t("pages.invoicing.receipt.doneTitle")
            : t("pages.invoicing.receipt.title")
        }
      >
        <div className="flex flex-col gap-3">
          {justIssued ? (
            <output className="alert alert-success alert-soft">
              <MdCheckCircle className="shrink-0" size={20} />
              <span className="text-sm">
                {t("pages.invoicing.receipt.doneBody")}
              </span>
            </output>
          ) : null}

          {errorMessage ? <FormAlert message={errorMessage} /> : null}

          {receipt.done ? (
            <output className="alert alert-success alert-soft">
              <span className="text-sm">
                {t("pages.invoicing.receipt.shared")}
              </span>
            </output>
          ) : null}

          {sale.isPending ? <div className="skeleton h-32 w-full" /> : null}

          {data ? (
            <>
              <header className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-mono font-semibold text-lg">
                  {data.invoice_number}
                </span>
                {isVoided ? (
                  <span className="badge badge-error badge-sm">
                    {t("pages.invoicing.list.voided")}
                  </span>
                ) : null}
              </header>

              <dl className="flex flex-col gap-1 text-sm opacity-70">
                <div className="flex justify-between gap-3">
                  <dt>{t("pages.invoicing.receipt.dateTime")}</dt>
                  <dd>{formatDateTime(data.created_at, i18n.language)}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>{t("pages.invoicing.receipt.soldBy")}</dt>
                  <dd className="truncate">{data.seller_name}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>{t("pages.invoicing.receipt.customer")}</dt>
                  <dd className="truncate">
                    {data.customer_name ??
                      t("pages.invoicing.customers.anonymous")}
                  </dd>
                </div>
              </dl>

              <ul className="list rounded-box bg-base-200">
                {data.items.map((item) => (
                  <li className="list-row items-center py-2" key={item.id}>
                    <div className="list-col-grow min-w-0">
                      <p className="truncate text-sm">{item.product_name}</p>
                      <p className="text-xs opacity-60">
                        {formatQuantity(item.quantity, i18n.language)}{" "}
                        {item.unit_abbreviation}
                      </p>
                    </div>
                    <PriceDisplay amountUsd={item.line_total_usd} size="sm" />
                  </li>
                ))}
              </ul>

              <div className="flex items-baseline justify-between gap-3 rounded-box bg-base-200 p-3">
                <span className="font-medium">
                  {t("pages.invoicing.receipt.total")}
                </span>
                <PriceDisplay amountUsd={data.total_usd} size="lg" />
              </div>

              {data.payments.length > 0 ? (
                <dl className="flex flex-col gap-1 text-sm">
                  <dt className="font-medium">
                    {t("pages.invoicing.receipt.paidWith")}
                  </dt>
                  {data.payments.map((payment) => (
                    <dd
                      className="flex justify-between gap-3 opacity-70"
                      key={payment.id}
                    >
                      <span className="truncate">
                        {payment.payment_method_name}
                        {payment.reference ? ` · ${payment.reference}` : ""}
                      </span>
                      <span>{showPaid(payment.amount, payment.currency)}</span>
                    </dd>
                  ))}
                  {data.change_usd > 0 ? (
                    <dd className="flex justify-between gap-3">
                      <span>{t("pages.invoicing.receipt.change")}</span>
                      <PriceDisplay amountUsd={data.change_usd} size="sm" />
                    </dd>
                  ) : null}
                </dl>
              ) : null}

              {data.debt_amount_usd !== null ? (
                <div className="alert alert-warning alert-soft flex-col items-start gap-1">
                  <span className="flex flex-wrap items-baseline gap-1 text-sm">
                    {t("pages.invoicing.receipt.owed")}
                    <PriceDisplay amountUsd={data.debt_amount_usd} size="sm" />
                  </span>
                  {data.debt_due_date ? (
                    <span className="text-xs opacity-70">
                      {t("pages.invoicing.receipt.dueDate")}:{" "}
                      {formatDateTime(data.debt_due_date, i18n.language)}
                    </span>
                  ) : null}
                </div>
              ) : null}

              {/* --- Entregar el recibo --- */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm opacity-70">
                    {t("pages.invoicing.receipt.paperWidth")}
                  </span>
                  <div className="join">
                    <button
                      className={
                        receipt.width === 58
                          ? "btn btn-xs join-item btn-active"
                          : "btn btn-xs join-item"
                      }
                      onClick={() => receipt.setWidth(58)}
                      type="button"
                    >
                      58 mm
                    </button>
                    <button
                      className={
                        receipt.width === 80
                          ? "btn btn-xs join-item btn-active"
                          : "btn btn-xs join-item"
                      }
                      onClick={() => receipt.setWidth(80)}
                      type="button"
                    >
                      80 mm
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    className="btn btn-primary btn-block sm:btn-auto sm:flex-1"
                    disabled={receipt.isBusy}
                    onClick={() => receipt.share.mutate(data)}
                    type="button"
                  >
                    {receipt.share.isPending ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      <MdShare size={18} />
                    )}
                    {t("pages.invoicing.receipt.share")}
                  </button>
                  <button
                    className="btn btn-block sm:btn-auto sm:flex-1"
                    disabled={receipt.isBusy}
                    onClick={() => receipt.saveAs.mutate(data)}
                    type="button"
                  >
                    {receipt.saveAs.isPending ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      <MdSave size={18} />
                    )}
                    {t("pages.invoicing.receipt.save")}
                  </button>
                </div>

                {justIssued ? (
                  <button
                    className="btn btn-block"
                    onClick={onClose}
                    type="button"
                  >
                    <MdShoppingCartCheckout size={18} />
                    {t("pages.invoicing.receipt.newSale")}
                  </button>
                ) : null}

                {canVoid && !isVoided ? (
                  <button
                    className="btn btn-ghost btn-block text-error"
                    onClick={() => setIsVoiding(true)}
                    type="button"
                  >
                    <MdBlock size={18} />
                    {t("pages.invoicing.void.action")}
                  </button>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      </FormDialog>

      <ConfirmDialog
        confirmLabel={t("pages.invoicing.void.confirm")}
        description={t("pages.invoicing.void.description", {
          number: data?.invoice_number ?? "",
        })}
        errorMessage={resolveErrorMessage(voidSale.error)}
        isPending={voidSale.isPending}
        onCancel={() => setIsVoiding(false)}
        onConfirm={() => voidSale.mutate()}
        open={isVoiding}
        title={t("pages.invoicing.void.title")}
      />
    </>
  );
};

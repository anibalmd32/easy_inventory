import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MdAdd,
  MdClose,
  MdPersonOutline,
  MdWarningAmber,
} from "react-icons/md";
import { roundMoney, toBolivares, toDollars } from "../../../../utils/money";
import type {
  CartLineData,
  CartTotalsData,
} from "../../../domain/data/CartData";
import type { CustomerData } from "../../../domain/data/CustomerData";
import { CURRENCY, CURRENCY_SYMBOL } from "../../../domain/enums/currencies";
import { SALE_TYPE } from "../../../domain/enums/sales";
import { pointOfSaleService } from "../../../infrastructure/container";
import type { IssueSaleInput } from "../../../infrastructure/dtos/SaleDtos";
import { toAmount } from "../../../infrastructure/schemas/toAmount";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import { usePriceFormatter } from "../../hooks/usePriceFormatter";
import { debtSettingQueryOptions } from "../../queries/debtSettingsQueries";
import { inventoryKeys } from "../../queries/inventoryQueries";
import {
  currentRateQueryOptions,
  paymentMethodsQueryOptions,
} from "../../queries/posSettingsQueries";
import { salesKeys } from "../../queries/salesQueries";
import { useUserStore } from "../../stores/useUserStore";
import { FormAlert } from "../FormAlert";
import { FormDialog } from "../FormDialog";
import { PriceDisplay } from "../PriceDisplay";
import { CustomerPickerDialog } from "./CustomerPickerDialog";

interface CheckoutDialogProps {
  open: boolean;
  onClose: () => void;
  lines: CartLineData[];
  totals: CartTotalsData;
  canCreateCustomer: boolean;
  /** Se llama con el id de la venta recién emitida. */
  onIssued: (saleId: number) => void;
}

/** Una forma de pago mientras se está cobrando. El importe es texto: se escribe. */
type PaymentDraft = {
  key: string;
  methodId: number | null;
  methodName: string;
  currency: CURRENCY;
  amount: string;
  reference: string;
};

let draftCounter = 0;

const newDraftKey = () => {
  draftCounter += 1;

  return `payment-${draftCounter}`;
};

/**
 * El cobro: con qué paga, cuánto entrega, cuánto se le devuelve y si se lo
 * lleva fiado.
 *
 * Arranca con una sola forma de pago y el importe exacto ya escrito, que es la
 * venta de mostrador normal. Añadir una segunda forma (parte efectivo, parte
 * pago móvil) es un toque más, porque en Venezuela pasa a diario.
 */
export const CheckoutDialog = ({
  open,
  onClose,
  lines,
  totals,
  canCreateCustomer,
  onIssued,
}: CheckoutDialogProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const resolveErrorMessage = useErrorMessage();
  const { format, primaryCurrency, hasRate } = usePriceFormatter();
  const userId = useUserStore((state) => state.userData?.id ?? null);

  const { data: methods } = useQuery(paymentMethodsQueryOptions);
  const { data: rate } = useQuery(currentRateQueryOptions);
  const { data: debtSettings } = useQuery(debtSettingQueryOptions);

  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [isPickingCustomer, setIsPickingCustomer] = useState(false);
  const [isCredit, setIsCredit] = useState(false);
  const [changeCurrency, setChangeCurrency] = useState<CURRENCY>(CURRENCY.USD);
  const [payments, setPayments] = useState<PaymentDraft[]>([]);
  const [hasTouchedPayments, setHasTouchedPayments] = useState(false);

  // Sin tasa no se puede convertir nada, así que solo se puede cobrar en
  // dólares. Es mejor eso que inventarse unos bolívares.
  const chargeCurrency = hasRate ? primaryCurrency : CURRENCY.USD;

  const amountIn = (currency: CURRENCY, amountUsd: number): number =>
    currency === CURRENCY.USD || !rate
      ? amountUsd
      : toBolivares(amountUsd, rate.rate);

  const toUsd = (currency: CURRENCY, amount: number): number =>
    currency === CURRENCY.USD || !rate ? amount : toDollars(amount, rate.rate);

  /**
   * Un importe tal como se escribe en Venezuela: coma decimal y punto de
   * miles. Es lo que va dentro del campo, y `toAmount` sabe leerlo de vuelta.
   */
  const typedAmount = (amount: number): string =>
    amount.toLocaleString("es-VE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const showAmount = (currency: CURRENCY, amount: number): string =>
    `${CURRENCY_SYMBOL[currency]}${
      currency === CURRENCY.VES ? " " : ""
    }${typedAmount(amount)}`;

  // El cobro se monta al abrir, con el importe exacto ya escrito: en el
  // mostrador lo normal es que paguen justo, y así el cajero solo confirma.
  const defaultPayments = (): PaymentDraft[] => [
    {
      key: newDraftKey(),
      methodId: methods?.[0]?.id ?? null,
      methodName: methods?.[0]?.name ?? "",
      currency: chargeCurrency,
      amount: typedAmount(amountIn(chargeCurrency, totals.total_usd)),
      reference: "",
    },
  ];

  const drafts = hasTouchedPayments ? payments : defaultPayments();

  // Sin memoizar a propósito: `drafts` se rehace en cada render mientras el
  // cajero no ha tocado nada, así que un `useMemo` no ahorraría un solo
  // recálculo y solo escondería de qué depende el número.
  const paidUsd = roundMoney(
    drafts.reduce((sum, draft) => {
      const parsed = toAmount(draft.amount);

      return Number.isFinite(parsed) && parsed > 0
        ? sum + toUsd(draft.currency, parsed)
        : sum;
    }, 0),
  );

  const changeUsd = roundMoney(Math.max(0, paidUsd - totals.total_usd));
  const owedUsd = roundMoney(Math.max(0, totals.total_usd - paidUsd));
  const creditEnabled = debtSettings?.credit_enabled ?? false;
  const needsCustomer = isCredit && customer === null;
  const isShort = !isCredit && owedUsd > 0.01;

  const update = (key: string, patch: Partial<PaymentDraft>) => {
    setHasTouchedPayments(true);
    setPayments(
      drafts.map((draft) =>
        draft.key === key
          ? {
              ...draft,
              ...patch,
            }
          : draft,
      ),
    );
  };

  const addPayment = () => {
    setHasTouchedPayments(true);
    setPayments([
      ...drafts,
      {
        key: newDraftKey(),
        methodId: methods?.[0]?.id ?? null,
        methodName: methods?.[0]?.name ?? "",
        currency: chargeCurrency,
        // El resto que falta, ya escrito: es lo que se va a teclear igual.
        amount: typedAmount(amountIn(chargeCurrency, owedUsd)),
        reference: "",
      },
    ]);
  };

  const removePayment = (key: string) => {
    setHasTouchedPayments(true);
    setPayments(drafts.filter((draft) => draft.key !== key));
  };

  const reset = () => {
    setCustomer(null);
    setIsCredit(false);
    setPayments([]);
    setHasTouchedPayments(false);
    setChangeCurrency(CURRENCY.USD);
  };

  const issue = useMutation({
    mutationFn: () => {
      if (userId === null) {
        throw new Error("No hay sesión");
      }

      const input: IssueSaleInput = {
        customer_id: customer?.id ?? null,
        user_id: userId,
        sale_type: isCredit ? SALE_TYPE.CREDIT : SALE_TYPE.CASH,
        items: lines.map((line) => ({
          product_id: line.product_id,
          product_name: line.product_name,
          unit_abbreviation: line.unit_abbreviation,
          quantity: line.quantity,
          unit_price_usd: line.unit_price_usd,
          unit_cost_usd: line.unit_cost_usd,
        })),
        payments: drafts
          .map((draft) => ({
            payment_method_id: draft.methodId,
            payment_method_name: draft.methodName,
            currency: draft.currency,
            amount: toAmount(draft.amount),
            reference: draft.reference.trim() || null,
          }))
          // Una fila vacía es una forma de pago que el cajero acabó no usando.
          .filter(
            (payment) => Number.isFinite(payment.amount) && payment.amount > 0,
          ),
        change_usd: changeUsd,
        change_currency: changeCurrency,
      };

      return pointOfSaleService.issueSale(input);
    },
    onSuccess: async (sale) => {
      await queryClient.invalidateQueries({
        queryKey: salesKeys.all,
      });
      // La venta descontó del inventario: el listado de productos y el aviso
      // de "queda poco" ya no valen.
      await queryClient.invalidateQueries({
        queryKey: inventoryKeys.all,
      });
      reset();
      onIssued(sale.id);
    },
  });

  const close = () => {
    reset();
    onClose();
  };

  const errorMessage = resolveErrorMessage(issue.error);
  const canSubmit =
    !issue.isPending && !needsCustomer && (isCredit || !isShort);

  return (
    <>
      <FormDialog
        onClose={close}
        open={open && !isPickingCustomer}
        title={t("pages.invoicing.checkout.title")}
      >
        <div className="flex flex-col gap-3">
          {errorMessage ? <FormAlert message={errorMessage} /> : null}

          {!hasRate ? (
            <div className="alert alert-info alert-soft" role="alert">
              <span className="text-sm">
                {t("pages.invoicing.checkout.noRate")}
              </span>
            </div>
          ) : null}

          <div className="flex items-baseline justify-between gap-3 rounded-box bg-base-200 p-3">
            <span className="font-medium text-sm">
              {t("pages.invoicing.checkout.toPay")}
            </span>
            <PriceDisplay amountUsd={totals.total_usd} size="lg" />
          </div>

          <button
            className="btn btn-block justify-start"
            onClick={() => setIsPickingCustomer(true)}
            type="button"
          >
            <MdPersonOutline size={20} />
            <span className="truncate">
              {customer?.name ?? t("pages.invoicing.customers.anonymous")}
            </span>
          </button>

          {needsCustomer ? (
            <p className="flex items-center gap-1 text-error text-sm">
              <MdWarningAmber className="shrink-0" size={16} />
              {t("pages.invoicing.checkout.creditNeedsCustomer")}
            </p>
          ) : null}

          {/* --- Formas de pago --- */}
          <div className="flex flex-col gap-3">
            {drafts.map((draft) => (
              <div
                className="flex flex-col gap-2 rounded-box border border-base-300 p-3"
                key={draft.key}
              >
                <div className="flex items-center gap-2">
                  <select
                    aria-label={t("pages.invoicing.checkout.methodLabel")}
                    className="select select-sm w-full"
                    onChange={(event) => {
                      const id = Number(event.target.value);
                      const method = methods?.find((item) => item.id === id);

                      update(draft.key, {
                        methodId: method?.id ?? null,
                        methodName: method?.name ?? "",
                      });
                    }}
                    value={draft.methodId ?? ""}
                  >
                    {methods?.map((method) => (
                      <option key={method.id} value={method.id}>
                        {method.name}
                      </option>
                    ))}
                  </select>

                  {drafts.length > 1 ? (
                    <button
                      aria-label={t("pages.invoicing.checkout.removePayment")}
                      className="btn btn-ghost btn-sm btn-square text-error"
                      onClick={() => removePayment(draft.key)}
                      type="button"
                    >
                      <MdClose size={18} />
                    </button>
                  ) : null}
                </div>

                <div className="join w-full">
                  <button
                    className={
                      draft.currency === CURRENCY.USD
                        ? "btn btn-sm join-item btn-active"
                        : "btn btn-sm join-item"
                    }
                    onClick={() =>
                      update(draft.key, {
                        currency: CURRENCY.USD,
                      })
                    }
                    type="button"
                  >
                    {CURRENCY_SYMBOL[CURRENCY.USD]}
                  </button>
                  <button
                    className={
                      draft.currency === CURRENCY.VES
                        ? "btn btn-sm join-item btn-active"
                        : "btn btn-sm join-item"
                    }
                    disabled={!hasRate}
                    onClick={() =>
                      update(draft.key, {
                        currency: CURRENCY.VES,
                      })
                    }
                    type="button"
                  >
                    {CURRENCY_SYMBOL[CURRENCY.VES]}
                  </button>
                  <input
                    aria-label={t("pages.invoicing.checkout.amountLabel")}
                    className="input input-sm join-item w-full text-right"
                    inputMode="decimal"
                    onChange={(event) =>
                      update(draft.key, {
                        amount: event.target.value,
                      })
                    }
                    value={draft.amount}
                  />
                </div>

                <input
                  aria-label={t("pages.invoicing.checkout.referenceLabel")}
                  className="input input-sm w-full"
                  onChange={(event) =>
                    update(draft.key, {
                      reference: event.target.value,
                    })
                  }
                  placeholder={t(
                    "pages.invoicing.checkout.referencePlaceholder",
                  )}
                  value={draft.reference}
                />
              </div>
            ))}

            <button
              className="btn btn-ghost btn-sm self-start"
              onClick={addPayment}
              type="button"
            >
              <MdAdd size={18} />
              {t("pages.invoicing.checkout.addPayment")}
            </button>
          </div>

          {/* --- Cuentas --- */}
          <dl className="flex flex-col gap-1 rounded-box bg-base-200 p-3 text-sm">
            <div className="flex items-baseline justify-between gap-3">
              <dt className="opacity-70">
                {t("pages.invoicing.checkout.received")}
              </dt>
              <dd>{format(paidUsd).primary}</dd>
            </div>

            {changeUsd > 0 ? (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <dt className="font-medium">
                  {t("pages.invoicing.checkout.change")}
                </dt>
                <dd className="flex items-center gap-2">
                  <span className="font-semibold text-lg">
                    {showAmount(
                      changeCurrency,
                      amountIn(changeCurrency, changeUsd),
                    )}
                  </span>
                  {hasRate ? (
                    <span className="join">
                      <button
                        className={
                          changeCurrency === CURRENCY.USD
                            ? "btn btn-xs join-item btn-active"
                            : "btn btn-xs join-item"
                        }
                        onClick={() => setChangeCurrency(CURRENCY.USD)}
                        type="button"
                      >
                        {CURRENCY_SYMBOL[CURRENCY.USD]}
                      </button>
                      <button
                        className={
                          changeCurrency === CURRENCY.VES
                            ? "btn btn-xs join-item btn-active"
                            : "btn btn-xs join-item"
                        }
                        onClick={() => setChangeCurrency(CURRENCY.VES)}
                        type="button"
                      >
                        {CURRENCY_SYMBOL[CURRENCY.VES]}
                      </button>
                    </span>
                  ) : null}
                </dd>
              </div>
            ) : null}

            {owedUsd > 0 ? (
              <div className="flex items-baseline justify-between gap-3">
                <dt className={isShort ? "text-error" : "font-medium"}>
                  {isCredit
                    ? t("pages.invoicing.checkout.owed")
                    : t("pages.invoicing.checkout.missing")}
                </dt>
                <dd className={isShort ? "text-error" : "font-semibold"}>
                  {format(owedUsd).primary}
                </dd>
              </div>
            ) : null}
          </dl>

          {creditEnabled ? (
            <label className="label cursor-pointer justify-start gap-3">
              <input
                checked={isCredit}
                className="toggle toggle-sm"
                onChange={(event) => setIsCredit(event.target.checked)}
                type="checkbox"
              />
              <span className="label-text">
                {t("pages.invoicing.checkout.credit")}
              </span>
            </label>
          ) : null}

          <button
            className="btn btn-primary btn-block"
            disabled={!canSubmit}
            onClick={() => issue.mutate()}
            type="button"
          >
            {issue.isPending ? (
              <span className="loading loading-spinner" />
            ) : null}
            {isCredit
              ? t("pages.invoicing.checkout.confirmCredit")
              : t("pages.invoicing.checkout.confirm")}
          </button>
        </div>
      </FormDialog>

      <CustomerPickerDialog
        canCreate={canCreateCustomer}
        onClose={() => setIsPickingCustomer(false)}
        onPick={(picked) => {
          setCustomer(picked);
          setIsPickingCustomer(false);
        }}
        open={isPickingCustomer}
      />
    </>
  );
};

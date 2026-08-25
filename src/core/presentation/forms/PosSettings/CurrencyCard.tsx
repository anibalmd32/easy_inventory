import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { MdAttachMoney } from "react-icons/md";
import { CURRENCY } from "../../../domain/enums/currencies";
import { posSettingsService } from "../../../infrastructure/container";
import { FormAlert } from "../../components/FormAlert";
import { PriceDisplay } from "../../components/PriceDisplay";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import { usePriceFormatter } from "../../hooks/usePriceFormatter";
import {
  posSettingQueryOptions,
  posSettingsKeys,
} from "../../queries/posSettingsQueries";

/** Importe de ejemplo de la vista previa. */
const SAMPLE_AMOUNT_USD = 12.5;

/**
 * Elige cuál de las dos monedas se muestra grande.
 *
 * El interruptor no cambia dónde se guarda el dinero: los precios están
 * siempre en dólares y los bolívares se derivan de la tasa. Solo decide qué
 * importe destaca; el otro se sigue viendo, más pequeño y entre paréntesis.
 */
export const CurrencyCard = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const resolveErrorMessage = useErrorMessage();
  const { data, isPending } = useQuery(posSettingQueryOptions);
  const { hasRate } = usePriceFormatter();

  const save = useMutation({
    mutationFn: (currency: CURRENCY) =>
      posSettingsService.setPrimaryCurrency({
        primary_currency: currency,
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: posSettingsKeys.settings,
      }),
  });

  const isDollarPrimary = data?.primary_currency === CURRENCY.USD;
  const errorMessage = resolveErrorMessage(save.error);
  const isBusy = isPending || save.isPending;

  return (
    <section className="card bg-base-100 shadow-sm">
      <div className="card-body gap-4 p-4 sm:p-6">
        <header className="flex items-start gap-3">
          <MdAttachMoney className="mt-1 shrink-0 opacity-60" size={22} />
          <div className="min-w-0">
            <h2 className="font-semibold">
              {t("pages.settings.pos.currency.title")}
            </h2>
            <p className="text-sm opacity-70">
              {t("pages.settings.pos.currency.description")}
            </p>
          </div>
        </header>

        {errorMessage ? <FormAlert message={errorMessage} /> : null}

        {/* El nombre activo se resalta y el otro se atenúa, para que se vea de
            un golpe hacia qué lado está el interruptor. */}
        <label className="flex cursor-pointer items-center justify-center gap-4">
          <span
            className={
              isDollarPrimary
                ? "font-semibold opacity-40 transition-opacity"
                : "font-semibold text-primary transition-opacity"
            }
          >
            {t("pages.settings.pos.currency.bolivares")}
          </span>
          <input
            aria-label={t("pages.settings.pos.currency.title")}
            checked={isDollarPrimary}
            className="toggle toggle-primary"
            disabled={isBusy}
            onChange={(event) =>
              save.mutate(event.target.checked ? CURRENCY.USD : CURRENCY.VES)
            }
            type="checkbox"
          />
          <span
            className={
              isDollarPrimary
                ? "font-semibold text-primary transition-opacity"
                : "font-semibold opacity-40 transition-opacity"
            }
          >
            {t("pages.settings.pos.currency.dolares")}
          </span>
        </label>

        {/* La vista previa usa el mismo componente que los precios reales, así
            que no puede mentir sobre cómo se van a ver. */}
        <div className="flex flex-col items-center gap-1 rounded-box bg-base-200 p-4">
          <p className="text-xs uppercase opacity-60">
            {t("pages.settings.pos.currency.preview")}
          </p>
          <PriceDisplay amountUsd={SAMPLE_AMOUNT_USD} size="lg" />
        </div>

        {!hasRate ? (
          <p className="text-sm text-warning">
            {t("pages.settings.pos.currency.noRate")}
          </p>
        ) : null}
      </div>
    </section>
  );
};

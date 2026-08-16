import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MdAdd,
  MdCurrencyExchange,
  MdHistory,
  MdRefresh,
} from "react-icons/md";
import { formatRate, formatRateDateTime } from "../../../../utils/formatRate";
import type { ExchangeRateData } from "../../../domain/data/ExchangeRateData";
import { FormDialog } from "../../components/FormDialog";
import {
  currentRateQueryOptions,
  rateHistoryQueryOptions,
} from "../../queries/posSettingsQueries";
import { RateForm } from "./RateForm";

interface RateHistoryProps {
  items: ExchangeRateData[] | undefined;
  isLoading: boolean;
}

/**
 * Cronología de los cambios de tasa, del más reciente al más antiguo. Es una
 * secuencia de verdad, así que un timeline es la estructura que le toca.
 */
const RateHistory = ({ items, isLoading }: RateHistoryProps) => {
  const { t, i18n } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <div className="skeleton h-12 w-full" />
        <div className="skeleton h-12 w-full" />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <p className="text-sm opacity-70">
        {t("pages.settings.pos.exchangeRate.historyEmpty")}
      </p>
    );
  }

  return (
    <ul className="timeline timeline-vertical max-sm:timeline-compact">
      {items.map((entry, index) => (
        <li key={entry.id}>
          {/* El <hr> es el tramo de línea que conecta con el cambio
              anterior/siguiente; el primero y el último solo llevan uno. */}
          {index > 0 ? <hr /> : null}
          <div className="timeline-start text-sm opacity-70">
            {formatRateDateTime(entry.created_at, i18n.language)}
          </div>
          <div className="timeline-middle">
            <span className="grid size-6 place-items-center rounded-full bg-base-200">
              <MdCurrencyExchange className="opacity-70" size={14} />
            </span>
          </div>
          <div className="timeline-end flex flex-col items-start gap-1">
            <span className="font-mono font-medium">
              1 $ = {formatRate(entry.rate, i18n.language)} Bs
            </span>
            {index === 0 ? (
              <span className="badge badge-primary badge-sm">
                {t("pages.settings.pos.exchangeRate.currentBadge")}
              </span>
            ) : null}
          </div>
          {index < items.length - 1 ? <hr /> : null}
        </li>
      ))}
    </ul>
  );
};

/**
 * Tasa de cambio dólar–bolívar: el número grande es lo que se ve al entrar;
 * actualizar abre un diálogo y el historial vive detrás de su propio botón,
 * fuera de la vista principal.
 */
export const ExchangeRateCard = () => {
  const { t, i18n } = useTranslation();
  const [isRateDialogOpen, setIsRateDialogOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { data: current, isPending } = useQuery(currentRateQueryOptions);
  // El historial solo se pide cuando el usuario lo abre, no al entrar.
  const history = useQuery({
    ...rateHistoryQueryOptions,
    enabled: isHistoryOpen,
  });

  return (
    <section className="card bg-base-100 shadow-sm">
      <div className="card-body gap-4 p-4 sm:p-6">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-semibold">
              {t("pages.settings.pos.exchangeRate.title")}
            </h2>
            <p className="text-sm opacity-70">
              {t("pages.settings.pos.exchangeRate.description")}
            </p>
          </div>
          <button
            className="btn btn-ghost btn-sm shrink-0"
            onClick={() => setIsHistoryOpen(true)}
            type="button"
          >
            <MdHistory size={18} />
            {t("pages.settings.pos.exchangeRate.history")}
          </button>
        </header>

        {isPending ? <div className="skeleton h-20 w-full" /> : null}

        {!isPending && current ? (
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm opacity-70">
                {t("pages.settings.pos.exchangeRate.current")}
              </p>
              <p className="mt-1 font-mono text-3xl font-bold tracking-tight">
                1 $ = {formatRate(current.rate, i18n.language)} Bs
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm opacity-70">
                <span className="badge badge-ghost badge-sm">
                  {t("pages.settings.pos.exchangeRate.sourceManual")}
                </span>
                {t("pages.settings.pos.exchangeRate.updatedAt", {
                  date: formatRateDateTime(current.created_at, i18n.language),
                })}
              </div>
            </div>
            <button
              className="btn btn-primary btn-sm shrink-0"
              onClick={() => setIsRateDialogOpen(true)}
              type="button"
            >
              <MdRefresh size={18} />
              {t("pages.settings.pos.exchangeRate.update")}
            </button>
          </div>
        ) : null}

        {!isPending && !current ? (
          <div className="flex flex-col items-start gap-3 rounded-box border border-base-300 border-dashed p-6 sm:items-center sm:text-center">
            <p className="font-medium">
              {t("pages.settings.pos.exchangeRate.emptyTitle")}
            </p>
            <p className="text-sm opacity-70">
              {t("pages.settings.pos.exchangeRate.emptyBody")}
            </p>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setIsRateDialogOpen(true)}
              type="button"
            >
              <MdAdd size={18} />
              {t("pages.settings.pos.exchangeRate.setFirst")}
            </button>
          </div>
        ) : null}
      </div>

      <FormDialog
        description={
          current
            ? t("pages.settings.pos.exchangeRate.updateDescription", {
                rate: formatRate(current.rate, i18n.language),
              })
            : t("pages.settings.pos.exchangeRate.setDescription")
        }
        onClose={() => setIsRateDialogOpen(false)}
        open={isRateDialogOpen}
        title={
          current
            ? t("pages.settings.pos.exchangeRate.updateTitle")
            : t("pages.settings.pos.exchangeRate.setTitle")
        }
      >
        {isRateDialogOpen ? (
          <RateForm onDone={() => setIsRateDialogOpen(false)} />
        ) : null}
      </FormDialog>

      <FormDialog
        description={t("pages.settings.pos.exchangeRate.historyDescription")}
        onClose={() => setIsHistoryOpen(false)}
        open={isHistoryOpen}
        title={t("pages.settings.pos.exchangeRate.historyTitle")}
      >
        <div className="max-h-96 overflow-y-auto">
          <RateHistory isLoading={history.isPending} items={history.data} />
        </div>
      </FormDialog>
    </section>
  );
};

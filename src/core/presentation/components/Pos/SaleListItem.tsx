import { useTranslation } from "react-i18next";
import { MdChevronRight } from "react-icons/md";
import { formatTime } from "../../../../utils/localDay";
import type { SaleListItemData } from "../../../domain/data/SaleData";
import { SALE_STATUS, SALE_TYPE } from "../../../domain/enums/sales";
import { PriceDisplay } from "../PriceDisplay";

interface SaleListItemProps {
  sale: SaleListItemData;
  onOpen: (saleId: number) => void;
}

/**
 * Una fila del historial del día.
 *
 * Lo primero que busca el cajero es el número y la hora ("la venta de hace un
 * rato"), así que van juntos y arriba. El importe va a la derecha, que es donde
 * se lee de un vistazo.
 */
export const SaleListItem = ({ sale, onOpen }: SaleListItemProps) => {
  const { t, i18n } = useTranslation();
  const isVoided = sale.status === SALE_STATUS.VOIDED;

  return (
    <li className="list-row items-center">
      <div className="list-col-grow min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span
            className={
              isVoided
                ? "font-mono font-medium line-through opacity-50"
                : "font-mono font-medium"
            }
          >
            {sale.invoice_number}
          </span>
          <span className="text-xs opacity-60">
            {formatTime(sale.created_at, i18n.language)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {isVoided ? (
            <span className="badge badge-error badge-sm">
              {t("pages.invoicing.list.voided")}
            </span>
          ) : null}
          {sale.sale_type === SALE_TYPE.CREDIT && !isVoided ? (
            <span className="badge badge-warning badge-sm">
              {t("pages.invoicing.list.credit")}
            </span>
          ) : null}
          <span className="truncate text-xs opacity-60">
            {sale.customer_name ?? t("pages.invoicing.customers.anonymous")} ·{" "}
            {t("pages.invoicing.list.itemCount", {
              count: sale.item_count,
            })}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <span className={isVoided ? "opacity-50" : undefined}>
          <PriceDisplay amountUsd={sale.total_usd} size="sm" />
        </span>
        <button
          aria-label={t("pages.invoicing.list.open", {
            number: sale.invoice_number,
          })}
          className="btn btn-ghost btn-sm btn-square"
          onClick={() => onOpen(sale.id)}
          type="button"
        >
          <MdChevronRight size={20} />
        </button>
      </div>
    </li>
  );
};

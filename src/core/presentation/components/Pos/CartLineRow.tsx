import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MdAdd,
  MdDeleteOutline,
  MdRemove,
  MdWarningAmber,
} from "react-icons/md";
import { formatQuantity } from "../../../../utils/formatQuantity";
import { roundMoney, roundQuantity } from "../../../../utils/money";
import type { CartLineData } from "../../../domain/data/CartData";
import { toAmount } from "../../../infrastructure/schemas/toAmount";
import { PriceDisplay } from "../PriceDisplay";

interface CartLineRowProps {
  line: CartLineData;
  onQuantityChange: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

/** Cuánto sube o baja cada toque del más y el menos. */
const STEP = 1;

/**
 * La cantidad tal como se escribe DENTRO del campo: con coma decimal pero SIN
 * separador de miles.
 *
 * El punto de miles aquí sería un error de verdad: al leer el campo de vuelta,
 * "1.000" no lleva coma y se interpretaría como uno con tres decimales, así
 * que una línea de mil unidades se convertiría en una sola al salir del campo.
 */
const typedQuantity = (value: number, locale: string): string =>
  value.toLocaleString(locale, {
    maximumFractionDigits: 3,
    useGrouping: false,
  });

/**
 * Una línea del carrito: qué se lleva, cuánto y por cuánto.
 *
 * La cantidad se toca con dos botones grandes, que es lo que se puede acertar
 * con una mano y sin mirar, y también se puede escribir para la mercancía que
 * se pesa. Si se pide más de lo que hay apuntado se avisa en amarillo, pero no
 * se bloquea nada: el inventario registrado casi nunca cuadra con el real.
 */
export const CartLineRow = ({
  line,
  onQuantityChange,
  onRemove,
}: CartLineRowProps) => {
  const { t, i18n } = useTranslation();
  // Mientras se escribe, el campo manda: convertirlo a número en cada tecla
  // impediría teclear "1," antes del decimal.
  const [draft, setDraft] = useState<string | null>(null);
  const isShort = line.quantity > line.available_quantity;
  const lineTotal = roundMoney(line.quantity * line.unit_price_usd);

  const commit = (value: string) => {
    const parsed = toAmount(value);
    setDraft(null);

    if (Number.isFinite(parsed) && parsed > 0) {
      onQuantityChange(line.product_id, parsed);
    }
  };

  const step = (delta: number) => {
    const next = roundQuantity(line.quantity + delta);

    if (next > 0) {
      onQuantityChange(line.product_id, next);
    }
  };

  return (
    <li className="list-row items-center">
      <div className="list-col-grow min-w-0">
        <p className="truncate font-medium">{line.product_name}</p>
        <PriceDisplay amountUsd={lineTotal} size="sm" />

        {isShort ? (
          <p className="flex items-center gap-1 text-warning text-xs">
            <MdWarningAmber className="shrink-0" size={14} />
            {t("pages.invoicing.cart.notEnough", {
              available: formatQuantity(line.available_quantity, i18n.language),
              unit: line.unit_abbreviation,
            })}
          </p>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          aria-label={t("pages.invoicing.cart.less")}
          className="btn btn-sm btn-square"
          disabled={line.quantity <= STEP}
          onClick={() => step(-STEP)}
          type="button"
        >
          <MdRemove size={18} />
        </button>

        <input
          aria-label={t("pages.invoicing.cart.quantity")}
          className={
            isShort
              ? "input input-sm input-warning w-16 text-center"
              : "input input-sm w-16 text-center"
          }
          inputMode="decimal"
          onBlur={(event) => commit(event.target.value)}
          onChange={(event) => setDraft(event.target.value)}
          value={draft ?? typedQuantity(line.quantity, i18n.language)}
        />

        <button
          aria-label={t("pages.invoicing.cart.more")}
          className="btn btn-sm btn-square"
          onClick={() => step(STEP)}
          type="button"
        >
          <MdAdd size={18} />
        </button>

        <button
          aria-label={t("pages.invoicing.cart.remove")}
          className="btn btn-ghost btn-sm btn-square text-error"
          onClick={() => onRemove(line.product_id)}
          type="button"
        >
          <MdDeleteOutline size={18} />
        </button>
      </div>
    </li>
  );
};

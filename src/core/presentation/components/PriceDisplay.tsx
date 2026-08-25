import { usePriceFormatter } from "../hooks/usePriceFormatter";

interface PriceDisplayProps {
  /**
   * Importe en DÓLARES. Es la moneda en la que se guardan los precios; el
   * equivalente en bolívares se calcula aquí con la tasa vigente.
   */
  amountUsd: number;
  size?: "sm" | "md" | "lg";
}

const PRIMARY_SIZE = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-2xl",
} as const;

/**
 * Precio con el importe principal destacado y el otro siempre visible, más
 * pequeño y entre paréntesis. Cuál va grande lo decide la configuración del
 * punto de venta.
 */
export const PriceDisplay = ({ amountUsd, size = "md" }: PriceDisplayProps) => {
  const { format } = usePriceFormatter();
  const { primary, secondary } = format(amountUsd);

  return (
    <span className="inline-flex flex-wrap items-baseline gap-1">
      <span className={`font-semibold ${PRIMARY_SIZE[size]}`}>{primary}</span>
      {secondary ? (
        <span className="text-xs opacity-60">({secondary})</span>
      ) : null}
    </span>
  );
};

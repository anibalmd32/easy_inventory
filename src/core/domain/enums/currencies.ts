/**
 * Monedas con las que trabaja el punto de venta.
 *
 * Los precios de los productos se guardan SIEMPRE en dólares; el importe en
 * bolívares se deriva de la tasa vigente. Esto solo decide cuál de los dos se
 * muestra grande.
 */
export enum CURRENCY {
  USD = "USD",
  VES = "VES",
}

/** Símbolo que precede al importe en cada moneda. */
export const CURRENCY_SYMBOL: Record<CURRENCY, string> = {
  [CURRENCY.USD]: "$",
  [CURRENCY.VES]: "Bs",
};

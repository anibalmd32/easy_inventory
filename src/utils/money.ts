/**
 * Redondea un importe a dos decimales.
 *
 * Todo el dinero de la app son números en coma flotante, y sumar precios sin
 * redondear acaba enseñando 10,000000000000002 en el total. Se redondea en
 * cada paso —línea, subtotal, conversión— y no solo al final, porque lo que
 * se guarda en la factura tiene que ser exactamente lo que el cajero vio.
 */
export const roundMoney = (value: number): number =>
  Math.round((value + Number.EPSILON) * 100) / 100;

/** Bolívares que valen esos dólares, con la tasa dada. */
export const toBolivares = (amountUsd: number, rate: number): number =>
  roundMoney(amountUsd * rate);

/** Dólares que valen esos bolívares, con la tasa dada. */
export const toDollars = (amountVes: number, rate: number): number =>
  roundMoney(amountVes / rate);

/**
 * Redondea una cantidad de mercancía a tres decimales: es lo que admite el
 * formateo de existencias y evita arrastrar un 0,30000000000000004 al restar
 * del inventario.
 */
export const roundQuantity = (value: number): number =>
  Math.round((value + Number.EPSILON) * 1000) / 1000;

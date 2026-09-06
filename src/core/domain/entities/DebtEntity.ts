import type { DEBT_STATUS } from "../enums/debts";

/**
 * Una fila de `debt` tal como vive en SQLite (migración 16).
 *
 * El punto de venta la crea al emitir una venta fiada y la cancela al anular
 * esa venta. Todo lo demás (abonos, vencimientos) es del módulo de deudas.
 */
export type DebtEntity = {
  customer_id: number;
  /** `null` cuando la deuda se carga a mano, sin venta detrás. */
  sale_id: number | null;
  /** Quién la concedió. */
  user_id: number;
  /**
   * Lo que quedó a deber, en dólares. Puede ser menos que el total de la
   * venta si el cliente abonó algo en el momento.
   */
  original_amount_usd: number;
  /** Lo abonado después. Lo mueve el módulo de deudas. */
  paid_amount_usd: number;
  status: DEBT_STATUS;
  due_date: string;
};

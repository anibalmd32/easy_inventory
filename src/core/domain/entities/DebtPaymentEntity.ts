import type { CURRENCY } from "../enums/currencies";

/**
 * Una fila de `debt_payment` tal como vive en SQLite (migración 16).
 *
 * El punto de venta NO escribe aquí: los abonos son del módulo de deudas. La
 * tabla se crea con las ventas porque es inseparable de `debt`, y así ese
 * módulo no tiene que rehacer el esquema cuando llegue.
 */
export type DebtPaymentEntity = {
  debt_id: number;
  user_id: number;
  payment_method_id: number | null;
  payment_method_name: string;
  currency: CURRENCY;
  /** Lo que entregó el cliente, en su moneda. */
  amount: number;
  /** Lo mismo en dólares, con la tasa del día del abono. */
  amount_usd: number;
  exchange_rate: number | null;
  reference: string | null;
};

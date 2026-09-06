import type { CURRENCY } from "../enums/currencies";

/**
 * Una fila de `sale_payment` tal como vive en SQLite (migración 15).
 *
 * Una fila por forma de pago: el pago mixto (parte efectivo, parte pago
 * móvil) es lo normal en Venezuela y así no necesita ningún cambio de
 * esquema.
 */
export type SalePaymentEntity = {
  sale_id: number;
  payment_method_id: number | null;
  /** Copiado del catálogo: la forma de pago puede borrarse después. */
  payment_method_name: string;
  currency: CURRENCY;
  /** Lo que entregó el cliente, EN SU MONEDA. Es lo que va en el recibo. */
  amount: number;
  /** Lo mismo en dólares, con la tasa congelada de la venta. */
  amount_usd: number;
  /** Referencia del pago móvil o de la transferencia. */
  reference: string | null;
};

import type { CURRENCY } from "../enums/currencies";
import type { SALE_STATUS, SALE_TYPE } from "../enums/sales";

/**
 * Una fila de `sale` tal como vive en SQLite (migración 15).
 *
 * Los importes están en DÓLARES, como en toda la app. Lo que sí se congela
 * aquí es `exchange_rate`: sin ella, reimprimir un recibo del mes pasado
 * mostraría unos bolívares que el cliente nunca pagó.
 */
export type SaleEntity = {
  /** El número tal cual se imprime, con el prefijo pegado ("A-000123"). */
  invoice_number: string;
  /** El correlativo desnudo, para ordenar y para ver saltos. */
  invoice_serial: number;
  /** `null` en la venta de mostrador anónima, que es la mayoría. */
  customer_id: number | null;
  /** Quién la hizo. Sin esto no hay cierre de caja posible. */
  user_id: number;
  status: SALE_STATUS;
  sale_type: SALE_TYPE;
  subtotal_usd: number;
  /** Hoy siempre 0: no hay rebajas en pantalla. */
  discount_usd: number;
  total_usd: number;
  /** Bolívares por dólar al emitir. `null` si no había tasa fijada. */
  exchange_rate: number | null;
  /** Vuelto entregado, en dólares, y en qué moneda se le dio. */
  change_usd: number;
  change_currency: CURRENCY;
  voided_at: string | null;
  voided_by_user_id: number | null;
  void_reason: string | null;
};

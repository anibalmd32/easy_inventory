/**
 * Estados de una deuda, tal cual los acota el `CHECK` de la migración 16.
 *
 * El punto de venta solo crea deudas `OPEN` y las pasa a `CANCELLED` cuando se
 * anula su venta. `PAID` lo pone el módulo de deudas al cobrar el último
 * abono.
 */
export enum DEBT_STATUS {
  OPEN = "open",
  PAID = "paid",
  CANCELLED = "cancelled",
}

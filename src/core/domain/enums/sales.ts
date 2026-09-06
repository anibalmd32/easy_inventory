/**
 * Estados y tipos de una venta, tal cual los acotan los `CHECK` de la
 * migración 15. Cambiar uno aquí obliga a cambiarlo allá.
 */

/**
 * Una venta no se borra nunca: se anula. La anulada conserva su número, igual
 * que una factura tachada en un talonario de papel.
 */
export enum SALE_STATUS {
  ISSUED = "issued",
  VOIDED = "voided",
}

/** Si el cliente pagó en el momento o se lo llevó fiado. */
export enum SALE_TYPE {
  CASH = "cash",
  CREDIT = "credit",
}

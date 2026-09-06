/**
 * Claves i18n de los errores del punto de venta y de los clientes.
 *
 * Los errores del inventario viven en `inventoryErrorMessages` y los de los
 * catálogos de configuración en `catalogErrorMessages`.
 */
export enum SALES_ERROR_MESSAGES {
  /** El carrito está vacío: no hay nada que cobrar. */
  empty_cart = "errors.sales.empty_cart",
  invalid_sale = "errors.sales.invalid_sale",
  /** El cobro no llega al total de la venta. */
  insufficient_payment = "errors.sales.insufficient_payment",
  /** Se eligió cobrar en bolívares sin tener una tasa fijada. */
  rate_required = "errors.sales.rate_required",
  /** El negocio tiene el fiado apagado en la configuración. */
  credit_disabled = "errors.sales.credit_disabled",
  /** Una venta fiada sin cliente no se le puede cobrar a nadie. */
  credit_customer_required = "errors.sales.credit_customer_required",
  /** El cliente pasaría del límite de deuda configurado. */
  debt_limit_reached = "errors.sales.debt_limit_reached",
  /** El correlativo se agotó de reintentos: otra venta ganó la carrera. */
  invoice_number_taken = "errors.sales.invoice_number_taken",
  sale_not_found = "errors.sales.sale_not_found",
  /** Se intentó anular una venta que ya estaba anulada. */
  already_voided = "errors.sales.already_voided",
  receipt_failed = "errors.sales.receipt_failed",
  customer_not_found = "errors.sales.customer_not_found",
  duplicate_customer_document = "errors.sales.duplicate_customer_document",
  invalid_customer = "errors.sales.invalid_customer",
}

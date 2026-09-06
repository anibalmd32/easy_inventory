/**
 * Claves i18n de los errores del módulo de inventario (los productos).
 * Los errores de sus catálogos de configuración viven en
 * `catalogErrorMessages`.
 */
export enum INVENTORY_ERROR_MESSAGES {
  duplicate_product = "errors.inventory.duplicate_product",
  duplicate_sku = "errors.inventory.duplicate_sku",
  not_found = "errors.inventory.not_found",
  invalid_form = "errors.inventory.invalid_form",
  /** Se intentó guardar un producto sin elegir unidad de medida. */
  unit_required = "errors.inventory.unit_required",
  /** No hay nada que llevar al catálogo. */
  empty_catalog = "errors.inventory.empty_catalog",
  catalog_failed = "errors.inventory.catalog_failed",
}

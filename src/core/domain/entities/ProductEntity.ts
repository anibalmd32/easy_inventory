/**
 * Una fila de `product` tal como vive en SQLite.
 *
 * Los precios están en DÓLARES (ver la migración 08): el importe en bolívares
 * se deriva siempre de la tasa vigente.
 */
export type ProductEntity = {
  name: string;
  description: string | null;
  /** Código de barras o código propio del negocio. Opcional. */
  sku: string | null;
  /** `null` cuando el producto no está agrupado en ninguna categoría. */
  category_id: number | null;
  measurement_unit_id: number;
  sale_price: number;
  /** Lo que le cuesta al negocio. Nunca sale en el catálogo compartido. */
  cost_price: number;
  /** Decimal: hay productos que se venden por kilos o por litros. */
  quantity: number;
  /**
   * Umbral propio de "queda poco". `null` = usar el general de la
   * configuración de inventario.
   */
  min_quantity: number | null;
  /** Data URL ya reducida, igual que el logo del negocio. */
  photo: string | null;
};

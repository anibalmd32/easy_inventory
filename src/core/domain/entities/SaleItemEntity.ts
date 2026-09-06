/**
 * Una fila de `sale_item` tal como vive en SQLite (migración 15).
 *
 * El nombre, la unidad y el precio se COPIAN del producto en vez de cruzarse
 * al leer: el catálogo se borra en lógico y cambia de precio, y una factura
 * emitida no puede cambiar nunca más.
 */
export type SaleItemEntity = {
  sale_id: number;
  /** Puede apuntar a un producto ya retirado del catálogo. */
  product_id: number | null;
  product_name: string;
  unit_abbreviation: string;
  /** Decimal: hay productos por kilo y por litro. */
  quantity: number;
  unit_price_usd: number;
  /**
   * Lo que le costaba al negocio ese día. No sale en ninguna pantalla: está
   * para poder calcular la ganancia real más adelante, y ese dato es
   * imposible de reconstruir después.
   */
  unit_cost_usd: number;
  line_total_usd: number;
};

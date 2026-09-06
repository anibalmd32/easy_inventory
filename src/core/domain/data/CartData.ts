/**
 * Una línea del carrito, mientras la venta todavía se está armando.
 *
 * No es una tabla: vive en la pantalla hasta que se cobra. Lleva copiados el
 * nombre, la unidad y los precios del producto porque son exactamente los que
 * se congelarán en `sale_item` al emitir: lo que se cobra es lo que el cajero
 * vio, aunque el dueño esté cambiando precios en ese mismo momento.
 */
export type CartLineData = {
  product_id: number;
  product_name: string;
  unit_abbreviation: string;
  unit_price_usd: number;
  unit_cost_usd: number;
  quantity: number;
  /**
   * Lo que había registrado en el inventario al añadirlo. Sirve solo para
   * avisar de que no alcanza; la venta no se bloquea por esto.
   */
  available_quantity: number;
};

/** Los totales del carrito, en dólares. */
export type CartTotalsData = {
  subtotal_usd: number;
  discount_usd: number;
  total_usd: number;
};

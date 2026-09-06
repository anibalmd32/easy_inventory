import type { ProductEntity } from "../entities/ProductEntity";

/**
 * Un producto tal como se lista en pantalla: con el nombre de su categoría y
 * de su unidad ya resueltos, para no tener que cruzarlos en la vista.
 */
export type ProductData = ProductEntity & {
  id: number;
  /** `null` si el producto no tiene categoría. */
  category_name: string | null;
  unit_name: string;
  unit_abbreviation: string;
  /**
   * Si al producto le queda poco. Lo decide SQL comparando la existencia
   * contra `min_quantity` o, si no tiene, contra el umbral general.
   */
  is_low: boolean;
};

/** Una página del listado, con el total para poder paginar. */
export type ProductPageData = {
  items: ProductData[];
  total: number;
};

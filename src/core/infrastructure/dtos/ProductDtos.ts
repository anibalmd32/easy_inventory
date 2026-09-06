import * as v from "valibot";
import { OptionalDescriptionSchema } from "../schemas/CatalogSchemas";
import {
  OptionalCategoryIdSchema,
  OptionalMinQuantitySchema,
  OptionalPhotoSchema,
  OptionalSkuSchema,
  PriceSchema,
  ProductNameSchema,
  StockQuantitySchema,
  UnitIdSchema,
} from "../schemas/ProductSchemas";

/**
 * Un producto tal como sale del formulario: todo son cadenas porque es lo que
 * entregan los `<input>` y los `<select>`. El esquema es el que las convierte
 * a números y a `null`.
 */
export const ProductDto = v.object({
  name: ProductNameSchema,
  description: OptionalDescriptionSchema,
  sku: OptionalSkuSchema,
  category_id: OptionalCategoryIdSchema,
  measurement_unit_id: UnitIdSchema,
  sale_price: PriceSchema,
  cost_price: PriceSchema,
  quantity: StockQuantitySchema,
  min_quantity: OptionalMinQuantitySchema,
  photo: OptionalPhotoSchema,
});

export type ProductInput = v.InferInput<typeof ProductDto>;
export type ProductOutput = v.InferOutput<typeof ProductDto>;

/**
 * Filtros del listado. Viven aquí y no en la vista porque el filtrado se
 * resuelve en SQL: la lista puede crecer mucho y no tiene sentido traérsela
 * entera para descartar la mayoría en memoria.
 */
export type ProductFilters = {
  /** Busca en el nombre y en el código. */
  search: string;
  /** `null` = todas las categorías. `0` = solo los que no tienen ninguna. */
  categoryId: number | null;
  /** Solo los que están por acabarse. */
  onlyLow: boolean;
  page: number;
  pageSize: number;
};

/** Categoría "sin categoría" en el filtro: no es un id real. */
export const UNCATEGORIZED_FILTER = 0;

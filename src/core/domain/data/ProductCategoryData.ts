import type { ProductCategoryEntity } from "../entities/ProductCategoryEntity";

export type ProductCategoryData = ProductCategoryEntity & {
  id: number;
};

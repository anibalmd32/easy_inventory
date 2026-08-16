import * as v from "valibot";
import {
  AbbreviationSchema,
  CatalogNameSchema,
  LowQuantitySchema,
  OptionalDescriptionSchema,
} from "../schemas/CatalogSchemas";

export const ProductCategoryDto = v.object({
  name: CatalogNameSchema,
  description: OptionalDescriptionSchema,
});

export const MeasurementUnitDto = v.object({
  name: CatalogNameSchema,
  abbreviation: AbbreviationSchema,
});

export const LowQuantityDto = v.object({
  low_quantity_threshold: LowQuantitySchema,
});

export type ProductCategoryInput = v.InferInput<typeof ProductCategoryDto>;
export type ProductCategoryOutput = v.InferOutput<typeof ProductCategoryDto>;
export type MeasurementUnitInput = v.InferInput<typeof MeasurementUnitDto>;
export type MeasurementUnitOutput = v.InferOutput<typeof MeasurementUnitDto>;
export type LowQuantityInput = v.InferInput<typeof LowQuantityDto>;

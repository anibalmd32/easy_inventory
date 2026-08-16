import * as v from "valibot";
import { CatalogNameSchema } from "../schemas/CatalogSchemas";
import { ExchangeRateSchema } from "../schemas/PosSchemas";

export const PaymentMethodDto = v.object({
  name: CatalogNameSchema,
});

export const ExchangeRateDto = v.object({
  rate: ExchangeRateSchema,
});

export type PaymentMethodInput = v.InferInput<typeof PaymentMethodDto>;
export type PaymentMethodOutput = v.InferOutput<typeof PaymentMethodDto>;
export type ExchangeRateInput = v.InferInput<typeof ExchangeRateDto>;
export type ExchangeRateOutput = v.InferOutput<typeof ExchangeRateDto>;

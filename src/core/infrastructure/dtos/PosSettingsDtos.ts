import * as v from "valibot";
import { CURRENCY } from "../../domain/enums/currencies";
import { CatalogNameSchema } from "../schemas/CatalogSchemas";
import {
  ExchangeRateSchema,
  InvoiceFooterSchema,
  InvoiceNumberSchema,
  InvoicePrefixSchema,
} from "../schemas/PosSchemas";

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

export const PrimaryCurrencyDto = v.object({
  primary_currency: v.enum(CURRENCY),
});

export const InvoiceSettingsDto = v.object({
  invoice_prefix: InvoicePrefixSchema,
  invoice_next_number: InvoiceNumberSchema,
  invoice_show_business_info: v.boolean(),
  invoice_footer_note: InvoiceFooterSchema,
});

export type PrimaryCurrencyInput = v.InferInput<typeof PrimaryCurrencyDto>;
export type InvoiceSettingsInput = v.InferInput<typeof InvoiceSettingsDto>;
export type InvoiceSettingsOutput = v.InferOutput<typeof InvoiceSettingsDto>;

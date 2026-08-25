import * as v from "valibot";
import { DAISY_THEMES } from "../../domain/helpers/daisyThemes";
import {
  AddressSchema,
  PhoneSchema,
  TaxIdSchema,
} from "../schemas/BusinessInfoSchemas";
import { CatalogNameSchema } from "../schemas/CatalogSchemas";

export const BusinessNameDto = v.object({
  name: CatalogNameSchema,
});

export const BusinessLogoDto = v.object({
  /** Data URL de la imagen; `null` quita el logo actual. */
  logo: v.union([
    v.null(),
    v.string(),
  ]),
});

export const BusinessThemeDto = v.object({
  theme: v.picklist(DAISY_THEMES),
});

export type BusinessNameInput = v.InferInput<typeof BusinessNameDto>;
export type BusinessNameOutput = v.InferOutput<typeof BusinessNameDto>;
export type BusinessLogoInput = v.InferInput<typeof BusinessLogoDto>;
export type BusinessLogoOutput = v.InferOutput<typeof BusinessLogoDto>;
export type BusinessThemeInput = v.InferInput<typeof BusinessThemeDto>;
export type BusinessThemeOutput = v.InferOutput<typeof BusinessThemeDto>;

/** Datos fiscales y de contacto que la factura puede imprimir. */
export const BusinessInfoDto = v.object({
  tax_id: TaxIdSchema,
  address: AddressSchema,
  phone: PhoneSchema,
});

export type BusinessInfoInput = v.InferInput<typeof BusinessInfoDto>;
export type BusinessInfoOutput = v.InferOutput<typeof BusinessInfoDto>;

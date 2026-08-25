import * as v from "valibot";
import { BUSINESS_VALIDATION_ERROR_MESSAGES } from "../../domain/enums/validationErrorMessages";

/**
 * Datos fiscales y de contacto. Todos son opcionales: un negocio pequeño
 * puede facturar sin RIF, y obligarle a rellenarlos solo estorbaría.
 */
export const TaxIdSchema = v.pipe(
  v.string(),
  v.trim(),
  v.maxLength(30, BUSINESS_VALIDATION_ERROR_MESSAGES.tax_id_too_long),
);

export const AddressSchema = v.pipe(
  v.string(),
  v.trim(),
  v.maxLength(200, BUSINESS_VALIDATION_ERROR_MESSAGES.address_too_long),
);

/**
 * Teléfono. No se valida el formato del país, solo que sean caracteres
 * plausibles: dígitos, espacios y los signos habituales.
 */
export const PhoneSchema = v.pipe(
  v.string(),
  v.trim(),
  v.maxLength(30, BUSINESS_VALIDATION_ERROR_MESSAGES.phone_too_long),
  v.regex(/^[0-9+()\-.\s]*$/, BUSINESS_VALIDATION_ERROR_MESSAGES.phone_invalid),
);

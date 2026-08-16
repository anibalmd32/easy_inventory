import * as v from "valibot";
import { CATALOG_VALIDATION_ERROR_MESSAGES } from "../../domain/enums/validationErrorMessages";

/** Nombre visible de una categoría o de una unidad de medida. */
export const CatalogNameSchema = v.pipe(
  v.string(CATALOG_VALIDATION_ERROR_MESSAGES.name_too_short),
  v.trim(),
  v.minLength(2, CATALOG_VALIDATION_ERROR_MESSAGES.name_too_short),
  v.maxLength(60, CATALOG_VALIDATION_ERROR_MESSAGES.name_too_long),
);

/** Abreviatura de una unidad: corta a propósito, se muestra junto a cifras. */
export const AbbreviationSchema = v.pipe(
  v.string(CATALOG_VALIDATION_ERROR_MESSAGES.abbreviation_too_short),
  v.trim(),
  v.minLength(1, CATALOG_VALIDATION_ERROR_MESSAGES.abbreviation_too_short),
  v.maxLength(8, CATALOG_VALIDATION_ERROR_MESSAGES.abbreviation_too_long),
);

/** Descripción opcional. La cadena vacía se normaliza a `null`. */
export const OptionalDescriptionSchema = v.pipe(
  v.string(),
  v.trim(),
  v.maxLength(200, CATALOG_VALIDATION_ERROR_MESSAGES.description_too_long),
  v.transform((value) => (value.length === 0 ? null : value)),
);

/**
 * Cantidad a partir de la cual avisar de que un producto se está acabando.
 * El `<input type="number">` entrega una cadena, así que se convierte aquí.
 */
export const LowQuantitySchema = v.pipe(
  v.string(CATALOG_VALIDATION_ERROR_MESSAGES.quantity_invalid),
  v.trim(),
  v.minLength(1, CATALOG_VALIDATION_ERROR_MESSAGES.quantity_invalid),
  v.transform(Number),
  v.number(CATALOG_VALIDATION_ERROR_MESSAGES.quantity_invalid),
  v.integer(CATALOG_VALIDATION_ERROR_MESSAGES.quantity_invalid),
  v.minValue(0, CATALOG_VALIDATION_ERROR_MESSAGES.quantity_invalid),
  v.maxValue(9999, CATALOG_VALIDATION_ERROR_MESSAGES.quantity_too_big),
);

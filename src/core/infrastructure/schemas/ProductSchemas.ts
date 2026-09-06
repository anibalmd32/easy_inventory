import * as v from "valibot";
import { PRODUCT_VALIDATION_ERROR_MESSAGES } from "../../domain/enums/validationErrorMessages";
import { MIME_TYPES } from "../../domain/helpers/mimeTypes";
import { toAmount } from "./toAmount";

/** Nombre del producto tal como lo canta el dueño: "Harina PAN 1 kg". */
export const ProductNameSchema = v.pipe(
  v.string(PRODUCT_VALIDATION_ERROR_MESSAGES.name_too_short),
  v.trim(),
  v.minLength(2, PRODUCT_VALIDATION_ERROR_MESSAGES.name_too_short),
  v.maxLength(80, PRODUCT_VALIDATION_ERROR_MESSAGES.name_too_long),
);

/**
 * Código de barras o código propio. Vacío se normaliza a `null` porque el
 * índice único de `sku` solo mira las filas que sí lo tienen: si se guardara
 * la cadena vacía, el segundo producto sin código chocaría con el primero.
 */
export const OptionalSkuSchema = v.pipe(
  v.string(),
  v.trim(),
  v.maxLength(40, PRODUCT_VALIDATION_ERROR_MESSAGES.sku_too_long),
  v.transform((value) => (value.length === 0 ? null : value)),
);

/**
 * Un importe en dólares. Admite vacío como 0: un producto puede registrarse
 * antes de saber a cuánto se va a vender.
 */
export const PriceSchema = v.pipe(
  v.string(PRODUCT_VALIDATION_ERROR_MESSAGES.price_invalid),
  v.trim(),
  v.transform((value) => (value.length === 0 ? 0 : toAmount(value))),
  v.number(PRODUCT_VALIDATION_ERROR_MESSAGES.price_invalid),
  v.minValue(0, PRODUCT_VALIDATION_ERROR_MESSAGES.price_invalid),
  v.maxValue(9999999, PRODUCT_VALIDATION_ERROR_MESSAGES.price_too_big),
);

/**
 * Existencia. Decimal a propósito: hay mercancía que se vende por kilos o por
 * litros y puede quedar 1,5.
 */
export const StockQuantitySchema = v.pipe(
  v.string(PRODUCT_VALIDATION_ERROR_MESSAGES.quantity_invalid),
  v.trim(),
  v.transform((value) => (value.length === 0 ? 0 : toAmount(value))),
  v.number(PRODUCT_VALIDATION_ERROR_MESSAGES.quantity_invalid),
  v.minValue(0, PRODUCT_VALIDATION_ERROR_MESSAGES.quantity_invalid),
  v.maxValue(9999999, PRODUCT_VALIDATION_ERROR_MESSAGES.quantity_too_big),
);

/**
 * Umbral propio de "queda poco". Vacío es `null` y significa "usa el aviso
 * general de la configuración de inventario".
 */
export const OptionalMinQuantitySchema = v.pipe(
  v.string(PRODUCT_VALIDATION_ERROR_MESSAGES.quantity_invalid),
  v.trim(),
  v.transform((value) => (value.length === 0 ? null : toAmount(value))),
  v.nullable(
    v.pipe(
      v.number(PRODUCT_VALIDATION_ERROR_MESSAGES.quantity_invalid),
      v.minValue(0, PRODUCT_VALIDATION_ERROR_MESSAGES.quantity_invalid),
      v.maxValue(9999999, PRODUCT_VALIDATION_ERROR_MESSAGES.quantity_too_big),
    ),
  ),
);

/**
 * Id que entrega un `<select>`: siempre una cadena. Vacío es `null` porque la
 * categoría es opcional.
 */
export const OptionalCategoryIdSchema = v.pipe(
  v.string(),
  v.trim(),
  v.transform((value) => (value.length === 0 ? null : Number(value))),
  v.nullable(v.pipe(v.number(), v.integer(), v.minValue(1))),
);

/** La unidad sí es obligatoria: sin ella la cantidad no significa nada. */
export const UnitIdSchema = v.pipe(
  v.string(PRODUCT_VALIDATION_ERROR_MESSAGES.unit_required),
  v.trim(),
  v.minLength(1, PRODUCT_VALIDATION_ERROR_MESSAGES.unit_required),
  v.transform(Number),
  v.number(PRODUCT_VALIDATION_ERROR_MESSAGES.unit_required),
  v.integer(PRODUCT_VALIDATION_ERROR_MESSAGES.unit_required),
  v.minValue(1, PRODUCT_VALIDATION_ERROR_MESSAGES.unit_required),
);

/** La foto ya convertida a data URL, o `null` si el producto no tiene. */
export const OptionalPhotoSchema = v.nullable(v.string());

/**
 * La foto entra como archivo antes de reducirse a data URL. El límite es
 * generoso porque lo que se guarda es la versión reducida, no el original.
 */
export const ProductPhotoFileSchema = v.pipe(
  v.file(),
  v.maxSize(1024 * 1024 * 10, PRODUCT_VALIDATION_ERROR_MESSAGES.photo_max_size),
  v.mimeType(
    [
      MIME_TYPES.JPEG,
      MIME_TYPES.PNG,
    ],
    PRODUCT_VALIDATION_ERROR_MESSAGES.photo_invalid_mime_type,
  ),
);

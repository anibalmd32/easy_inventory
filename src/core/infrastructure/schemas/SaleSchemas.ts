import * as v from "valibot";
import { SALE_VALIDATION_ERROR_MESSAGES } from "../../domain/enums/validationErrorMessages";
import { toAmount } from "./toAmount";

/**
 * Cantidad de una línea del carrito. Mayor que cero: quitar un producto se
 * hace con el botón de quitar, no poniéndole cantidad 0.
 *
 * Decimal a propósito, como en el inventario: hay mercancía por kilos y por
 * litros, y "1,5" tiene que poder escribirse con coma.
 */
export const CartQuantitySchema = v.pipe(
  v.string(SALE_VALIDATION_ERROR_MESSAGES.quantity_invalid),
  v.trim(),
  v.minLength(1, SALE_VALIDATION_ERROR_MESSAGES.quantity_invalid),
  v.transform(toAmount),
  v.number(SALE_VALIDATION_ERROR_MESSAGES.quantity_invalid),
  v.minValue(0.001, SALE_VALIDATION_ERROR_MESSAGES.quantity_invalid),
  v.maxValue(9999999, SALE_VALIDATION_ERROR_MESSAGES.quantity_too_big),
);

/**
 * Importe que entrega el cliente, en la moneda con la que está pagando. No es
 * el precio de nada: es dinero contante, así que mayor que cero.
 */
export const PaidAmountSchema = v.pipe(
  v.string(SALE_VALIDATION_ERROR_MESSAGES.amount_invalid),
  v.trim(),
  v.minLength(1, SALE_VALIDATION_ERROR_MESSAGES.amount_invalid),
  v.transform(toAmount),
  v.number(SALE_VALIDATION_ERROR_MESSAGES.amount_invalid),
  v.minValue(0.01, SALE_VALIDATION_ERROR_MESSAGES.amount_invalid),
  v.maxValue(999999999, SALE_VALIDATION_ERROR_MESSAGES.amount_too_big),
);

/** Referencia del pago móvil o de la transferencia. Vacía es `null`. */
export const OptionalReferenceSchema = v.pipe(
  v.string(),
  v.trim(),
  v.maxLength(40, SALE_VALIDATION_ERROR_MESSAGES.reference_too_long),
  v.transform((value) => (value.length === 0 ? null : value)),
);

/** Por qué se anuló la venta. Opcional: a veces no hay nada que explicar. */
export const OptionalVoidReasonSchema = v.pipe(
  v.string(),
  v.trim(),
  v.maxLength(160, SALE_VALIDATION_ERROR_MESSAGES.reason_too_long),
  v.transform((value) => (value.length === 0 ? null : value)),
);

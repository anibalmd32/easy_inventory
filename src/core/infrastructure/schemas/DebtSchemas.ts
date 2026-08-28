import * as v from "valibot";
import { DEBT_VALIDATION_ERROR_MESSAGES } from "../../domain/enums/validationErrorMessages";

/**
 * Días de plazo. 0 es válido y significa "el mismo día"; el techo de 365
 * evita plazos que en la práctica serían un regalo, no una venta a crédito.
 */
export const PaymentTermSchema = v.pipe(
  v.string(DEBT_VALIDATION_ERROR_MESSAGES.term_invalid),
  v.trim(),
  v.minLength(1, DEBT_VALIDATION_ERROR_MESSAGES.term_invalid),
  v.transform(Number),
  v.number(DEBT_VALIDATION_ERROR_MESSAGES.term_invalid),
  v.integer(DEBT_VALIDATION_ERROR_MESSAGES.term_invalid),
  v.minValue(0, DEBT_VALIDATION_ERROR_MESSAGES.term_invalid),
  v.maxValue(365, DEBT_VALIDATION_ERROR_MESSAGES.term_invalid),
);

/**
 * Límite de deuda por cliente, en dólares. Admite decimales y 0 significa
 * "sin límite". Se acepta coma como separador decimal porque es lo que
 * escribe un teclado en español.
 */
export const DebtLimitSchema = v.pipe(
  v.string(DEBT_VALIDATION_ERROR_MESSAGES.limit_invalid),
  v.trim(),
  v.minLength(1, DEBT_VALIDATION_ERROR_MESSAGES.limit_invalid),
  v.transform((value) => Number(value.replace(",", "."))),
  v.number(DEBT_VALIDATION_ERROR_MESSAGES.limit_invalid),
  v.minValue(0, DEBT_VALIDATION_ERROR_MESSAGES.limit_invalid),
  v.maxValue(9999999, DEBT_VALIDATION_ERROR_MESSAGES.limit_invalid),
);

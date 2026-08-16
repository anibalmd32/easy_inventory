import * as v from "valibot";
import { POS_VALIDATION_ERROR_MESSAGES } from "../../domain/enums/validationErrorMessages";

/**
 * Bolívares por dólar. El `<input type="number">` entrega una cadena, así
 * que se convierte aquí, igual que el umbral de inventario. Acepta
 * decimales: la tasa real nunca es entera.
 */
export const ExchangeRateSchema = v.pipe(
  v.string(POS_VALIDATION_ERROR_MESSAGES.rate_invalid),
  v.trim(),
  v.minLength(1, POS_VALIDATION_ERROR_MESSAGES.rate_invalid),
  v.transform(Number),
  v.number(POS_VALIDATION_ERROR_MESSAGES.rate_invalid),
  v.minValue(0.000001, POS_VALIDATION_ERROR_MESSAGES.rate_invalid),
  v.maxValue(999999999, POS_VALIDATION_ERROR_MESSAGES.rate_invalid),
);

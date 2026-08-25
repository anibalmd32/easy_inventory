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

/** Prefijo del número de factura. Vacío es válido: significa sin prefijo. */
export const InvoicePrefixSchema = v.pipe(
  v.string(),
  v.trim(),
  v.maxLength(10, POS_VALIDATION_ERROR_MESSAGES.prefix_too_long),
);

/** Próximo número a emitir. Entero de 1 en adelante. */
export const InvoiceNumberSchema = v.pipe(
  v.string(POS_VALIDATION_ERROR_MESSAGES.invoice_number_invalid),
  v.trim(),
  v.minLength(1, POS_VALIDATION_ERROR_MESSAGES.invoice_number_invalid),
  v.transform(Number),
  v.number(POS_VALIDATION_ERROR_MESSAGES.invoice_number_invalid),
  v.integer(POS_VALIDATION_ERROR_MESSAGES.invoice_number_invalid),
  v.minValue(1, POS_VALIDATION_ERROR_MESSAGES.invoice_number_invalid),
  v.maxValue(99999999, POS_VALIDATION_ERROR_MESSAGES.invoice_number_invalid),
);

/** Nota al pie de la factura. Vacía = no se imprime nada. */
export const InvoiceFooterSchema = v.pipe(
  v.string(),
  v.trim(),
  v.maxLength(160, POS_VALIDATION_ERROR_MESSAGES.footer_too_long),
);

import * as v from "valibot";
import { CUSTOMER_VALIDATION_ERROR_MESSAGES } from "../../domain/enums/validationErrorMessages";

/** Nombre del cliente. Es lo único obligatorio: por algo hay que llamarle. */
export const CustomerNameSchema = v.pipe(
  v.string(CUSTOMER_VALIDATION_ERROR_MESSAGES.name_too_short),
  v.trim(),
  v.minLength(2, CUSTOMER_VALIDATION_ERROR_MESSAGES.name_too_short),
  v.maxLength(80, CUSTOMER_VALIDATION_ERROR_MESSAGES.name_too_long),
);

/**
 * Cédula o RIF. Vacío se normaliza a `null` porque el índice único de
 * `customer.document` solo mira las filas que sí lo tienen: si se guardara la
 * cadena vacía, el segundo cliente sin documento chocaría con el primero.
 */
export const OptionalDocumentSchema = v.pipe(
  v.string(),
  v.trim(),
  v.maxLength(30, CUSTOMER_VALIDATION_ERROR_MESSAGES.document_too_long),
  v.transform((value) => (value.length === 0 ? null : value)),
);

/** Teléfono. Mismo criterio que el del negocio: caracteres plausibles. */
export const OptionalCustomerPhoneSchema = v.pipe(
  v.string(),
  v.trim(),
  v.maxLength(30, CUSTOMER_VALIDATION_ERROR_MESSAGES.phone_too_long),
  v.regex(/^[0-9+()\-.\s]*$/, CUSTOMER_VALIDATION_ERROR_MESSAGES.phone_invalid),
  v.transform((value) => (value.length === 0 ? null : value)),
);

/** Nota libre del dueño sobre el cliente. */
export const OptionalCustomerNotesSchema = v.pipe(
  v.string(),
  v.trim(),
  v.maxLength(200, CUSTOMER_VALIDATION_ERROR_MESSAGES.notes_too_long),
  v.transform((value) => (value.length === 0 ? null : value)),
);

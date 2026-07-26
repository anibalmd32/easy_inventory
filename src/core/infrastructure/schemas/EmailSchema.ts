import * as v from "valibot";
import { EMAIL_VALIDATION_ERROR_MESSAGES } from "../../domain/enums/validationErrorMessages";

export const EmailSchema = v.pipe(
  v.string(),
  v.trim(),
  // Se normaliza a minúsculas antes de validar: SQLite compara TEXT de forma
  // sensible a mayúsculas y en móvil es fácil que el teclado capitalice la
  // primera letra. Sin esto, "Admin@x.com" y "admin@x.com" serían cuentas
  // distintas y el login fallaría sin motivo aparente.
  v.toLowerCase(),
  v.email(EMAIL_VALIDATION_ERROR_MESSAGES.invalid),
);

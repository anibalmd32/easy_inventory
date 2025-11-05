import * as v from "valibot";
import { EMAIL_VALIDATION_ERROR_MESSAGES } from "../../domain/enums/validationErrorMessages";

export const EmailSchema = v.pipe(
  v.string(),
  v.trim(),
  v.email(EMAIL_VALIDATION_ERROR_MESSAGES.invalid),
);

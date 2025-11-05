import * as v from "valibot";
import { GENERIC_VALIDATION_ERROR_MESSAGES } from "../../domain/enums/validationErrorMessages";

export const NameSchema = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(2, GENERIC_VALIDATION_ERROR_MESSAGES.too_short),
  v.maxLength(100, GENERIC_VALIDATION_ERROR_MESSAGES.too_long),
);

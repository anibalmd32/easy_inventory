import * as v from "valibot";
import {
  maxRepeating,
  minLowercase,
  minNumbers,
  minSymbols,
  minUppercase,
} from "valipass";
import { PASSWORD_VALIDATION_ERROR_MESSAGES } from "../../domain/enums/validationErrorMessages";

export const PasswordSchema = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(4, PASSWORD_VALIDATION_ERROR_MESSAGES.min_length),
  minLowercase(2, PASSWORD_VALIDATION_ERROR_MESSAGES.min_lowercase),
  minUppercase(1, PASSWORD_VALIDATION_ERROR_MESSAGES.min_uppercase),
  minNumbers(2, PASSWORD_VALIDATION_ERROR_MESSAGES.min_numbers),
  minSymbols(1, PASSWORD_VALIDATION_ERROR_MESSAGES.min_symbols),
  maxRepeating(3, PASSWORD_VALIDATION_ERROR_MESSAGES.max_repeating),
);

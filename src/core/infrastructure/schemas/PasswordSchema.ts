import * as v from "valibot";
import {
  maxRepeating,
  minLowercase,
  minNumbers,
  minSymbols,
  minUppercase,
} from "valipass";

export const PasswordSchema = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(4, "Password must be at least 4 characters long"),
  v.maxLength(10, "Password must be at most 8 characters long"),
  minLowercase(2, "Password must contain at least 2 lowercase letters"),
  minUppercase(1, "Password must contain at least 1 uppercase letter"),
  minNumbers(2, "Password must contain at least 2 numbers"),
  minSymbols(1, "Password must contain at least 1 special character"),
  maxRepeating(3, "Password must not contain more than 2 repeating characters"),
);

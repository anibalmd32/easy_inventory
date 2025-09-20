import * as v from "valibot";
import { password } from "valipass";

export const PasswordSchema = v.pipe(
  v.string(),
  v.trim(),
  password({
    lowercase: 2,
    uppercase: 1,
    numbers: 2,
    symbols: 1,
    max: 8,
    min: 4,
  }),
);

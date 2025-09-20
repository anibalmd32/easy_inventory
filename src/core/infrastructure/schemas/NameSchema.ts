import * as v from "valibot";

export const NameSchema = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(2),
  v.maxLength(100),
);

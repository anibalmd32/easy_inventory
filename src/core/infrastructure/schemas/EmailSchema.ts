import * as v from "valibot";

export const EmailSchema = v.pipe(
  v.string(),
  v.trim(),
  v.email("Invalid email address"),
);

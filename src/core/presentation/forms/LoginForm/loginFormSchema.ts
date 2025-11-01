import * as v from "valibot";
import { EmailSchema } from "../../../infrastructure/schemas/EmailSchema";
import { PasswordSchema } from "../../../infrastructure/schemas/PasswordSchema";

export const loginFormSchema = v.object({
  email: EmailSchema,
  password: PasswordSchema,
});

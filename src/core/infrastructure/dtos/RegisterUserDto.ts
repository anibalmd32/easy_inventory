import * as v from "valibot";
import { EmailSchema } from "../schemas/EmailSchema";
import { NameSchema } from "../schemas/NameSchema";
import { PasswordSchema } from "../schemas/PasswordSchema";

export const RegisterUserDto = v.pipe(
  v.object({
    name: NameSchema,
    last_name: NameSchema,
    email: EmailSchema,
    password: PasswordSchema,
    confirm_password: PasswordSchema,
  }),
  v.check((input) => {
    return input.password === input.confirm_password;
  }, "Las contraseñas no coinciden"),
);

export type RegisterUserInput = v.InferInput<typeof RegisterUserDto>;

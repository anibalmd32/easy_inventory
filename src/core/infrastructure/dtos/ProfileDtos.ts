import * as v from "valibot";
import { PASSWORD_VALIDATION_ERROR_MESSAGES } from "../../domain/enums/validationErrorMessages";
import { EmailSchema } from "../schemas/EmailSchema";
import { NameSchema } from "../schemas/NameSchema";
import { PasswordSchema } from "../schemas/PasswordSchema";

export const UpdateProfileDto = v.object({
  name: NameSchema,
  last_name: NameSchema,
});

export const UpdateEmailDto = v.object({
  email: EmailSchema,
});

export const ChangePasswordDto = v.pipe(
  v.object({
    /**
     * Se pide la actual aunque las contraseñas estén en texto plano: evita
     * que quien coja el móvil desbloqueado se apropie de la cuenta cambiando
     * la clave en dos toques.
     */
    current_password: v.pipe(
      v.string(),
      v.minLength(1, PASSWORD_VALIDATION_ERROR_MESSAGES.min_length),
    ),
    password: PasswordSchema,
    confirm_password: v.string(),
  }),
  v.forward(
    v.check(
      (input) => input.password === input.confirm_password,
      PASSWORD_VALIDATION_ERROR_MESSAGES.confirm_mismatch,
    ),
    [
      "confirm_password",
    ],
  ),
);

export type UpdateProfileInput = v.InferInput<typeof UpdateProfileDto>;
export type UpdateEmailInput = v.InferInput<typeof UpdateEmailDto>;
export type ChangePasswordInput = v.InferInput<typeof ChangePasswordDto>;

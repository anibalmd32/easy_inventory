import * as v from "valibot";
import { GENERIC_VALIDATION_ERROR_MESSAGES } from "../../domain/enums/validationErrorMessages";
import { EmailSchema } from "../schemas/EmailSchema";

export const LoginDto = v.object({
  email: EmailSchema,
  /**
   * A propósito no se usa `PasswordSchema` aquí: al iniciar sesión no se
   * exige política de contraseña, solo que el campo venga. Validarla con
   * las reglas de creación dejaría fuera a cualquier usuario cuya clave se
   * haya guardado bajo reglas distintas.
   */
  password: v.pipe(
    v.string(GENERIC_VALIDATION_ERROR_MESSAGES.required_field),
    v.minLength(1, GENERIC_VALIDATION_ERROR_MESSAGES.required_field),
  ),
  remember: v.boolean(),
});

export type LoginInput = v.InferInput<typeof LoginDto>;

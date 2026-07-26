import * as v from "valibot";
import { PASSWORD_VALIDATION_ERROR_MESSAGES } from "../../domain/enums/validationErrorMessages";
import { EmailSchema } from "../schemas/EmailSchema";
import { PasswordSchema } from "../schemas/PasswordSchema";
import { SecurityAnswerSchema } from "../schemas/SecurityAnswerSchema";

/** Paso 1: identificar la cuenta y traer su pregunta de seguridad. */
export const RecoveryEmailDto = v.object({
  email: EmailSchema,
});

/** Paso 2: responder la pregunta. */
export const RecoveryAnswerDto = v.object({
  answer: SecurityAnswerSchema,
});

/** Paso 3: definir la contraseña nueva. */
export const ResetPasswordDto = v.pipe(
  v.object({
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

export type RecoveryEmailInput = v.InferInput<typeof RecoveryEmailDto>;
export type RecoveryAnswerInput = v.InferInput<typeof RecoveryAnswerDto>;
export type ResetPasswordInput = v.InferInput<typeof ResetPasswordDto>;
export type ResetPasswordOutput = v.InferOutput<typeof ResetPasswordDto>;

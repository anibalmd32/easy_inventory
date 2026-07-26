import * as v from "valibot";
import { PASSWORD_VALIDATION_ERROR_MESSAGES } from "../../domain/enums/validationErrorMessages";
import { EmailSchema } from "../schemas/EmailSchema";
import { NameSchema } from "../schemas/NameSchema";
import { PasswordSchema } from "../schemas/PasswordSchema";
import {
  SecurityAnswerSchema,
  SecurityQuestionIdSchema,
} from "../schemas/SecurityAnswerSchema";

export const SetupSuperAdminDto = v.pipe(
  v.object({
    name: NameSchema,
    last_name: NameSchema,
    email: EmailSchema,
    password: PasswordSchema,
    confirm_password: v.string(),
    security_question_id: SecurityQuestionIdSchema,
    security_answer: SecurityAnswerSchema,
  }),
  // `forward` cuelga el error del campo de confirmación en vez de dejarlo
  // suelto a nivel del formulario, que es donde el usuario lo espera ver.
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

export type SetupSuperAdminInput = v.InferInput<typeof SetupSuperAdminDto>;
export type SetupSuperAdminOutput = v.InferOutput<typeof SetupSuperAdminDto>;

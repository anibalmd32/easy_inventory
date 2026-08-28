import * as v from "valibot";
import { ROLES } from "../../domain/enums/roles";
import { EmailSchema } from "../schemas/EmailSchema";
import { NameSchema } from "../schemas/NameSchema";
import { PasswordSchema } from "../schemas/PasswordSchema";
import {
  SecurityAnswerSchema,
  SecurityQuestionIdSchema,
} from "../schemas/SecurityAnswerSchema";

/**
 * Roles que el dueño puede asignar a su equipo. `superadmin` queda fuera a
 * propósito: solo puede existir uno y lo crea la pantalla de setup.
 */
export const ASSIGNABLE_ROLES = [
  ROLES.ADMIN,
  ROLES.ACCOUNTANT,
  ROLES.SELLER,
] as const;

export const CreateTeamUserDto = v.object({
  name: NameSchema,
  last_name: NameSchema,
  email: EmailSchema,
  password: PasswordSchema,
  role: v.picklist(ASSIGNABLE_ROLES),
  // La respuesta de seguridad es obligatoria: `user_security_answer` la exige
  // y sin ella esa persona no podría recuperar su contraseña.
  security_question_id: SecurityQuestionIdSchema,
  security_answer: SecurityAnswerSchema,
});

export const ChangeRoleDto = v.object({
  role: v.picklist(ASSIGNABLE_ROLES),
});

export type CreateTeamUserInput = v.InferInput<typeof CreateTeamUserDto>;
export type ChangeRoleInput = v.InferInput<typeof ChangeRoleDto>;

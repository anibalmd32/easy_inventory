import { dtoValidator } from "../../../../libs/dtoValidator";
import { AUTH_ERROR_MESSAGES } from "../../../domain/enums/authErrorMessages";
import { AuthError } from "../../../domain/errors/AuthError";
import {
  RecoveryAnswerDto,
  type RecoveryAnswerInput,
  RecoveryEmailDto,
  type RecoveryEmailInput,
  ResetPasswordDto,
  type ResetPasswordInput,
  type ResetPasswordOutput,
} from "../../dtos/PasswordRecoveryDtos";
import type {
  RecoveryQuestionRecord,
  UserRepository,
} from "../../repositories/UserRepository";
import type { ErrorHandlerService } from "../sharedServices/ErrorHandlerService";

/**
 * Recuperación de contraseña por pregunta de seguridad, en tres pasos.
 *
 * La respuesta se vuelve a verificar en `resetPassword`, no solo en
 * `verifyAnswer`. Así el último paso no depende de que la UI haya respetado
 * el orden de los pasos, y no hace falta inventar un token intermedio.
 */
export class PasswordRecoveryService {
  constructor(
    private errorService: ErrorHandlerService<ResetPasswordOutput>,
    private repository: UserRepository,
  ) {}

  /**
   * Paso 1. Devuelve la pregunta que eligió el dueño de la cuenta, junto con
   * el email ya normalizado por el esquema.
   */
  async findQuestion(data: RecoveryEmailInput): Promise<
    RecoveryQuestionRecord & {
      email: string;
    }
  > {
    const { validData } = dtoValidator(RecoveryEmailDto, data);

    if (!validData) {
      throw new AuthError(AUTH_ERROR_MESSAGES.invalid_form);
    }

    const record = await this.repository.findRecoveryQuestionByEmail(
      validData.email,
    );

    if (!record) {
      // Se distingue de "no tiene pregunta" a propósito: es una app local,
      // el dueño necesita saber si se equivocó de correo.
      const exists = await this.repository.existsEmail(validData.email);

      throw new AuthError(
        exists
          ? AUTH_ERROR_MESSAGES.no_security_question
          : AUTH_ERROR_MESSAGES.email_not_found,
      );
    }

    return {
      ...record,
      email: validData.email,
    };
  }

  /** Paso 2. Falla con `wrong_security_answer` si no coincide. */
  async verifyAnswer(userId: number, data: RecoveryAnswerInput): Promise<void> {
    const { validData } = dtoValidator(RecoveryAnswerDto, data);

    if (!validData) {
      throw new AuthError(AUTH_ERROR_MESSAGES.wrong_security_answer);
    }

    const matches = await this.repository.matchesSecurityAnswer(
      userId,
      validData.answer,
    );

    if (!matches) {
      throw new AuthError(AUTH_ERROR_MESSAGES.wrong_security_answer);
    }
  }

  /** Paso 3. Revalida la respuesta y sobrescribe la contraseña. */
  async resetPassword(
    userId: number,
    answer: string,
    data: ResetPasswordInput,
  ): Promise<void> {
    const { validData, error } = dtoValidator(ResetPasswordDto, data);

    if (error) {
      this.errorService.handleValiError(error);
    }

    if (!validData) {
      throw new AuthError(AUTH_ERROR_MESSAGES.invalid_form);
    }

    await this.verifyAnswer(userId, {
      answer,
    });

    await this.repository.updatePassword(userId, validData.password);
  }
}

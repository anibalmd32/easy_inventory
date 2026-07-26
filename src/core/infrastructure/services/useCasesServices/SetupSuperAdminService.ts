import { dtoValidator } from "../../../../libs/dtoValidator";
import type { AuthUserData } from "../../../domain/data/AuthUserData";
import { AUTH_ERROR_MESSAGES } from "../../../domain/enums/authErrorMessages";
import { AuthError } from "../../../domain/errors/AuthError";
import {
  SetupSuperAdminDto,
  type SetupSuperAdminInput,
  type SetupSuperAdminOutput,
} from "../../dtos/SetupSuperAdminDto";
import type { UserRepository } from "../../repositories/UserRepository";
import type { ErrorHandlerService } from "../sharedServices/ErrorHandlerService";

/**
 * Crea el superadmin en el primer arranque de la app. Solo puede existir
 * uno: si ya hay superadmin este caso de uso falla y el usuario debe entrar
 * por el login normal.
 */
export class SetupSuperAdminService {
  constructor(
    // El handler se tipa contra el *output* del DTO: es la forma que
    // devuelve `dtoValidator` tras aplicar las transformaciones.
    private errorService: ErrorHandlerService<SetupSuperAdminOutput>,
    private repository: UserRepository,
  ) {}

  /**
   * @param language Idioma activo en la interfaz al momento del alta, para
   * que la cuenta nazca con el que el usuario ya eligió en pantalla.
   */
  async execute(
    data: SetupSuperAdminInput,
    language?: string,
  ): Promise<AuthUserData> {
    const { validData, error } = dtoValidator(SetupSuperAdminDto, data);

    if (error) {
      this.errorService.handleValiError(error);
    }

    if (!validData) {
      throw new AuthError(AUTH_ERROR_MESSAGES.invalid_form);
    }

    if (await this.repository.existsSuperAdmin()) {
      throw new AuthError(AUTH_ERROR_MESSAGES.superadmin_already_exists);
    }

    if (await this.repository.existsEmail(validData.email)) {
      throw new AuthError(AUTH_ERROR_MESSAGES.email_already_taken);
    }

    return this.repository.storeSuperAdmin({
      name: validData.name,
      last_name: validData.last_name,
      email: validData.email,
      password: validData.password,
      security_question_id: validData.security_question_id,
      security_answer: validData.security_answer,
      language,
    });
  }
}

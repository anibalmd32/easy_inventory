import { dtoValidator } from "../../../../libs/dtoValidator";
import type { AuthUserData } from "../../../domain/data/AuthUserData";
import { AUTH_ERROR_MESSAGES } from "../../../domain/enums/authErrorMessages";
import { AuthError } from "../../../domain/errors/AuthError";
import { LoginDto, type LoginInput } from "../../dtos/LoginDto";
import type { UserRepository } from "../../repositories/UserRepository";

export class LoginService {
  constructor(private repository: UserRepository) {}

  async execute(data: LoginInput): Promise<AuthUserData> {
    const { validData } = dtoValidator(LoginDto, data);

    // Email mal formado o contraseña vacía se reportan igual que unas
    // credenciales que no existen: no hay razón para dar más pistas.
    if (!validData) {
      throw new AuthError(AUTH_ERROR_MESSAGES.invalid_credentials);
    }

    const record = await this.repository.findAuthUserByEmail(validData.email);

    if (!record || record.password !== validData.password) {
      throw new AuthError(AUTH_ERROR_MESSAGES.invalid_credentials);
    }

    return record.user;
  }
}

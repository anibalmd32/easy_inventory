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

  /**
   * Inicia sesión tras una verificación biométrica correcta.
   *
   * No recibe contraseña porque la huella ya identificó al dueño del
   * dispositivo. Se vuelve a comprobar la preferencia contra la base de datos
   * y no contra el estado local: si la cuenta desactivó la biometría, este
   * camino queda cerrado aunque el cliente crea lo contrario.
   */
  async executeWithBiometrics(email: string): Promise<AuthUserData> {
    const record = await this.repository.findAuthUserByEmail(email);

    if (!record?.user.settings.biometric_enabled) {
      throw new AuthError(AUTH_ERROR_MESSAGES.biometric_not_enabled);
    }

    return record.user;
  }
}

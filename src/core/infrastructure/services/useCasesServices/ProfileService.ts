import { dtoValidator } from "../../../../libs/dtoValidator";
import { PROFILE_ERROR_MESSAGES } from "../../../domain/enums/profileErrorMessages";
import { ProfileError } from "../../../domain/errors/ProfileError";
import {
  ChangePasswordDto,
  type ChangePasswordInput,
  UpdateEmailDto,
  type UpdateEmailInput,
  UpdateProfileDto,
  type UpdateProfileInput,
} from "../../dtos/ProfileDtos";
import type { UserRepository } from "../../repositories/UserRepository";

/**
 * Edición de la propia cuenta: datos personales, correo de acceso, contraseña
 * y foto.
 *
 * Es distinto de `TeamService`: allí el dueño gestiona a otros, aquí cada
 * quien se gestiona a sí mismo, así que no hay comprobaciones de rol.
 */
export class ProfileService {
  constructor(private users: UserRepository) {}

  /**
   * @param avatarUrl `undefined` deja la foto como está, `null` la quita.
   * Devuelve los datos ya normalizados para que la sesión los refleje sin
   * tener que volver a leer de la base de datos.
   */
  async updateProfile(
    userId: number,
    data: UpdateProfileInput,
    avatarUrl?: string | null,
  ): Promise<{
    name: string;
    last_name: string;
  }> {
    const { validData } = dtoValidator(UpdateProfileDto, data);

    if (!validData) {
      throw new ProfileError(PROFILE_ERROR_MESSAGES.invalid_form);
    }

    await this.users.updateProfileDetails(userId, {
      name: validData.name,
      last_name: validData.last_name,
      avatar_url: avatarUrl,
    });

    return validData;
  }

  async updateEmail(
    userId: number,
    data: UpdateEmailInput,
  ): Promise<{
    email: string;
  }> {
    const { validData } = dtoValidator(UpdateEmailDto, data);

    if (!validData) {
      throw new ProfileError(PROFILE_ERROR_MESSAGES.invalid_form);
    }

    await this.users.updateEmail(userId, validData.email);

    return validData;
  }

  async changePassword(
    userId: number,
    data: ChangePasswordInput,
  ): Promise<void> {
    const { validData } = dtoValidator(ChangePasswordDto, data);

    if (!validData) {
      throw new ProfileError(PROFILE_ERROR_MESSAGES.invalid_form);
    }

    const current = await this.users.findPasswordByUserId(userId);

    if (current === null) {
      throw new ProfileError(PROFILE_ERROR_MESSAGES.not_found);
    }

    if (current !== validData.current_password) {
      throw new ProfileError(PROFILE_ERROR_MESSAGES.current_password_wrong);
    }

    await this.users.updatePassword(userId, validData.password);
  }
}

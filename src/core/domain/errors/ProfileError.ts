import type { PROFILE_ERROR_MESSAGES } from "../enums/profileErrorMessages";
import { AppError } from "./AppError";

/** Error al editar el propio perfil. */
export class ProfileError extends AppError {
  constructor(messageKey: PROFILE_ERROR_MESSAGES) {
    super(messageKey);
    this.name = "ProfileError";
  }
}

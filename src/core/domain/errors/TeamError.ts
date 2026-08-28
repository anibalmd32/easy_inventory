import type { TEAM_ERROR_MESSAGES } from "../enums/teamErrorMessages";
import { AppError } from "./AppError";

/** Error al gestionar los usuarios del equipo. */
export class TeamError extends AppError {
  constructor(messageKey: TEAM_ERROR_MESSAGES) {
    super(messageKey);
    this.name = "TeamError";
  }
}

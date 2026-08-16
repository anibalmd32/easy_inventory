import type { AUTH_ERROR_MESSAGES } from "../enums/authErrorMessages";
import { AppError } from "./AppError";

/** Error de autenticación. Ver [AppError] para el contrato con la UI. */
export class AuthError extends AppError {
  constructor(messageKey: AUTH_ERROR_MESSAGES) {
    super(messageKey);
    this.name = "AuthError";
  }
}

export const isAuthError = (error: unknown): error is AuthError =>
  error instanceof AuthError;

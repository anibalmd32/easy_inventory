import type { AUTH_ERROR_MESSAGES } from "../enums/authErrorMessages";

/**
 * Error de autenticación pensado para llegar hasta la UI: en vez de un
 * texto suelto lleva la clave i18n que la vista debe traducir.
 */
export class AuthError extends Error {
  readonly messageKey: AUTH_ERROR_MESSAGES;

  constructor(messageKey: AUTH_ERROR_MESSAGES) {
    super(messageKey);
    this.name = "AuthError";
    this.messageKey = messageKey;
  }
}

export const isAuthError = (error: unknown): error is AuthError =>
  error instanceof AuthError;

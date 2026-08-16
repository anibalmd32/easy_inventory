/**
 * Error de dominio pensado para llegar hasta la UI: en vez de un texto suelto
 * lleva la clave i18n que la vista debe traducir.
 */
export class AppError extends Error {
  readonly messageKey: string;

  constructor(messageKey: string) {
    super(messageKey);
    this.name = "AppError";
    this.messageKey = messageKey;
  }
}

export const isAppError = (error: unknown): error is AppError =>
  error instanceof AppError;

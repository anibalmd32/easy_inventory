import { useTranslation } from "react-i18next";
import { AUTH_ERROR_MESSAGES } from "../../domain/enums/authErrorMessages";
import { isAppError } from "../../domain/errors/AppError";

/**
 * Traduce el error de una mutación. Cualquier cosa que no sea un `AppError`
 * cae en el mensaje genérico: no queremos que un fallo de SQLite se muestre
 * crudo en pantalla.
 */
export const useErrorMessage = () => {
  const { t } = useTranslation();

  return (error: unknown): string | null => {
    if (!error) {
      return null;
    }

    if (isAppError(error)) {
      return t(error.messageKey);
    }

    console.error(error);
    return t(AUTH_ERROR_MESSAGES.unexpected);
  };
};

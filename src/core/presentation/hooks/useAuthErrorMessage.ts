import { useTranslation } from "react-i18next";
import { AUTH_ERROR_MESSAGES } from "../../domain/enums/authErrorMessages";
import { isAuthError } from "../../domain/errors/AuthError";

/**
 * Traduce el error de una mutación de autenticación. Cualquier cosa que no
 * sea un `AuthError` cae en el mensaje genérico: no queremos que un fallo de
 * SQLite se muestre crudo en pantalla.
 */
export const useAuthErrorMessage = () => {
  const { t } = useTranslation();

  return (error: unknown): string | null => {
    if (!error) {
      return null;
    }

    if (isAuthError(error)) {
      return t(error.messageKey);
    }

    console.error(error);
    return t(AUTH_ERROR_MESSAGES.unexpected);
  };
};

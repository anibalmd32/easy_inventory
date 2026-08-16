import { useErrorMessage } from "./useErrorMessage";

/**
 * Alias histórico de [useErrorMessage]. Se mantiene para no tocar las
 * pantallas de autenticación, que ya funcionan; `AuthError` extiende
 * `AppError`, así que el comportamiento es idéntico.
 */
export const useAuthErrorMessage = () => useErrorMessage();

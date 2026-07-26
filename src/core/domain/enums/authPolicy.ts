/**
 * Intentos de inicio de sesión fallidos tras los cuales el login ofrece
 * recuperar la contraseña por pregunta de seguridad.
 */
export const FAILED_LOGINS_BEFORE_RECOVERY = 3;

/**
 * Respuestas de seguridad erróneas admitidas en la pantalla de recuperación
 * antes de cortar el intento.
 *
 * Es un freno, no un bloqueo real: al no haber servidor, reiniciar la app
 * reinicia el contador. Sirve para frenar a alguien tanteando el dispositivo,
 * no para resistir un ataque decidido.
 */
export const MAX_SECURITY_ANSWER_ATTEMPTS = 5;

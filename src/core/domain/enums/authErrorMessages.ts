/**
 * Claves i18n del namespace por defecto (`translation`) que se muestran
 * al usuario cuando falla una operación de autenticación.
 */
export enum AUTH_ERROR_MESSAGES {
  invalid_credentials = "errors.auth.invalid_credentials",
  superadmin_already_exists = "errors.auth.superadmin_already_exists",
  email_already_taken = "errors.auth.email_already_taken",
  role_not_found = "errors.auth.role_not_found",
  security_question_not_found = "errors.auth.security_question_not_found",
  user_without_role = "errors.auth.user_without_role",
  invalid_form = "errors.auth.invalid_form",
  unexpected = "errors.auth.unexpected",
  email_not_found = "errors.auth.email_not_found",
  no_security_question = "errors.auth.no_security_question",
  wrong_security_answer = "errors.auth.wrong_security_answer",
  biometric_not_enabled = "errors.auth.biometric_not_enabled",
  biometric_failed = "errors.auth.biometric_failed",
}

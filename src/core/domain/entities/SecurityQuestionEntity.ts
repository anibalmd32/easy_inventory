export type SecurityQuestionEntity = {
  /**
   * Slug estable de la pregunta. El texto visible se resuelve con i18n
   * bajo la clave `securityQuestions.<question_key>`.
   */
  question_key: string;
};

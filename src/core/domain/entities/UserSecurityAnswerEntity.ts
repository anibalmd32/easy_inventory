export type UserSecurityAnswerEntity = {
  user_id: number;
  security_question_id: number;
  /** Guardada normalizada, ver `normalizeSecurityAnswer`. */
  answer: string;
};

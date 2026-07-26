import type { SecurityQuestionEntity } from "../entities/SecurityQuestionEntity";

export type SecurityQuestionData = SecurityQuestionEntity & {
  id: number;
};

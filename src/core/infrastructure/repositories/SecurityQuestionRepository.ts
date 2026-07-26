import { db } from "../../../db";
import type { SecurityQuestionData } from "../../domain/data/SecurityQuestionData";

export class SecurityQuestionRepository {
  async findAll(): Promise<SecurityQuestionData[]> {
    return db
      .selectFrom("security_question")
      .select([
        "id",
        "question_key",
      ])
      .where("deleted_at", "is", null)
      .orderBy("id", "asc")
      .execute();
  }
}

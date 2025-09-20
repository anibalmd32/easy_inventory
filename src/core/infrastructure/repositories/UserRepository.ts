import { db } from "../db/db";
import { queryBuilder } from "../db/queryBuilder";
import type { RegisterUserInput } from "../dtos/RegisterUserDto";

export class UserRepository {
  async storeUser(
    data: Omit<RegisterUserInput, "confirm_password">,
  ): Promise<void> {
    const userProfileQuery = queryBuilder
      .insertInto("user_profile")
      .values({
        name: data.name,
        last_name: data.last_name,
        avatar_url: undefined,
      })
      .compile();

    const userCredentialQuery = queryBuilder
      .insertInto("user_credential")
      .values({
        email: data.email,
        password: data.password,
      })
      .compile();

    await db.execute(
      userProfileQuery.sql,
      Array.from(userProfileQuery.parameters),
    );
    await db.execute(
      userCredentialQuery.sql,
      Array.from(userCredentialQuery.parameters),
    );
  }
}

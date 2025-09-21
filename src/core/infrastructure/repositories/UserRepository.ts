import { DEFAULT_USER_SETTINGS } from "../../domain/enums/defaultValues";
import { db } from "../db/db";
import type { RegisterUserInput } from "../dtos/RegisterUserDto";

export class UserRepository {
  async storeUser(
    data: Omit<RegisterUserInput, "confirm_password">,
  ): Promise<void> {
    const trx = await db.startTransaction().execute();

    try {
      const newUserProfile = await trx
        .insertInto("user_profile")
        .values({
          name: data.name,
          last_name: data.last_name,
          avatar_url: undefined,
        })
        .executeTakeFirstOrThrow();

      const newUserCredential = await trx
        .insertInto("user_credential")
        .values({
          email: data.email,
          password: data.password,
        })
        .executeTakeFirstOrThrow();

      const newUserSettings = await trx
        .insertInto("user_settings")
        .values({
          theme: DEFAULT_USER_SETTINGS.THEME,
          language: DEFAULT_USER_SETTINGS.LANGUAGE,
        })
        .executeTakeFirstOrThrow();

      await trx
        .insertInto("user")
        .values({
          credential_id: Number(newUserCredential.insertId),
          profile_id: Number(newUserProfile.insertId),
          settings_id: Number(newUserSettings.insertId),
        })
        .executeTakeFirstOrThrow();

      await trx.commit().execute();
    } catch (error) {
      await trx.rollback().execute();
      throw error;
    }
  }
}

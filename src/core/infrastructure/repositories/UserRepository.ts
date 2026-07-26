import type { Transaction } from "kysely";
import { db } from "../../../db";
import type { DatabaseSchema } from "../../domain/DatabaseSchema";
import type { AuthUserData } from "../../domain/data/AuthUserData";
import { AUTH_ERROR_MESSAGES } from "../../domain/enums/authErrorMessages";
import { DEFAULT_USER_SETTINGS } from "../../domain/enums/defaultValues";
import { ROLES } from "../../domain/enums/roles";
import { AuthError } from "../../domain/errors/AuthError";
import { normalizeSecurityAnswer } from "../../domain/helpers/normalizeSecurityAnswer";

export type AuthUserRecord = {
  /** En texto plano: la app es local y ofrece recuperación por pregunta. */
  password: string;
  user: AuthUserData;
};

export type StoreUserInput = {
  name: string;
  last_name: string;
  email: string;
  password: string;
  role: ROLES;
  security_question_id: number;
  security_answer: string;
  /** Idioma con el que nace la cuenta. Por defecto, el de la app. */
  language?: string;
};

export type RecoveryQuestionRecord = {
  userId: number;
  /** Slug de la pregunta; el texto se resuelve con i18n en la vista. */
  questionKey: string;
};

type QueryExecutor = Transaction<DatabaseSchema> | typeof db;

export class UserRepository {
  /**
   * El join contra `role` es intencional: un `user` a medio crear (sin rol
   * asignado) no cuenta como superadmin, de forma que la pantalla de setup
   * sigue siendo alcanzable y el usuario puede reintentar.
   */
  async existsSuperAdmin(): Promise<boolean> {
    const found = await db
      .selectFrom("user")
      .innerJoin("user_role", "user_role.user_id", "user.id")
      .innerJoin("role", "role.id", "user_role.role_id")
      .select("user.id")
      .where("role.name", "=", ROLES.SUPERADMIN)
      .where("user.deleted_at", "is", null)
      .limit(1)
      .executeTakeFirst();

    return Boolean(found);
  }

  async existsEmail(email: string): Promise<boolean> {
    const found = await db
      .selectFrom("user_credential")
      .select("id")
      .where("email", "=", email)
      .where("deleted_at", "is", null)
      .limit(1)
      .executeTakeFirst();

    return Boolean(found);
  }

  async findAuthUserByEmail(email: string): Promise<AuthUserRecord | null> {
    const row = await db
      .selectFrom("user")
      .innerJoin("user_credential", "user_credential.id", "user.credential_id")
      .innerJoin("user_profile", "user_profile.id", "user.profile_id")
      .innerJoin("user_settings", "user_settings.id", "user.settings_id")
      .innerJoin("user_role", "user_role.user_id", "user.id")
      .innerJoin("role", "role.id", "user_role.role_id")
      .select([
        "user.id as id",
        "user_credential.email as email",
        "user_credential.password as password",
        "user_profile.name as name",
        "user_profile.last_name as last_name",
        "user_profile.avatar_url as avatar_url",
        "user_settings.theme as theme",
        "user_settings.language as language",
        "role.id as role_id",
        "role.name as role_name",
      ])
      .where("user_credential.email", "=", email)
      .where("user.deleted_at", "is", null)
      .executeTakeFirst();

    if (!row) {
      return null;
    }

    const permissions = await this.findPermissionNamesByRoleId(row.role_id);

    return {
      password: row.password,
      user: {
        id: row.id,
        email: row.email,
        profile: {
          name: row.name,
          last_name: row.last_name,
          avatar_url: row.avatar_url ?? undefined,
        },
        settings: {
          theme: row.theme,
          language: row.language,
        },
        role: {
          id: row.role_id,
          name: row.role_name,
          permissions,
        },
      },
    };
  }

  async storeSuperAdmin(
    data: Omit<StoreUserInput, "role">,
  ): Promise<AuthUserData> {
    return this.storeUser({
      ...data,
      role: ROLES.SUPERADMIN,
    });
  }

  /**
   * Crea el usuario completo (perfil, credencial, preferencias, respuesta de
   * seguridad y rol) en una sola transacción.
   *
   * Nota: `tauri-plugin-sql` ejecuta cada sentencia contra un pool de sqlx,
   * así que el BEGIN/COMMIT no está atado a una conexión concreta. Con las
   * escrituras encadenadas de forma secuencial (como aquí) el pool reutiliza
   * la misma conexión, pero si algún día hacemos escrituras concurrentes hay
   * que mover esto a un comando de Rust.
   */
  async storeUser(data: StoreUserInput): Promise<AuthUserData> {
    const language = data.language ?? DEFAULT_USER_SETTINGS.LANGUAGE;

    return db.transaction().execute(async (trx) => {
      const role = await trx
        .selectFrom("role")
        .select([
          "id",
          "name",
        ])
        .where("name", "=", data.role)
        .executeTakeFirst();

      if (!role) {
        throw new AuthError(AUTH_ERROR_MESSAGES.role_not_found);
      }

      const question = await trx
        .selectFrom("security_question")
        .select("id")
        .where("id", "=", data.security_question_id)
        .executeTakeFirst();

      if (!question) {
        throw new AuthError(AUTH_ERROR_MESSAGES.security_question_not_found);
      }

      const profile = await trx
        .insertInto("user_profile")
        .values({
          name: data.name,
          last_name: data.last_name,
        })
        .executeTakeFirstOrThrow();

      const credential = await trx
        .insertInto("user_credential")
        .values({
          email: data.email,
          password: data.password,
        })
        .executeTakeFirstOrThrow();

      const settings = await trx
        .insertInto("user_settings")
        .values({
          theme: DEFAULT_USER_SETTINGS.THEME_VARIANT,
          language,
        })
        .executeTakeFirstOrThrow();

      const user = await trx
        .insertInto("user")
        .values({
          profile_id: Number(profile.insertId),
          credential_id: Number(credential.insertId),
          settings_id: Number(settings.insertId),
        })
        .executeTakeFirstOrThrow();

      const userId = Number(user.insertId);

      await trx
        .insertInto("user_security_answer")
        .values({
          user_id: userId,
          security_question_id: data.security_question_id,
          answer: normalizeSecurityAnswer(data.security_answer),
        })
        .execute();

      // El rol se escribe al final a propósito: mientras esta fila no exista
      // el usuario no cuenta como superadmin y el setup sigue disponible.
      await trx
        .insertInto("user_role")
        .values({
          user_id: userId,
          role_id: role.id,
        })
        .execute();

      const permissions = await this.findPermissionNamesByRoleId(role.id, trx);

      return {
        id: userId,
        email: data.email,
        profile: {
          name: data.name,
          last_name: data.last_name,
          avatar_url: undefined,
        },
        settings: {
          theme: DEFAULT_USER_SETTINGS.THEME_VARIANT,
          language,
        },
        role: {
          id: role.id,
          name: role.name,
          permissions,
        },
      };
    });
  }

  /**
   * Devuelve la pregunta de seguridad que eligió el dueño de ese email, para
   * la pantalla de recuperación de contraseña.
   */
  async findRecoveryQuestionByEmail(
    email: string,
  ): Promise<RecoveryQuestionRecord | null> {
    const row = await db
      .selectFrom("user")
      .innerJoin("user_credential", "user_credential.id", "user.credential_id")
      .innerJoin(
        "user_security_answer",
        "user_security_answer.user_id",
        "user.id",
      )
      .innerJoin(
        "security_question",
        "security_question.id",
        "user_security_answer.security_question_id",
      )
      .select([
        "user.id as user_id",
        "security_question.question_key as question_key",
      ])
      .where("user_credential.email", "=", email)
      .where("user.deleted_at", "is", null)
      .executeTakeFirst();

    if (!row) {
      return null;
    }

    return {
      userId: row.user_id,
      questionKey: row.question_key,
    };
  }

  /**
   * Compara la respuesta normalizada. La normalización se aplica a la entrada
   * porque en la BD ya se guardó normalizada al crear el usuario.
   */
  async matchesSecurityAnswer(
    userId: number,
    answer: string,
  ): Promise<boolean> {
    const row = await db
      .selectFrom("user_security_answer")
      .select("answer")
      .where("user_id", "=", userId)
      .executeTakeFirst();

    if (!row) {
      return false;
    }

    return row.answer === normalizeSecurityAnswer(answer);
  }

  async updatePassword(userId: number, password: string): Promise<void> {
    // La credencial se alcanza a través de `user`, no por email, para que un
    // usuario borrado lógicamente no pueda cambiar su contraseña.
    const credential = await db
      .selectFrom("user")
      .select("credential_id")
      .where("id", "=", userId)
      .where("deleted_at", "is", null)
      .executeTakeFirst();

    if (!credential) {
      throw new AuthError(AUTH_ERROR_MESSAGES.email_not_found);
    }

    await db
      .updateTable("user_credential")
      .set({
        password,
        updated_at: new Date().toISOString(),
      })
      .where("id", "=", Number(credential.credential_id))
      .execute();
  }

  private async findPermissionNamesByRoleId(
    roleId: number,
    executor: QueryExecutor = db,
  ): Promise<string[]> {
    const rows = await executor
      .selectFrom("role_permission")
      .innerJoin("permission", "permission.id", "role_permission.permission_id")
      .select("permission.name as name")
      .where("role_permission.role_id", "=", roleId)
      .where("role_permission.deleted_at", "is", null)
      .execute();

    return rows.map((row) => row.name);
  }
}

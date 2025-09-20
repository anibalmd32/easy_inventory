import {
  DummyDriver,
  Kysely,
  SqliteAdapter,
  SqliteIntrospector,
  SqliteQueryCompiler,
  sql,
} from "kysely";
import type { Permission } from "../../domain/entities/Permission";
import type { Role } from "../../domain/entities/Role";
import type { User } from "../../domain/entities/User";
import type { UserCredential } from "../../domain/entities/UserCredential";
import type { UserDeviceSession } from "../../domain/entities/UserDeviceSession";
import type { UserProfile } from "../../domain/entities/UserProfile";
import type { UserSession } from "../../domain/entities/UserSession";
import type { UserSettings } from "../../domain/entities/UserSetting";

interface Database {
  user: User;
  permission: Permission;
  role: Role;
  user_credential: UserCredential;
  user_device_session: UserDeviceSession;
  user_profile: UserProfile;
  user_session: UserSession;
  user_settings: UserSettings;
}

export const queryBuilder = new Kysely<Database>({
  dialect: {
    createAdapter() {
      return new SqliteAdapter();
    },
    createDriver() {
      return new DummyDriver();
    },
    createIntrospector(db: Kysely<unknown>) {
      return new SqliteIntrospector(db);
    },
    createQueryCompiler() {
      return new SqliteQueryCompiler();
    },
  },
});

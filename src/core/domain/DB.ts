import type { Permission } from "./entities/Permission";
import type { Role } from "./entities/Role";
import type { User } from "./entities/User";
import type { UserCredential } from "./entities/UserCredential";
import type { UserDeviceSession } from "./entities/UserDeviceSession";
import type { UserProfile } from "./entities/UserProfile";
import type { UserSession } from "./entities/UserSession";
import type { UserSettings } from "./entities/UserSetting";

export interface DB {
  user: User;
  permission: Permission;
  role: Role;
  user_credential: UserCredential;
  user_device_session: UserDeviceSession;
  user_profile: UserProfile;
  user_session: UserSession;
  user_settings: UserSettings;
}

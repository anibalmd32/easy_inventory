import type { BaseEntity } from "./BaseEntity";
import type { Role } from "./Role";
import type { UserCredential } from "./UserCredential";
import type { UserProfile } from "./UserProfile";
import type { UserSettings } from "./UserSetting";

export type User = BaseEntity & {
  profile: UserProfile;
  credentials: UserCredential;
  settings: UserSettings;
  roles: Role[];
};

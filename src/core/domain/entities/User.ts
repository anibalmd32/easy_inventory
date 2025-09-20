import type { Role } from "./Role";
import type { UserCredential } from "./UserCredential";
import type { UserProfile } from "./UserProfile";
import type { UserSettings } from "./UserSetting";

export type User = {
  profile: UserProfile;
  credentials: UserCredential;
  settings: UserSettings;
  roles: Role[];
};

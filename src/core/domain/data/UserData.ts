import type { BaseEntity } from "../entities/BaseEntity";
import type { RoleData } from "./RoleData";
import type { UserCredentialData } from "./UserCredentialData";
import type { UserProfileData } from "./UserProfileData";
import type { UserSettingData } from "./UserSettingData";

export type UserData = BaseEntity & {
  profile: UserProfileData;
  credential: UserCredentialData;
  settings: UserSettingData;
  role: RoleData;
};

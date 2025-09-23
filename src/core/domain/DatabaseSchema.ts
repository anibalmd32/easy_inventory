import type { PermissionEntity } from "./entities/PermissionEntity";
import type { RoleEntity } from "./entities/RoleEntity";
import type { RolePermissionEntity } from "./entities/RolePermissionEntity";
import type { UserCredentialEntity } from "./entities/UserCredentialEntity";
import type { UserDeviceSessionEntity } from "./entities/UserDeviceSessionEntity";
import type { UserEntity } from "./entities/UserEntity";
import type { UserProfileEntity } from "./entities/UserProfileEntity";
import type { UserRoleEntity } from "./entities/UserRoleEntity";
import type { UserSessionEntity } from "./entities/UserSessionEntity";
import type { UserSettingsEntity } from "./entities/UserSettingEntity";

export interface DatabaseSchema {
  user: UserEntity;
  permission: PermissionEntity;
  role: RoleEntity;
  role_permission: RolePermissionEntity;
  user_credential: UserCredentialEntity;
  user_device_session: UserDeviceSessionEntity;
  user_profile: UserProfileEntity;
  user_session: UserSessionEntity;
  user_settings: UserSettingsEntity;
  user_role: UserRoleEntity;
}

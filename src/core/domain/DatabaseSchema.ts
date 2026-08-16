import type { BaseTable } from "./entities/BaseTable";
import type { InventorySettingEntity } from "./entities/InventorySettingEntity";
import type { MeasurementUnitEntity } from "./entities/MeasurementUnitEntity";
import type { PermissionEntity } from "./entities/PermissionEntity";
import type { ProductCategoryEntity } from "./entities/ProductCategoryEntity";
import type { RoleEntity } from "./entities/RoleEntity";
import type { RolePermissionEntity } from "./entities/RolePermissionEntity";
import type { SecurityQuestionEntity } from "./entities/SecurityQuestionEntity";
import type { UserCredentialEntity } from "./entities/UserCredentialEntity";
import type { UserDeviceSessionEntity } from "./entities/UserDeviceSessionEntity";
import type { UserEntity } from "./entities/UserEntity";
import type { UserProfileEntity } from "./entities/UserProfileEntity";
import type { UserRoleEntity } from "./entities/UserRoleEntity";
import type { UserSecurityAnswerEntity } from "./entities/UserSecurityAnswerEntity";
import type { UserSessionEntity } from "./entities/UserSessionEntity";
import type { UserSettingsEntity } from "./entities/UserSettingEntity";

export interface DatabaseSchema {
  inventory_setting: InventorySettingEntity & BaseTable;
  measurement_unit: MeasurementUnitEntity & BaseTable;
  product_category: ProductCategoryEntity & BaseTable;
  user: UserEntity & BaseTable;
  permission: PermissionEntity & BaseTable;
  role: RoleEntity & BaseTable;
  role_permission: RolePermissionEntity & BaseTable;
  security_question: SecurityQuestionEntity & BaseTable;
  user_credential: UserCredentialEntity & BaseTable;
  user_device_session: UserDeviceSessionEntity & BaseTable;
  user_profile: UserProfileEntity & BaseTable;
  user_security_answer: UserSecurityAnswerEntity & BaseTable;
  user_session: UserSessionEntity & BaseTable;
  user_settings: UserSettingsEntity & BaseTable;
  user_role: UserRoleEntity & BaseTable;
}

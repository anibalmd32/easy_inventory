import type { Generated } from "kysely";
import type { BaseTable } from "./entities/BaseTable";
import type { BusinessSettingEntity } from "./entities/BusinessSettingEntity";
import type { CustomerEntity } from "./entities/CustomerEntity";
import type { DebtEntity } from "./entities/DebtEntity";
import type { DebtPaymentEntity } from "./entities/DebtPaymentEntity";
import type { DebtSettingEntity } from "./entities/DebtSettingEntity";
import type { ExchangeRateEntity } from "./entities/ExchangeRateEntity";
import type { InventorySettingEntity } from "./entities/InventorySettingEntity";
import type { MeasurementUnitEntity } from "./entities/MeasurementUnitEntity";
import type { PaymentMethodEntity } from "./entities/PaymentMethodEntity";
import type { PermissionEntity } from "./entities/PermissionEntity";
import type { PosSettingEntity } from "./entities/PosSettingEntity";
import type { ProductCategoryEntity } from "./entities/ProductCategoryEntity";
import type { ProductEntity } from "./entities/ProductEntity";
import type { RoleEntity } from "./entities/RoleEntity";
import type { RolePermissionEntity } from "./entities/RolePermissionEntity";
import type { SaleEntity } from "./entities/SaleEntity";
import type { SaleItemEntity } from "./entities/SaleItemEntity";
import type { SalePaymentEntity } from "./entities/SalePaymentEntity";
import type { SecurityQuestionEntity } from "./entities/SecurityQuestionEntity";
import type { UserCredentialEntity } from "./entities/UserCredentialEntity";
import type { UserDeviceSessionEntity } from "./entities/UserDeviceSessionEntity";
import type { UserEntity } from "./entities/UserEntity";
import type { UserProfileEntity } from "./entities/UserProfileEntity";
import type { UserRoleEntity } from "./entities/UserRoleEntity";
import type { UserSecurityAnswerEntity } from "./entities/UserSecurityAnswerEntity";
import type { UserSessionEntity } from "./entities/UserSessionEntity";
import type { UserSettingsEntity } from "./entities/UserSettingEntity";

/**
 * Las ventas, sus deudas y sus líneas no tienen `deleted_at`: una venta no se
 * borra, se anula (`status`), y una deuda se salda o se cancela. Por eso no
 * usan `BaseTable`, igual que `exchange_rate`.
 */
type LedgerTable = {
  id: Generated<number>;
  created_at: Generated<string>;
  updated_at: Generated<string>;
};

/** Las filas hijas de una venta solo nacen: nunca se editan. */
type LedgerLineTable = {
  id: Generated<number>;
  created_at: Generated<string>;
};

export interface DatabaseSchema {
  business_setting: BusinessSettingEntity & BaseTable;
  customer: CustomerEntity & BaseTable;
  debt: DebtEntity & LedgerTable;
  debt_payment: DebtPaymentEntity & LedgerLineTable;
  debt_setting: DebtSettingEntity & BaseTable;
  // La tasa de cambio es append-only: no tiene updated_at ni deleted_at.
  exchange_rate: ExchangeRateEntity & {
    id: Generated<number>;
    created_at: Generated<string>;
  };
  inventory_setting: InventorySettingEntity & BaseTable;
  measurement_unit: MeasurementUnitEntity & BaseTable;
  payment_method: PaymentMethodEntity & BaseTable;
  pos_setting: PosSettingEntity & BaseTable;
  product: ProductEntity & BaseTable;
  product_category: ProductCategoryEntity & BaseTable;
  user: UserEntity & BaseTable;
  permission: PermissionEntity & BaseTable;
  role: RoleEntity & BaseTable;
  sale: SaleEntity & LedgerTable;
  sale_item: SaleItemEntity & LedgerLineTable;
  sale_payment: SalePaymentEntity & LedgerLineTable;
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

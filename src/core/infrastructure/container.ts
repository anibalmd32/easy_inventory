import { BusinessSettingRepository } from "./repositories/BusinessSettingRepository";
import { ExchangeRateRepository } from "./repositories/ExchangeRateRepository";
import { InventorySettingRepository } from "./repositories/InventorySettingRepository";
import { MeasurementUnitRepository } from "./repositories/MeasurementUnitRepository";
import { PaymentMethodRepository } from "./repositories/PaymentMethodRepository";
import { ProductCategoryRepository } from "./repositories/ProductCategoryRepository";
import { SecurityQuestionRepository } from "./repositories/SecurityQuestionRepository";
import { UserRepository } from "./repositories/UserRepository";
import { BiometricService } from "./services/sharedServices/BiometricService";
import { ErrorHandlerService } from "./services/sharedServices/ErrorHandlerService";
import { BiometricSettingsService } from "./services/useCasesServices/BiometricSettingsService";
import { BusinessSettingsService } from "./services/useCasesServices/BusinessSettingsService";
import { InventorySettingsService } from "./services/useCasesServices/InventorySettingsService";
import { LoginService } from "./services/useCasesServices/LoginService";
import { PasswordRecoveryService } from "./services/useCasesServices/PasswordRecoveryService";
import { PosSettingsService } from "./services/useCasesServices/PosSettingsService";
import { SetupSuperAdminService } from "./services/useCasesServices/SetupSuperAdminService";

/**
 * Punto único donde se arman repositorios y casos de uso. Son sin estado,
 * así que basta con una instancia por módulo.
 */
export const userRepository = new UserRepository();
export const securityQuestionRepository = new SecurityQuestionRepository();

export const biometricService = new BiometricService();

export const loginService = new LoginService(userRepository);
export const setupSuperAdminService = new SetupSuperAdminService(
  new ErrorHandlerService(),
  userRepository,
);
export const passwordRecoveryService = new PasswordRecoveryService(
  new ErrorHandlerService(),
  userRepository,
);
export const biometricSettingsService = new BiometricSettingsService(
  userRepository,
);
export const inventorySettingsService = new InventorySettingsService(
  new ProductCategoryRepository(),
  new MeasurementUnitRepository(),
  new InventorySettingRepository(),
);
export const businessSettingsService = new BusinessSettingsService(
  new BusinessSettingRepository(),
);
export const posSettingsService = new PosSettingsService(
  new PaymentMethodRepository(),
  new ExchangeRateRepository(),
);

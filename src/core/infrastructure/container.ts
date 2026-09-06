import { BusinessSettingRepository } from "./repositories/BusinessSettingRepository";
import { CustomerRepository } from "./repositories/CustomerRepository";
import { DebtSettingRepository } from "./repositories/DebtSettingRepository";
import { ExchangeRateRepository } from "./repositories/ExchangeRateRepository";
import { InventorySettingRepository } from "./repositories/InventorySettingRepository";
import { MeasurementUnitRepository } from "./repositories/MeasurementUnitRepository";
import { PaymentMethodRepository } from "./repositories/PaymentMethodRepository";
import { PosSettingRepository } from "./repositories/PosSettingRepository";
import { ProductCategoryRepository } from "./repositories/ProductCategoryRepository";
import { ProductRepository } from "./repositories/ProductRepository";
import { RoleRepository } from "./repositories/RoleRepository";
import { SaleRepository } from "./repositories/SaleRepository";
import { SecurityQuestionRepository } from "./repositories/SecurityQuestionRepository";
import { UserRepository } from "./repositories/UserRepository";
import { BarcodeScannerService } from "./services/sharedServices/BarcodeScannerService";
import { BiometricService } from "./services/sharedServices/BiometricService";
import { ErrorHandlerService } from "./services/sharedServices/ErrorHandlerService";
import { FileDeliveryService } from "./services/sharedServices/FileDeliveryService";
import { BiometricSettingsService } from "./services/useCasesServices/BiometricSettingsService";
import { BusinessSettingsService } from "./services/useCasesServices/BusinessSettingsService";
import { DebtSettingsService } from "./services/useCasesServices/DebtSettingsService";
import { InventoryService } from "./services/useCasesServices/InventoryService";
import { InventorySettingsService } from "./services/useCasesServices/InventorySettingsService";
import { LoginService } from "./services/useCasesServices/LoginService";
import { PasswordRecoveryService } from "./services/useCasesServices/PasswordRecoveryService";
import { PointOfSaleService } from "./services/useCasesServices/PointOfSaleService";
import { PosSettingsService } from "./services/useCasesServices/PosSettingsService";
import { ProfileService } from "./services/useCasesServices/ProfileService";
import { SetupSuperAdminService } from "./services/useCasesServices/SetupSuperAdminService";
import { TeamService } from "./services/useCasesServices/TeamService";

/**
 * Punto único donde se arman repositorios y casos de uso. Son sin estado,
 * así que basta con una instancia por módulo.
 */
export const userRepository = new UserRepository();
export const securityQuestionRepository = new SecurityQuestionRepository();

export const biometricService = new BiometricService();
export const barcodeScannerService = new BarcodeScannerService();
export const fileDeliveryService = new FileDeliveryService();

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
// Los productos y la configuración del inventario comparten repositorio: al
// borrar una categoría hay que dejar sin agrupar a los productos que la usan,
// y una unidad en uso no se puede borrar.
const productRepository = new ProductRepository();

export const inventorySettingsService = new InventorySettingsService(
  new ProductCategoryRepository(),
  new MeasurementUnitRepository(),
  new InventorySettingRepository(),
  productRepository,
);
export const inventoryService = new InventoryService(productRepository);
export const businessSettingsService = new BusinessSettingsService(
  new BusinessSettingRepository(),
);
export const posSettingsService = new PosSettingsService(
  new PaymentMethodRepository(),
  new ExchangeRateRepository(),
  new PosSettingRepository(),
);
// El punto de venta necesita la tasa vigente y la configuración de fiado, que
// ya tienen repositorio propio: se reutilizan en vez de duplicarlos.
const debtSettingRepository = new DebtSettingRepository();

export const pointOfSaleService = new PointOfSaleService(
  new SaleRepository(),
  new CustomerRepository(),
  new ExchangeRateRepository(),
  debtSettingRepository,
);
export const debtSettingsService = new DebtSettingsService(
  debtSettingRepository,
);
export const teamService = new TeamService(
  userRepository,
  new RoleRepository(),
);
export const profileService = new ProfileService(userRepository);

import { SecurityQuestionRepository } from "./repositories/SecurityQuestionRepository";
import { UserRepository } from "./repositories/UserRepository";
import { BiometricService } from "./services/sharedServices/BiometricService";
import { ErrorHandlerService } from "./services/sharedServices/ErrorHandlerService";
import { BiometricSettingsService } from "./services/useCasesServices/BiometricSettingsService";
import { LoginService } from "./services/useCasesServices/LoginService";
import { PasswordRecoveryService } from "./services/useCasesServices/PasswordRecoveryService";
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

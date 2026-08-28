import { dtoValidator } from "../../../../libs/dtoValidator";
import type { DebtSettingData } from "../../../domain/data/DebtSettingData";
import { CATALOG_ERROR_MESSAGES } from "../../../domain/enums/catalogErrorMessages";
import { CatalogError } from "../../../domain/errors/CatalogError";
import {
  CreditEnabledDto,
  type CreditEnabledInput,
  DebtTermsDto,
  type DebtTermsInput,
} from "../../dtos/DebtSettingsDtos";
import type { DebtSettingRepository } from "../../repositories/DebtSettingRepository";

/**
 * Configuración del módulo de deudas: si el negocio fía y bajo qué
 * condiciones.
 *
 * Los valores solo se guardan; todavía no hay ventas ni notificaciones que
 * los consuman. Cuando existan, este servicio es el sitio donde preguntar
 * "¿puede este cliente llevarse algo a crédito?".
 */
export class DebtSettingsService {
  constructor(private settings: DebtSettingRepository) {}

  getSettings(): Promise<DebtSettingData> {
    return this.settings.find();
  }

  async setCreditEnabled(data: CreditEnabledInput): Promise<void> {
    const { validData } = dtoValidator(CreditEnabledDto, data);

    if (!validData) {
      throw new CatalogError(CATALOG_ERROR_MESSAGES.invalid_form);
    }

    await this.settings.updateCreditEnabled(validData.credit_enabled);
  }

  async setTerms(data: DebtTermsInput): Promise<void> {
    const { validData } = dtoValidator(DebtTermsDto, data);

    if (!validData) {
      throw new CatalogError(CATALOG_ERROR_MESSAGES.invalid_form);
    }

    await this.settings.updateTerms(validData);
  }
}

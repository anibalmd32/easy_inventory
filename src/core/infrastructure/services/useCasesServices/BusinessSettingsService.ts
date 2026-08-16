import { dtoValidator } from "../../../../libs/dtoValidator";
import type { BusinessSettingData } from "../../../domain/data/BusinessSettingData";
import { CATALOG_ERROR_MESSAGES } from "../../../domain/enums/catalogErrorMessages";
import { CatalogError } from "../../../domain/errors/CatalogError";
import {
  BusinessLogoDto,
  type BusinessLogoInput,
  BusinessNameDto,
  type BusinessNameInput,
  BusinessThemeDto,
  type BusinessThemeInput,
} from "../../dtos/BusinessSettingsDtos";
import type { BusinessSettingRepository } from "../../repositories/BusinessSettingRepository";

/**
 * Configuración del negocio: nombre comercial, logo y tema de la interfaz.
 *
 * Los repositorios guardan valores ya validados; aquí solo queda comprobar
 * la forma de los datos antes de escribir.
 */
export class BusinessSettingsService {
  constructor(private settings: BusinessSettingRepository) {}

  getSettings(): Promise<BusinessSettingData> {
    return this.settings.find();
  }

  async updateName(data: BusinessNameInput): Promise<void> {
    const { validData } = dtoValidator(BusinessNameDto, data);

    if (!validData) {
      throw new CatalogError(CATALOG_ERROR_MESSAGES.invalid_form);
    }

    await this.settings.updateName(validData.name);
  }

  async updateLogo(data: BusinessLogoInput): Promise<void> {
    const { validData } = dtoValidator(BusinessLogoDto, data);

    if (!validData) {
      throw new CatalogError(CATALOG_ERROR_MESSAGES.invalid_form);
    }

    await this.settings.updateLogo(validData.logo);
  }

  async updateTheme(data: BusinessThemeInput): Promise<void> {
    const { validData } = dtoValidator(BusinessThemeDto, data);

    if (!validData) {
      throw new CatalogError(CATALOG_ERROR_MESSAGES.invalid_form);
    }

    await this.settings.updateTheme(validData.theme);
  }
}

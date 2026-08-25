import { dtoValidator } from "../../../../libs/dtoValidator";
import type { ExchangeRateData } from "../../../domain/data/ExchangeRateData";
import type { PaymentMethodData } from "../../../domain/data/PaymentMethodData";
import type { PosSettingData } from "../../../domain/data/PosSettingData";
import { CATALOG_ERROR_MESSAGES } from "../../../domain/enums/catalogErrorMessages";
import { CatalogError } from "../../../domain/errors/CatalogError";
import {
  ExchangeRateDto,
  type ExchangeRateInput,
  InvoiceSettingsDto,
  type InvoiceSettingsInput,
  PaymentMethodDto,
  type PaymentMethodInput,
  PrimaryCurrencyDto,
  type PrimaryCurrencyInput,
} from "../../dtos/PosSettingsDtos";
import type { ExchangeRateRepository } from "../../repositories/ExchangeRateRepository";
import type { PaymentMethodRepository } from "../../repositories/PaymentMethodRepository";
import type { PosSettingRepository } from "../../repositories/PosSettingRepository";

/**
 * Configuración del punto de venta: métodos de pago y tasa de cambio
 * dólar–bolívar.
 *
 * De momento la tasa se fija a mano; cuando exista un proveedor de tasas
 * (API), este servicio es el sitio natural para integrarlo, porque el
 * historial y la UI ya leen de aquí.
 */
export class PosSettingsService {
  constructor(
    private paymentMethods: PaymentMethodRepository,
    private exchangeRates: ExchangeRateRepository,
    private settings: PosSettingRepository,
  ) {}

  // --- Métodos de pago ----------------------------------------------------

  listPaymentMethods(): Promise<PaymentMethodData[]> {
    return this.paymentMethods.findAll();
  }

  async createPaymentMethod(data: PaymentMethodInput): Promise<void> {
    await this.paymentMethods.create(this.validPaymentMethod(data));
  }

  async updatePaymentMethod(
    id: number,
    data: PaymentMethodInput,
  ): Promise<void> {
    await this.paymentMethods.update(id, this.validPaymentMethod(data));
  }

  deletePaymentMethod(id: number): Promise<void> {
    return this.paymentMethods.softDelete(id);
  }

  // --- Tasa de cambio -----------------------------------------------------

  getCurrentRate(): Promise<ExchangeRateData | null> {
    return this.exchangeRates.findCurrent();
  }

  getRateHistory(): Promise<ExchangeRateData[]> {
    return this.exchangeRates.findHistory();
  }

  async setRate(data: ExchangeRateInput): Promise<void> {
    const { validData } = dtoValidator(ExchangeRateDto, data);

    if (!validData) {
      throw new CatalogError(CATALOG_ERROR_MESSAGES.invalid_form);
    }

    await this.exchangeRates.create(validData.rate);
  }

  // --- Moneda y factura ---------------------------------------------------

  getSettings(): Promise<PosSettingData> {
    return this.settings.find();
  }

  async setPrimaryCurrency(data: PrimaryCurrencyInput): Promise<void> {
    const { validData } = dtoValidator(PrimaryCurrencyDto, data);

    if (!validData) {
      throw new CatalogError(CATALOG_ERROR_MESSAGES.invalid_form);
    }

    await this.settings.updatePrimaryCurrency(validData.primary_currency);
  }

  async setInvoiceSettings(data: InvoiceSettingsInput): Promise<void> {
    const { validData } = dtoValidator(InvoiceSettingsDto, data);

    if (!validData) {
      throw new CatalogError(CATALOG_ERROR_MESSAGES.invalid_form);
    }

    await this.settings.updateInvoiceSettings(validData);
  }

  // --- Validación ---------------------------------------------------------

  private validPaymentMethod(data: PaymentMethodInput) {
    const { validData } = dtoValidator(PaymentMethodDto, data);

    if (!validData) {
      throw new CatalogError(CATALOG_ERROR_MESSAGES.invalid_form);
    }

    return validData;
  }
}

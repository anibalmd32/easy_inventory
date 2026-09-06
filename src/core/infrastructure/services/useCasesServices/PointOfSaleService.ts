import { dtoValidator } from "../../../../libs/dtoValidator";
import { roundMoney, toDollars } from "../../../../utils/money";
import type {
  CustomerData,
  CustomerPageData,
} from "../../../domain/data/CustomerData";
import type {
  CashUpData,
  SaleData,
  SalePageData,
} from "../../../domain/data/SaleData";
import { CURRENCY } from "../../../domain/enums/currencies";
import { SALE_TYPE } from "../../../domain/enums/sales";
import { SALES_ERROR_MESSAGES } from "../../../domain/enums/salesErrorMessages";
import { SalesError } from "../../../domain/errors/SalesError";
import {
  CustomerDto,
  type CustomerFilters,
  type CustomerInput,
} from "../../dtos/CustomerDtos";
import {
  IssueSaleDto,
  type IssueSaleInput,
  type IssueSaleOutput,
  type SaleFilters,
} from "../../dtos/SaleDtos";
import type { CustomerRepository } from "../../repositories/CustomerRepository";
import type { DebtSettingRepository } from "../../repositories/DebtSettingRepository";
import type { ExchangeRateRepository } from "../../repositories/ExchangeRateRepository";
import type {
  IssuedSaleRecord,
  SaleLineRecord,
  SalePaymentRecord,
  SaleRepository,
} from "../../repositories/SaleRepository";

/**
 * Margen que se le perdona al cobro, en dólares.
 *
 * Convertir bolívares a dólares deja céntimos de resto —pagar Bs 500 a una
 * tasa de 36,5 son 13,698630… dólares— y sin este margen una venta pagada
 * exacta se rechazaría por medio céntimo.
 */
const PAYMENT_TOLERANCE_USD = 0.01;

/**
 * El punto de venta: armar la venta, cobrarla, fiarla y anularla.
 *
 * Toda la aritmética del dinero vive aquí y no en la pantalla ni en el
 * repositorio. La pantalla enseña números; el repositorio escribe los que le
 * dan. El único sitio donde se decide cuánto vale una venta es este.
 */
export class PointOfSaleService {
  constructor(
    private sales: SaleRepository,
    private customers: CustomerRepository,
    private exchangeRates: ExchangeRateRepository,
    private debtSettings: DebtSettingRepository,
  ) {}

  // --- Clientes -----------------------------------------------------------

  listCustomers(filters: CustomerFilters): Promise<CustomerPageData> {
    return this.customers.findPage(filters);
  }

  getCustomer(id: number): Promise<CustomerData | null> {
    return this.customers.findById(id);
  }

  /** Devuelve el id para poder dejarlo elegido en la venta que se está armando. */
  async createCustomer(data: CustomerInput): Promise<number> {
    return this.customers.create(this.validCustomer(data));
  }

  async updateCustomer(id: number, data: CustomerInput): Promise<void> {
    await this.customers.update(id, this.validCustomer(data));
  }

  deleteCustomer(id: number): Promise<void> {
    return this.customers.softDelete(id);
  }

  // --- Ventas -------------------------------------------------------------

  listSales(filters: SaleFilters): Promise<SalePageData> {
    return this.sales.findPage(filters);
  }

  async getSale(id: number): Promise<SaleData> {
    const sale = await this.sales.findById(id);

    if (!sale) {
      throw new SalesError(SALES_ERROR_MESSAGES.sale_not_found);
    }

    return sale;
  }

  cashUp(filters: Pick<SaleFilters, "day" | "userId">): Promise<CashUpData> {
    return this.sales.cashUp(filters);
  }

  /**
   * Emite la venta: calcula los importes, comprueba las reglas del fiado y se
   * la pasa entera al repositorio para que la escriba de una sentada.
   *
   * Lo que NO comprueba, a propósito: que haya existencias. La pantalla avisa
   * de que no alcanza y deja seguir (ver la migración 13). En una bodega el
   * inventario registrado casi nunca cuadra con el real, y frenarle el cobro
   * al cajero con el cliente delante es peor que el descuadre.
   */
  async issueSale(data: IssueSaleInput): Promise<IssuedSaleRecord> {
    const { validData } = dtoValidator(IssueSaleDto, data);

    if (!validData) {
      throw new SalesError(SALES_ERROR_MESSAGES.invalid_sale);
    }

    const items = buildLines(validData);
    const subtotal = roundMoney(
      items.reduce((sum, item) => sum + item.line_total_usd, 0),
    );
    // Hoy no hay rebajas en pantalla; la columna existe para el día que las
    // haya sin tener que rehacer la tabla.
    const discount = 0;
    const total = roundMoney(subtotal - discount);

    const rate = (await this.exchangeRates.findCurrent())?.rate ?? null;
    const needsRate =
      validData.payments.some((payment) => payment.currency === CURRENCY.VES) ||
      validData.change_currency === CURRENCY.VES;

    // Sin tasa fijada no se puede convertir nada: se puede vender, pero solo
    // cobrando en dólares. Es mejor eso que inventarse unos bolívares.
    if (needsRate && rate === null) {
      throw new SalesError(SALES_ERROR_MESSAGES.rate_required);
    }

    const payments = buildPayments(validData, rate);
    const paidUsd = roundMoney(
      payments.reduce((sum, payment) => sum + payment.amount_usd, 0),
    );
    // Lo que entregó el cliente menos el vuelto: es lo que se queda el negocio.
    const settledUsd = roundMoney(paidUsd - validData.change_usd);

    const debt = await this.resolveDebt(validData, total, settledUsd);

    if (!debt && settledUsd + PAYMENT_TOLERANCE_USD < total) {
      throw new SalesError(SALES_ERROR_MESSAGES.insufficient_payment);
    }

    return this.sales.createSale({
      customer_id: validData.customer_id,
      user_id: validData.user_id,
      sale_type: validData.sale_type,
      subtotal_usd: subtotal,
      discount_usd: discount,
      total_usd: total,
      exchange_rate: rate,
      change_usd: validData.change_usd,
      change_currency: validData.change_currency,
      items,
      payments,
      debt,
    });
  }

  /** Anula la venta y devuelve la mercancía al inventario. */
  voidSale(
    saleId: number,
    userId: number,
    reason: string | null,
  ): Promise<void> {
    return this.sales.voidSale(saleId, userId, reason);
  }

  // --- Reglas del fiado ---------------------------------------------------

  /**
   * Qué deuda deja la venta, si es que deja alguna, y si el negocio permite
   * dejarla.
   */
  private async resolveDebt(
    sale: IssueSaleOutput,
    total: number,
    settledUsd: number,
  ) {
    if (sale.sale_type !== SALE_TYPE.CREDIT) {
      return null;
    }

    const settings = await this.debtSettings.find();

    if (!settings.credit_enabled) {
      throw new SalesError(SALES_ERROR_MESSAGES.credit_disabled);
    }

    if (sale.customer_id === null) {
      throw new SalesError(SALES_ERROR_MESSAGES.credit_customer_required);
    }

    const customer = await this.customers.findById(sale.customer_id);

    if (!customer) {
      throw new SalesError(SALES_ERROR_MESSAGES.customer_not_found);
    }

    // Lo que queda a deber es el total menos lo que abonó en el momento: en
    // una bodega es normal dejar algo y llevarse el resto fiado.
    const owed = roundMoney(total - settledUsd);

    if (owed <= 0) {
      // Pagó todo: no hay nada que fiar aunque marcara "fiado".
      return null;
    }

    // `customer_debt_limit` en 0 significa "sin límite", y hay que respetarlo
    // tal cual: es lo que dice la pantalla de configuración.
    if (settings.customer_debt_limit > 0) {
      const wouldOwe = roundMoney(customer.open_debt_usd + owed);

      if (wouldOwe > settings.customer_debt_limit) {
        throw new SalesError(SALES_ERROR_MESSAGES.debt_limit_reached);
      }
    }

    return {
      customer_id: sale.customer_id,
      original_amount_usd: owed,
      due_date: dueDateFrom(settings.default_term_days),
    };
  }

  // --- Validación ---------------------------------------------------------

  private validCustomer(data: CustomerInput) {
    const { validData } = dtoValidator(CustomerDto, data);

    if (!validData) {
      throw new SalesError(SALES_ERROR_MESSAGES.invalid_customer);
    }

    return validData;
  }
}

/** El total de cada línea, redondeado línea a línea y no solo al final. */
const buildLines = (sale: IssueSaleOutput): SaleLineRecord[] =>
  sale.items.map((item) => ({
    product_id: item.product_id,
    product_name: item.product_name,
    unit_abbreviation: item.unit_abbreviation,
    quantity: item.quantity,
    unit_price_usd: item.unit_price_usd,
    unit_cost_usd: item.unit_cost_usd,
    line_total_usd: roundMoney(item.quantity * item.unit_price_usd),
  }));

/**
 * Convierte cada cobro a dólares con la tasa que se va a congelar en la venta.
 *
 * La conversión se hace AQUÍ y no se acepta desde fuera para que nadie pueda
 * mandar un importe en bolívares y un equivalente en dólares que no cuadren
 * entre sí.
 */
const buildPayments = (
  sale: IssueSaleOutput,
  rate: number | null,
): SalePaymentRecord[] =>
  sale.payments.map((payment) => ({
    payment_method_id: payment.payment_method_id,
    payment_method_name: payment.payment_method_name,
    currency: payment.currency,
    amount: payment.amount,
    amount_usd:
      payment.currency === CURRENCY.USD || rate === null
        ? roundMoney(payment.amount)
        : toDollars(payment.amount, rate),
    reference: payment.reference,
  }));

/**
 * Fecha de vencimiento a partir de los días de plazo configurados. 0 días
 * significa "el mismo día", que es lo que dice la pantalla de configuración.
 */
const dueDateFrom = (termDays: number): string => {
  const due = new Date();
  due.setDate(due.getDate() + termDays);

  return due.toISOString();
};

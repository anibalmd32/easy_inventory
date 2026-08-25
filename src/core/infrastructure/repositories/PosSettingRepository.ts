import { db } from "../../../db";
import type { PosSettingData } from "../../domain/data/PosSettingData";
import { CURRENCY } from "../../domain/enums/currencies";
import { DEFAULT_POS_SETTINGS } from "../../domain/enums/defaultValues";

/** La configuración del punto de venta vive en una única fila, id = 1. */
const SETTINGS_ROW_ID = 1;

export class PosSettingRepository {
  async find(): Promise<PosSettingData> {
    const row = await db
      .selectFrom("pos_setting")
      .select([
        "primary_currency",
        "invoice_prefix",
        "invoice_next_number",
        "invoice_show_business_info",
        "invoice_footer_note",
      ])
      .where("id", "=", SETTINGS_ROW_ID)
      .executeTakeFirst();

    // La migración siembra la fila; si faltara, es preferible mostrar los
    // valores por defecto a romper la pantalla entera de configuración.
    if (!row) {
      return {
        primary_currency: CURRENCY.USD,
        invoice_prefix: DEFAULT_POS_SETTINGS.INVOICE_PREFIX,
        invoice_next_number: DEFAULT_POS_SETTINGS.INVOICE_NEXT_NUMBER,
        invoice_show_business_info: true,
        invoice_footer_note: DEFAULT_POS_SETTINGS.INVOICE_FOOTER_NOTE,
      };
    }

    return {
      ...row,
      invoice_show_business_info: row.invoice_show_business_info === 1,
    };
  }

  async updatePrimaryCurrency(currency: CURRENCY): Promise<void> {
    await this.update({
      primary_currency: currency,
    });
  }

  async updateInvoiceSettings(settings: {
    invoice_prefix: string;
    invoice_next_number: number;
    invoice_show_business_info: boolean;
    invoice_footer_note: string;
  }): Promise<void> {
    await this.update({
      invoice_prefix: settings.invoice_prefix,
      invoice_next_number: settings.invoice_next_number,
      invoice_show_business_info: settings.invoice_show_business_info ? 1 : 0,
      invoice_footer_note: settings.invoice_footer_note,
    });
  }

  private async update(
    values: Partial<{
      primary_currency: CURRENCY;
      invoice_prefix: string;
      invoice_next_number: number;
      invoice_show_business_info: number;
      invoice_footer_note: string;
    }>,
  ): Promise<void> {
    await db
      .updateTable("pos_setting")
      .set({
        ...values,
        updated_at: new Date().toISOString(),
      })
      .where("id", "=", SETTINGS_ROW_ID)
      .execute();
  }
}

import { db } from "../../../db";
import type { DebtSettingData } from "../../domain/data/DebtSettingData";
import { DEFAULT_DEBT_SETTINGS } from "../../domain/enums/defaultValues";

/** La configuración de deudas vive en una única fila, id = 1. */
const SETTINGS_ROW_ID = 1;

export class DebtSettingRepository {
  async find(): Promise<DebtSettingData> {
    const row = await db
      .selectFrom("debt_setting")
      .select([
        "credit_enabled",
        "default_term_days",
        "customer_debt_limit",
      ])
      .where("id", "=", SETTINGS_ROW_ID)
      .executeTakeFirst();

    // La migración siembra la fila; si faltara, es preferible mostrar los
    // valores por defecto a romper la pantalla entera de configuración.
    if (!row) {
      return {
        credit_enabled: DEFAULT_DEBT_SETTINGS.CREDIT_ENABLED,
        default_term_days: DEFAULT_DEBT_SETTINGS.DEFAULT_TERM_DAYS,
        customer_debt_limit: DEFAULT_DEBT_SETTINGS.CUSTOMER_DEBT_LIMIT,
      };
    }

    return {
      ...row,
      credit_enabled: row.credit_enabled === 1,
    };
  }

  async updateCreditEnabled(enabled: boolean): Promise<void> {
    await this.update({
      credit_enabled: enabled ? 1 : 0,
    });
  }

  async updateTerms(terms: {
    default_term_days: number;
    customer_debt_limit: number;
  }): Promise<void> {
    await this.update(terms);
  }

  private async update(
    values: Partial<{
      credit_enabled: number;
      default_term_days: number;
      customer_debt_limit: number;
    }>,
  ): Promise<void> {
    await db
      .updateTable("debt_setting")
      .set({
        ...values,
        updated_at: new Date().toISOString(),
      })
      .where("id", "=", SETTINGS_ROW_ID)
      .execute();
  }
}

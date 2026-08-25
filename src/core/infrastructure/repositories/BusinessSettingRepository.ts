import { db } from "../../../db";
import type { BusinessSettingData } from "../../domain/data/BusinessSettingData";
import { DEFAULT_BUSINESS_SETTINGS } from "../../domain/enums/defaultValues";

/** La configuración del negocio vive en una única fila, sembrada con id 1. */
const SETTINGS_ROW_ID = 1;

export class BusinessSettingRepository {
  async find(): Promise<BusinessSettingData> {
    const row = await db
      .selectFrom("business_setting")
      .select([
        "id",
        "name",
        "logo",
        "theme",
        "tax_id",
        "address",
        "phone",
      ])
      .where("id", "=", SETTINGS_ROW_ID)
      .executeTakeFirst();

    // La migración siembra la fila, así que esto no debería ocurrir. Si
    // ocurriera, es preferible mostrar los valores por defecto a romper la
    // pantalla entera de configuración.
    return (
      row ?? {
        id: SETTINGS_ROW_ID,
        name: DEFAULT_BUSINESS_SETTINGS.NAME,
        logo: null,
        theme: DEFAULT_BUSINESS_SETTINGS.THEME,
        tax_id: "",
        address: "",
        phone: "",
      }
    );
  }

  async updateName(name: string): Promise<void> {
    await db
      .updateTable("business_setting")
      .set({
        name,
        updated_at: new Date().toISOString(),
      })
      .where("id", "=", SETTINGS_ROW_ID)
      .execute();
  }

  async updateLogo(logo: string | null): Promise<void> {
    await db
      .updateTable("business_setting")
      .set({
        logo,
        updated_at: new Date().toISOString(),
      })
      .where("id", "=", SETTINGS_ROW_ID)
      .execute();
  }

  async updateTheme(theme: string): Promise<void> {
    await db
      .updateTable("business_setting")
      .set({
        theme,
        updated_at: new Date().toISOString(),
      })
      .where("id", "=", SETTINGS_ROW_ID)
      .execute();
  }
  async updateInfo(info: {
    tax_id: string;
    address: string;
    phone: string;
  }): Promise<void> {
    await db
      .updateTable("business_setting")
      .set({
        ...info,
        updated_at: new Date().toISOString(),
      })
      .where("id", "=", SETTINGS_ROW_ID)
      .execute();
  }
}

import { db } from "../../../db";
import type { InventorySettingData } from "../../domain/data/InventorySettingData";
import { DEFAULT_INVENTORY_SETTINGS } from "../../domain/enums/defaultValues";

/** La configuración del inventario vive en una única fila, sembrada con id 1. */
const SETTINGS_ROW_ID = 1;

export class InventorySettingRepository {
  async find(): Promise<InventorySettingData> {
    const row = await db
      .selectFrom("inventory_setting")
      .select("low_quantity_threshold")
      .where("id", "=", SETTINGS_ROW_ID)
      .executeTakeFirst();

    // La migración siembra la fila, así que esto no debería ocurrir. Si
    // ocurriera, es preferible mostrar el valor por defecto a romper la
    // pantalla entera de configuración.
    return (
      row ?? {
        low_quantity_threshold: DEFAULT_INVENTORY_SETTINGS.LOW_QUANTITY,
      }
    );
  }

  async updateLowQuantityThreshold(threshold: number): Promise<void> {
    await db
      .updateTable("inventory_setting")
      .set({
        low_quantity_threshold: threshold,
        updated_at: new Date().toISOString(),
      })
      .where("id", "=", SETTINGS_ROW_ID)
      .execute();
  }
}

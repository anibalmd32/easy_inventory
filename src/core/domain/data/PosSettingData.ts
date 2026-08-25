import type { PosSettingEntity } from "../entities/PosSettingEntity";

export type PosSettingData = Omit<
  PosSettingEntity,
  "invoice_show_business_info"
> & {
  /** El 0/1 de SQLite se traduce a booleano al salir del repositorio. */
  invoice_show_business_info: boolean;
};

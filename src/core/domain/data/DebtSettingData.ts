import type { DebtSettingEntity } from "../entities/DebtSettingEntity";

export type DebtSettingData = Omit<DebtSettingEntity, "credit_enabled"> & {
  /** El 0/1 de SQLite se traduce a booleano al salir del repositorio. */
  credit_enabled: boolean;
};

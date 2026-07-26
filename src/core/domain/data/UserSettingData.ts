import type { UserSettingsEntity } from "../entities/UserSettingEntity";

export type UserSettingData = Pick<UserSettingsEntity, "theme" | "language"> & {
  /** El 0/1 de SQLite se traduce a booleano al salir del repositorio. */
  biometric_enabled: boolean;
  /** Si ya se le ofreció activar la biometría alguna vez. */
  biometric_prompted: boolean;
};

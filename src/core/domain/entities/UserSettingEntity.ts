export type UserSettingsEntity = {
  theme: string;
  language: string;
  /** SQLite no tiene BOOLEAN: 0 = desactivado, 1 = activado. */
  biometric_enabled: number;
  /** NULL = todavía no se le ha ofrecido activar la biometría. */
  biometric_prompted_at: string | null;
};

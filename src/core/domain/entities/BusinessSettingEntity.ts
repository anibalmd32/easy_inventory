export type BusinessSettingEntity = {
  /** Nombre comercial. Vacío = el usuario aún no lo ha personalizado. */
  name: string;
  /** Logo como data URL; `null` cuando no se ha subido ninguno. */
  logo: string | null;
  /** Tema de daisyUI aplicado a la interfaz. */
  theme: string;
};

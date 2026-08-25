export type BusinessSettingEntity = {
  /** Nombre comercial. Vacío = el usuario aún no lo ha personalizado. */
  name: string;
  /** Logo como data URL; `null` cuando no se ha subido ninguno. */
  logo: string | null;
  /** Tema de daisyUI aplicado a la interfaz. */
  theme: string;
  /**
   * Datos fiscales y de contacto. Cadena vacía = sin rellenar; se usa "" en
   * vez de NULL para que la app no distinga entre "sin dato" y "dato vacío".
   */
  tax_id: string;
  address: string;
  phone: string;
};

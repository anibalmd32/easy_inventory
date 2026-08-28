export enum DEFAULT_USER_SETTINGS {
  THEME_VARIANT = "dark",
  // Debe coincidir con el DEFAULT de `user_settings.language` en la
  // migración 01 y con el `fallbackLng` de i18n.
  LANGUAGE = "es",
}

export enum DEFAULT_INVENTORY_SETTINGS {
  // Debe coincidir con el DEFAULT de
  // `inventory_setting.low_quantity_threshold` en la migración 05.
  LOW_QUANTITY = 5,
}

export enum DEFAULT_BUSINESS_SETTINGS {
  NAME = "",
  // Debe coincidir con el DEFAULT de `business_setting.theme` en la
  // migración 07 y con el `data-theme` estático del index.html.
  THEME = "business",
}

/**
 * Objeto y no enum: un enum que mezcla texto y números hace que TypeScript
 * tipe cada miembro como la unión completa, y entonces no se puede asignar
 * ni a `string` ni a `number`.
 *
 * Deben coincidir con los DEFAULT de `pos_setting` en las migraciones 08 y 10.
 */
export const DEFAULT_POS_SETTINGS = {
  INVOICE_PREFIX: "",
  INVOICE_NEXT_NUMBER: 1,
  INVOICE_FOOTER_NOTE: "",
  INVOICE_SHOW_BUSINESS_INFO: true,
} as const;

/** Deben coincidir con los DEFAULT de `debt_setting` en la migración 11. */
export const DEFAULT_DEBT_SETTINGS = {
  CREDIT_ENABLED: true,
  DEFAULT_TERM_DAYS: 15,
  CUSTOMER_DEBT_LIMIT: 0,
} as const;

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

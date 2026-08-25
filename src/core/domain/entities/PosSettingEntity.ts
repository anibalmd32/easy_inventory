import type { CURRENCY } from "../enums/currencies";

export type PosSettingEntity = {
  /** Moneda del importe destacado. La otra se muestra siempre, más pequeña. */
  primary_currency: CURRENCY;
  /** Prefijo del número de factura. Vacío = sin prefijo. */
  invoice_prefix: string;
  /** Próximo número a emitir. */
  invoice_next_number: number;
  /** SQLite no tiene BOOLEAN: 0 = no mostrar, 1 = mostrar. */
  invoice_show_business_info: number;
  /** Nota al pie de la factura. Vacía = no se imprime. */
  invoice_footer_note: string;
};

export type DebtSettingEntity = {
  /** SQLite no tiene BOOLEAN: 0 = no vende a crédito, 1 = sí. */
  credit_enabled: number;
  /** Días para pagar antes de considerar la deuda vencida. */
  default_term_days: number;
  /**
   * Máximo que puede deber un cliente. 0 = sin límite.
   * En dólares, igual que los precios.
   */
  customer_debt_limit: number;
};

import * as v from "valibot";
import { CURRENCY } from "../../domain/enums/currencies";
import { SALE_TYPE } from "../../domain/enums/sales";
import { SALE_VALIDATION_ERROR_MESSAGES } from "../../domain/enums/validationErrorMessages";

/**
 * Una línea de la venta tal como la manda el carrito.
 *
 * El precio y el costo viajan ya resueltos y no se leen del producto al
 * escribir: lo que se cobra es lo que el cajero vio en pantalla, aunque el
 * dueño esté cambiando precios desde otra pantalla en ese mismo momento.
 */
export const SaleItemDto = v.object({
  product_id: v.nullable(v.pipe(v.number(), v.integer(), v.minValue(1))),
  product_name: v.pipe(v.string(), v.trim(), v.minLength(1)),
  unit_abbreviation: v.string(),
  quantity: v.pipe(
    v.number(SALE_VALIDATION_ERROR_MESSAGES.quantity_invalid),
    v.minValue(0.001, SALE_VALIDATION_ERROR_MESSAGES.quantity_invalid),
    v.maxValue(9999999, SALE_VALIDATION_ERROR_MESSAGES.quantity_too_big),
  ),
  unit_price_usd: v.pipe(v.number(), v.minValue(0)),
  unit_cost_usd: v.pipe(v.number(), v.minValue(0)),
});

/**
 * Lo que entrega el cliente con una forma de pago. Varias filas = pago mixto,
 * que en Venezuela es lo normal.
 *
 * `amount` va en la moneda de `currency`; el equivalente en dólares lo calcula
 * el servicio con la tasa que congela en la venta, para que nadie pueda
 * mandar un importe y una conversión que no cuadren entre sí.
 */
export const SalePaymentDto = v.object({
  payment_method_id: v.nullable(v.pipe(v.number(), v.integer(), v.minValue(1))),
  payment_method_name: v.pipe(
    v.string(SALE_VALIDATION_ERROR_MESSAGES.method_required),
    v.trim(),
    v.minLength(1, SALE_VALIDATION_ERROR_MESSAGES.method_required),
  ),
  currency: v.enum(CURRENCY),
  amount: v.pipe(
    v.number(SALE_VALIDATION_ERROR_MESSAGES.amount_invalid),
    v.minValue(0.000001, SALE_VALIDATION_ERROR_MESSAGES.amount_invalid),
    v.maxValue(999999999, SALE_VALIDATION_ERROR_MESSAGES.amount_too_big),
  ),
  reference: v.nullable(v.string()),
});

/** La orden de emitir una venta, con todo lo que hace falta para escribirla. */
export const IssueSaleDto = v.object({
  /** `null` en la venta de mostrador. Obligatorio si es fiada. */
  customer_id: v.nullable(v.pipe(v.number(), v.integer(), v.minValue(1))),
  /** El cajero de la sesión. */
  user_id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  sale_type: v.enum(SALE_TYPE),
  items: v.pipe(
    v.array(SaleItemDto),
    v.minLength(1, SALE_VALIDATION_ERROR_MESSAGES.items_required),
  ),
  /** Vacío en una venta fiada sin abono inicial. */
  payments: v.array(SalePaymentDto),
  /** Vuelto entregado, en dólares, y en qué moneda se le dio al cliente. */
  change_usd: v.pipe(v.number(), v.minValue(0)),
  change_currency: v.enum(CURRENCY),
});

export type SaleItemInput = v.InferInput<typeof SaleItemDto>;
export type SalePaymentInput = v.InferInput<typeof SalePaymentDto>;
export type IssueSaleInput = v.InferInput<typeof IssueSaleDto>;
export type IssueSaleOutput = v.InferOutput<typeof IssueSaleDto>;

/**
 * Filtros del historial de ventas.
 *
 * `day` es una fecha local en formato `YYYY-MM-DD`. Se compara contra
 * `created_at` convertido a hora local en SQL: guardar UTC y filtrar por día
 * local es lo único que hace que "las ventas de hoy" signifique lo mismo para
 * el cajero que para el reloj.
 */
export type SaleFilters = {
  day: string;
  /** `null` = todos los cajeros. */
  userId: number | null;
  page: number;
  pageSize: number;
};

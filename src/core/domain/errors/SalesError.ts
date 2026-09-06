import type { SALES_ERROR_MESSAGES } from "../enums/salesErrorMessages";
import { AppError } from "./AppError";

/** Error del punto de venta: el carrito, el cobro, la factura y los clientes. */
export class SalesError extends AppError {
  constructor(messageKey: SALES_ERROR_MESSAGES) {
    super(messageKey);
    this.name = "SalesError";
  }
}

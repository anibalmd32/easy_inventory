import type { INVENTORY_ERROR_MESSAGES } from "../enums/inventoryErrorMessages";
import { AppError } from "./AppError";

/** Error del módulo de inventario: los productos y su catálogo en PDF. */
export class InventoryError extends AppError {
  constructor(messageKey: INVENTORY_ERROR_MESSAGES) {
    super(messageKey);
    this.name = "InventoryError";
  }
}

import type { CATALOG_ERROR_MESSAGES } from "../enums/catalogErrorMessages";
import { AppError } from "./AppError";

/**
 * Error de los catálogos de configuración (categorías, unidades de medida).
 */
export class CatalogError extends AppError {
  constructor(messageKey: CATALOG_ERROR_MESSAGES) {
    super(messageKey);
    this.name = "CatalogError";
  }
}

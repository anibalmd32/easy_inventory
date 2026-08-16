import { db } from "../../../db";
import type { PaymentMethodData } from "../../domain/data/PaymentMethodData";
import { CATALOG_ERROR_MESSAGES } from "../../domain/enums/catalogErrorMessages";
import { CatalogError } from "../../domain/errors/CatalogError";
import type { PaymentMethodOutput } from "../dtos/PosSettingsDtos";
import { violatesUniqueConstraint } from "./violatesUniqueConstraint";

const NAME_COLUMN = "payment_method.name";

/** Traduce el conflicto de unicidad al error que la UI sabe explicar. */
const asCatalogError = (error: unknown): unknown => {
  if (violatesUniqueConstraint(error, NAME_COLUMN)) {
    return new CatalogError(CATALOG_ERROR_MESSAGES.duplicate_payment_method);
  }

  return error;
};

export class PaymentMethodRepository {
  async findAll(): Promise<PaymentMethodData[]> {
    return db
      .selectFrom("payment_method")
      .select([
        "id",
        "name",
      ])
      .where("deleted_at", "is", null)
      .orderBy("name", "asc")
      .execute();
  }

  async create(data: PaymentMethodOutput): Promise<void> {
    try {
      await db
        .insertInto("payment_method")
        .values({
          name: data.name,
        })
        .execute();
    } catch (error) {
      throw asCatalogError(error);
    }
  }

  async update(id: number, data: PaymentMethodOutput): Promise<void> {
    try {
      const result = await db
        .updateTable("payment_method")
        .set({
          name: data.name,
          updated_at: new Date().toISOString(),
        })
        .where("id", "=", id)
        .where("deleted_at", "is", null)
        .executeTakeFirst();

      if (Number(result.numUpdatedRows) === 0) {
        throw new CatalogError(CATALOG_ERROR_MESSAGES.not_found);
      }
    } catch (error) {
      throw asCatalogError(error);
    }
  }

  /** Borrado lógico, por el mismo motivo que en los demás catálogos. */
  async softDelete(id: number): Promise<void> {
    const now = new Date().toISOString();

    const result = await db
      .updateTable("payment_method")
      .set({
        deleted_at: now,
        updated_at: now,
      })
      .where("id", "=", id)
      .where("deleted_at", "is", null)
      .executeTakeFirst();

    if (Number(result.numUpdatedRows) === 0) {
      throw new CatalogError(CATALOG_ERROR_MESSAGES.not_found);
    }
  }
}

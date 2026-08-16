import { db } from "../../../db";
import type { ProductCategoryData } from "../../domain/data/ProductCategoryData";
import { CATALOG_ERROR_MESSAGES } from "../../domain/enums/catalogErrorMessages";
import { CatalogError } from "../../domain/errors/CatalogError";
import type { ProductCategoryOutput } from "../dtos/InventorySettingsDtos";
import { violatesUniqueConstraint } from "./violatesUniqueConstraint";

const NAME_COLUMN = "product_category.name";

export class ProductCategoryRepository {
  async findAll(): Promise<ProductCategoryData[]> {
    return db
      .selectFrom("product_category")
      .select([
        "id",
        "name",
        "description",
      ])
      .where("deleted_at", "is", null)
      .orderBy("name", "asc")
      .execute();
  }

  async create(data: ProductCategoryOutput): Promise<void> {
    try {
      await db
        .insertInto("product_category")
        .values({
          name: data.name,
          description: data.description,
        })
        .execute();
    } catch (error) {
      if (violatesUniqueConstraint(error, NAME_COLUMN)) {
        throw new CatalogError(CATALOG_ERROR_MESSAGES.duplicate_category);
      }
      throw error;
    }
  }

  async update(id: number, data: ProductCategoryOutput): Promise<void> {
    try {
      const result = await db
        .updateTable("product_category")
        .set({
          name: data.name,
          description: data.description,
          updated_at: new Date().toISOString(),
        })
        .where("id", "=", id)
        .where("deleted_at", "is", null)
        .executeTakeFirst();

      if (Number(result.numUpdatedRows) === 0) {
        throw new CatalogError(CATALOG_ERROR_MESSAGES.not_found);
      }
    } catch (error) {
      if (violatesUniqueConstraint(error, NAME_COLUMN)) {
        throw new CatalogError(CATALOG_ERROR_MESSAGES.duplicate_category);
      }
      throw error;
    }
  }

  /**
   * Borrado lógico. Se marca en vez de eliminar porque los productos acabarán
   * apuntando aquí: un borrado real dejaría filas huérfanas. Además, el índice
   * único es parcial sobre `deleted_at IS NULL`, así que el nombre queda libre
   * para volver a usarse.
   */
  async softDelete(id: number): Promise<void> {
    const now = new Date().toISOString();

    const result = await db
      .updateTable("product_category")
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

import { db } from "../../../db";
import type { MeasurementUnitData } from "../../domain/data/MeasurementUnitData";
import { CATALOG_ERROR_MESSAGES } from "../../domain/enums/catalogErrorMessages";
import { CatalogError } from "../../domain/errors/CatalogError";
import type { MeasurementUnitOutput } from "../dtos/InventorySettingsDtos";
import { violatesUniqueConstraint } from "./violatesUniqueConstraint";

const NAME_COLUMN = "measurement_unit.name";
const ABBREVIATION_COLUMN = "measurement_unit.abbreviation";

/** Traduce el conflicto de unicidad al error que la UI sabe explicar. */
const asCatalogError = (error: unknown): unknown => {
  if (violatesUniqueConstraint(error, ABBREVIATION_COLUMN)) {
    return new CatalogError(CATALOG_ERROR_MESSAGES.duplicate_unit_abbreviation);
  }

  if (violatesUniqueConstraint(error, NAME_COLUMN)) {
    return new CatalogError(CATALOG_ERROR_MESSAGES.duplicate_unit_name);
  }

  return error;
};

export class MeasurementUnitRepository {
  async findAll(): Promise<MeasurementUnitData[]> {
    return db
      .selectFrom("measurement_unit")
      .select([
        "id",
        "name",
        "abbreviation",
      ])
      .where("deleted_at", "is", null)
      .orderBy("name", "asc")
      .execute();
  }

  async create(data: MeasurementUnitOutput): Promise<void> {
    try {
      await db
        .insertInto("measurement_unit")
        .values({
          name: data.name,
          abbreviation: data.abbreviation,
        })
        .execute();
    } catch (error) {
      throw asCatalogError(error);
    }
  }

  async update(id: number, data: MeasurementUnitOutput): Promise<void> {
    try {
      const result = await db
        .updateTable("measurement_unit")
        .set({
          name: data.name,
          abbreviation: data.abbreviation,
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

  /** Borrado lógico, por el mismo motivo que en las categorías. */
  async softDelete(id: number): Promise<void> {
    const now = new Date().toISOString();

    const result = await db
      .updateTable("measurement_unit")
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

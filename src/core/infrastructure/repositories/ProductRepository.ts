import { type Expression, type SqlBool, sql } from "kysely";
import { db } from "../../../db";
import type {
  ProductData,
  ProductPageData,
} from "../../domain/data/ProductData";
import { INVENTORY_ERROR_MESSAGES } from "../../domain/enums/inventoryErrorMessages";
import { InventoryError } from "../../domain/errors/InventoryError";
import {
  type ProductFilters,
  type ProductOutput,
  UNCATEGORIZED_FILTER,
} from "../dtos/ProductDtos";
import { violatesUniqueConstraint } from "./violatesUniqueConstraint";

const NAME_COLUMN = "product.name";
const SKU_COLUMN = "product.sku";

/** Cómo se ve un producto en la lista de selección del catálogo. */
export type ProductOptionRecord = {
  id: number;
  name: string;
  sale_price: number;
  category_name: string | null;
};

/**
 * "Le queda poco" es el umbral propio del producto y, si no tiene, el general
 * de la configuración de inventario. Se resuelve en SQL para que el filtro
 * pueda aplicarse antes de paginar, no después de traerse las filas.
 */
const LOW_STOCK_CONDITION = sql<SqlBool>`
  product.quantity <= coalesce(
    product.min_quantity,
    (SELECT low_quantity_threshold FROM inventory_setting WHERE id = 1)
  )
`;

/**
 * Condiciones del listado. Se devuelven como fragmentos de SQL en vez de
 * encadenarse sobre el query builder para poder reutilizarlas tal cual en la
 * consulta de filas y en la del total, que no llevan los mismos JOIN.
 *
 * Los valores viajan como parámetros (`${}` de `sql`), así que lo que escriba
 * el usuario en el buscador nunca se concatena en la sentencia.
 */
const buildConditions = (
  filters: Pick<ProductFilters, "search" | "categoryId" | "onlyLow">,
): Expression<SqlBool>[] => {
  const conditions: Expression<SqlBool>[] = [
    sql<SqlBool>`product.deleted_at is null`,
  ];

  const search = filters.search.trim();

  if (search.length > 0) {
    const pattern = `%${search}%`;
    // El código entra en la búsqueda para poder pegar lo que da el escáner.
    conditions.push(
      sql<SqlBool>`(product.name like ${pattern} or ifnull(product.sku, '') like ${pattern})`,
    );
  }

  if (filters.categoryId === UNCATEGORIZED_FILTER) {
    conditions.push(sql<SqlBool>`product.category_id is null`);
  } else if (filters.categoryId !== null) {
    conditions.push(sql<SqlBool>`product.category_id = ${filters.categoryId}`);
  }

  if (filters.onlyLow) {
    conditions.push(LOW_STOCK_CONDITION);
  }

  return conditions;
};

export class ProductRepository {
  /**
   * Una página del listado ya filtrada y ordenada por nombre.
   *
   * Se pagina en SQL y no en memoria porque cada producto arrastra su foto:
   * traerse el inventario entero para enseñar cinco filas sería cargar unos
   * cuantos megas de imágenes sin necesidad.
   */
  async findPage(filters: ProductFilters): Promise<ProductPageData> {
    const conditions = buildConditions(filters);

    const rows = await db
      .selectFrom("product")
      // LEFT JOIN sin filtrar por `deleted_at`: si el dueño borra una unidad
      // o una categoría, el producto conserva la etiqueta con la que se
      // registró en vez de quedarse mudo.
      .leftJoin(
        "product_category",
        "product_category.id",
        "product.category_id",
      )
      .leftJoin(
        "measurement_unit",
        "measurement_unit.id",
        "product.measurement_unit_id",
      )
      .select([
        "product.id",
        "product.name",
        "product.description",
        "product.sku",
        "product.category_id",
        "product.measurement_unit_id",
        "product.sale_price",
        "product.cost_price",
        "product.quantity",
        "product.min_quantity",
        "product.photo",
        "product_category.name as category_name",
        "measurement_unit.name as unit_name",
        "measurement_unit.abbreviation as unit_abbreviation",
        // SQLite no tiene booleanos: llega 1 o 0 y se traduce al mapear.
        sql<number>`CASE WHEN ${LOW_STOCK_CONDITION} THEN 1 ELSE 0 END`.as(
          "is_low",
        ),
      ])
      .where((eb) => eb.and(conditions))
      .orderBy("product.name", "asc")
      .limit(filters.pageSize)
      .offset((filters.page - 1) * filters.pageSize)
      .execute();

    const counted = await db
      .selectFrom("product")
      .select((eb) => eb.fn.countAll().as("total"))
      .where((eb) => eb.and(conditions))
      .executeTakeFirst();

    return {
      items: rows.map(toProductData),
      total: Number(counted?.total ?? 0),
    };
  }

  /**
   * Los productos que cumplen el filtro, sin foto y sin paginar: es la lista
   * que se marca al armar el catálogo, y ahí solo hace falta el nombre.
   */
  async findOptions(
    filters: Pick<ProductFilters, "search" | "categoryId" | "onlyLow">,
  ): Promise<ProductOptionRecord[]> {
    return db
      .selectFrom("product")
      .leftJoin(
        "product_category",
        "product_category.id",
        "product.category_id",
      )
      .select([
        "product.id",
        "product.name",
        "product.sale_price",
        "product_category.name as category_name",
      ])
      .where((eb) => eb.and(buildConditions(filters)))
      .orderBy("product.name", "asc")
      .execute();
  }

  /** Los productos elegidos para el catálogo, ya con su foto. */
  async findByIds(ids: number[]): Promise<ProductData[]> {
    if (ids.length === 0) {
      return [];
    }

    const rows = await db
      .selectFrom("product")
      .leftJoin(
        "product_category",
        "product_category.id",
        "product.category_id",
      )
      .leftJoin(
        "measurement_unit",
        "measurement_unit.id",
        "product.measurement_unit_id",
      )
      .select([
        "product.id",
        "product.name",
        "product.description",
        "product.sku",
        "product.category_id",
        "product.measurement_unit_id",
        "product.sale_price",
        "product.cost_price",
        "product.quantity",
        "product.min_quantity",
        "product.photo",
        "product_category.name as category_name",
        "measurement_unit.name as unit_name",
        "measurement_unit.abbreviation as unit_abbreviation",
        sql<number>`CASE WHEN ${LOW_STOCK_CONDITION} THEN 1 ELSE 0 END`.as(
          "is_low",
        ),
      ])
      .where("product.id", "in", ids)
      .where("product.deleted_at", "is", null)
      .orderBy("product.name", "asc")
      .execute();

    return rows.map(toProductData);
  }

  /** Cuántos productos hay por acabarse, para el aviso de la cabecera. */
  async countLowStock(): Promise<number> {
    const counted = await db
      .selectFrom("product")
      .select((eb) => eb.fn.countAll().as("total"))
      .where((eb) =>
        eb.and(
          buildConditions({
            search: "",
            categoryId: null,
            onlyLow: true,
          }),
        ),
      )
      .executeTakeFirst();

    return Number(counted?.total ?? 0);
  }

  async create(data: ProductOutput): Promise<void> {
    try {
      await db.insertInto("product").values(data).execute();
    } catch (error) {
      throw translateConflict(error);
    }
  }

  async update(id: number, data: ProductOutput): Promise<void> {
    try {
      const result = await db
        .updateTable("product")
        .set({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .where("id", "=", id)
        .where("deleted_at", "is", null)
        .executeTakeFirst();

      if (Number(result.numUpdatedRows) === 0) {
        throw new InventoryError(INVENTORY_ERROR_MESSAGES.not_found);
      }
    } catch (error) {
      throw translateConflict(error);
    }
  }

  /**
   * Borrado lógico, como en los catálogos de configuración: las facturas
   * acabarán apuntando a estas filas y un borrado real las dejaría huérfanas.
   */
  async softDelete(id: number): Promise<void> {
    const now = new Date().toISOString();

    const result = await db
      .updateTable("product")
      .set({
        deleted_at: now,
        updated_at: now,
      })
      .where("id", "=", id)
      .where("deleted_at", "is", null)
      .executeTakeFirst();

    if (Number(result.numUpdatedRows) === 0) {
      throw new InventoryError(INVENTORY_ERROR_MESSAGES.not_found);
    }
  }

  /**
   * Deja sin categoría a los productos de una categoría que se acaba de
   * borrar. Sin esto quedarían apuntando a una fila que ya no se lista, y el
   * filtro por categoría no podría volver a encontrarlos.
   */
  async clearCategory(categoryId: number): Promise<void> {
    await db
      .updateTable("product")
      .set({
        category_id: null,
        updated_at: new Date().toISOString(),
      })
      .where("category_id", "=", categoryId)
      .where("deleted_at", "is", null)
      .execute();
  }

  /** Si alguna existencia todavía se mide con esa unidad. */
  async isUnitInUse(unitId: number): Promise<boolean> {
    const row = await db
      .selectFrom("product")
      .select("id")
      .where("measurement_unit_id", "=", unitId)
      .where("deleted_at", "is", null)
      .limit(1)
      .executeTakeFirst();

    return row !== undefined;
  }
}

type ProductRow = Omit<
  ProductData,
  "is_low" | "unit_name" | "unit_abbreviation"
> & {
  is_low: number;
  unit_name: string | null;
  unit_abbreviation: string | null;
};

const toProductData = (row: ProductRow): ProductData => ({
  ...row,
  // La unidad es obligatoria en la tabla, pero el LEFT JOIN la tipa como
  // opcional: si la fila se hubiera perdido, mejor un guion que un hueco.
  unit_name: row.unit_name ?? "",
  unit_abbreviation: row.unit_abbreviation ?? "",
  is_low: row.is_low === 1,
});

const translateConflict = (error: unknown): unknown => {
  if (violatesUniqueConstraint(error, NAME_COLUMN)) {
    return new InventoryError(INVENTORY_ERROR_MESSAGES.duplicate_product);
  }

  if (violatesUniqueConstraint(error, SKU_COLUMN)) {
    return new InventoryError(INVENTORY_ERROR_MESSAGES.duplicate_sku);
  }

  return error;
};

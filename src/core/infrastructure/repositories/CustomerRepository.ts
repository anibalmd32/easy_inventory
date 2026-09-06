import { type Expression, type SqlBool, sql } from "kysely";
import { db } from "../../../db";
import type {
  CustomerData,
  CustomerPageData,
} from "../../domain/data/CustomerData";
import { DEBT_STATUS } from "../../domain/enums/debts";
import { SALES_ERROR_MESSAGES } from "../../domain/enums/salesErrorMessages";
import { SalesError } from "../../domain/errors/SalesError";
import type { CustomerFilters, CustomerOutput } from "../dtos/CustomerDtos";
import { violatesUniqueConstraint } from "./violatesUniqueConstraint";

const DOCUMENT_COLUMN = "customer.document";

/**
 * Lo que este cliente debe ahora mismo: la suma de lo que queda por pagar de
 * sus deudas abiertas.
 *
 * Se resuelve en SQL y no trayéndose las deudas para sumarlas en memoria
 * porque es justo el número que hay que mirar antes de fiarle otra vez, y se
 * pide en cada búsqueda del cajero.
 */
const OPEN_DEBT = sql<number>`
  coalesce((
    SELECT sum(debt.original_amount_usd - debt.paid_amount_usd)
    FROM debt
    WHERE debt.customer_id = customer.id
      AND debt.status = ${DEBT_STATUS.OPEN}
  ), 0)
`;

const buildConditions = (search: string): Expression<SqlBool>[] => {
  const conditions: Expression<SqlBool>[] = [
    sql<SqlBool>`customer.deleted_at is null`,
  ];

  const trimmed = search.trim();

  if (trimmed.length > 0) {
    const pattern = `%${trimmed}%`;
    // El documento y el teléfono entran en la búsqueda: al cajero le suele
    // ser más rápido teclear la cédula que el nombre completo.
    conditions.push(
      sql<SqlBool>`(
        customer.name like ${pattern}
        or ifnull(customer.document, '') like ${pattern}
        or ifnull(customer.phone, '') like ${pattern}
      )`,
    );
  }

  return conditions;
};

export class CustomerRepository {
  /** Una página del buscador de clientes, con lo que debe cada uno. */
  async findPage(filters: CustomerFilters): Promise<CustomerPageData> {
    const conditions = buildConditions(filters.search);

    const items = await db
      .selectFrom("customer")
      .select([
        "customer.id",
        "customer.name",
        "customer.document",
        "customer.phone",
        "customer.notes",
        OPEN_DEBT.as("open_debt_usd"),
      ])
      .where((eb) => eb.and(conditions))
      .orderBy("customer.name", "asc")
      .limit(filters.pageSize)
      .offset((filters.page - 1) * filters.pageSize)
      .execute();

    const counted = await db
      .selectFrom("customer")
      .select((eb) => eb.fn.countAll().as("total"))
      .where((eb) => eb.and(conditions))
      .executeTakeFirst();

    return {
      items,
      total: Number(counted?.total ?? 0),
    };
  }

  async findById(id: number): Promise<CustomerData | null> {
    const row = await db
      .selectFrom("customer")
      .select([
        "customer.id",
        "customer.name",
        "customer.document",
        "customer.phone",
        "customer.notes",
        OPEN_DEBT.as("open_debt_usd"),
      ])
      .where("customer.id", "=", id)
      .where("customer.deleted_at", "is", null)
      .executeTakeFirst();

    return row ?? null;
  }

  /** Devuelve el id para poder seleccionarlo en la venta que se está armando. */
  async create(data: CustomerOutput): Promise<number> {
    try {
      const result = await db
        .insertInto("customer")
        .values(data)
        .executeTakeFirstOrThrow();

      return Number(result.insertId);
    } catch (error) {
      throw translateConflict(error);
    }
  }

  async update(id: number, data: CustomerOutput): Promise<void> {
    try {
      const result = await db
        .updateTable("customer")
        .set({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .where("id", "=", id)
        .where("deleted_at", "is", null)
        .executeTakeFirst();

      if (Number(result.numUpdatedRows) === 0) {
        throw new SalesError(SALES_ERROR_MESSAGES.customer_not_found);
      }
    } catch (error) {
      throw translateConflict(error);
    }
  }

  /**
   * Borrado lógico: las ventas y las deudas apuntan aquí, y un borrado real
   * las dejaría huérfanas.
   */
  async softDelete(id: number): Promise<void> {
    const now = new Date().toISOString();

    const result = await db
      .updateTable("customer")
      .set({
        deleted_at: now,
        updated_at: now,
      })
      .where("id", "=", id)
      .where("deleted_at", "is", null)
      .executeTakeFirst();

    if (Number(result.numUpdatedRows) === 0) {
      throw new SalesError(SALES_ERROR_MESSAGES.customer_not_found);
    }
  }
}

const translateConflict = (error: unknown): unknown => {
  // SQLite nombra la COLUMNA, no el índice: buscar "idx_customer_document"
  // no coincidiría nunca.
  if (violatesUniqueConstraint(error, DOCUMENT_COLUMN)) {
    return new SalesError(SALES_ERROR_MESSAGES.duplicate_customer_document);
  }

  return error;
};

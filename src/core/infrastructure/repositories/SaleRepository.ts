import { type Expression, type SqlBool, sql, type Transaction } from "kysely";
import { db } from "../../../db";
import { formatInvoiceNumber } from "../../../utils/invoiceNumber";
import type { DatabaseSchema } from "../../domain/DatabaseSchema";
import type {
  CashUpData,
  SaleData,
  SaleItemData,
  SalePageData,
  SalePaymentData,
} from "../../domain/data/SaleData";
import type { CURRENCY } from "../../domain/enums/currencies";
import { DEBT_STATUS } from "../../domain/enums/debts";
import { SALE_STATUS, type SALE_TYPE } from "../../domain/enums/sales";
import { SALES_ERROR_MESSAGES } from "../../domain/enums/salesErrorMessages";
import { SalesError } from "../../domain/errors/SalesError";
import type { SaleFilters } from "../dtos/SaleDtos";
import { violatesUniqueConstraint } from "./violatesUniqueConstraint";

/** Una línea de la venta, con el total ya calculado por el servicio. */
export type SaleLineRecord = {
  product_id: number | null;
  product_name: string;
  unit_abbreviation: string;
  quantity: number;
  unit_price_usd: number;
  unit_cost_usd: number;
  line_total_usd: number;
};

/** Un cobro, con el equivalente en dólares ya resuelto por el servicio. */
export type SalePaymentRecord = {
  payment_method_id: number | null;
  payment_method_name: string;
  currency: CURRENCY;
  amount: number;
  amount_usd: number;
  reference: string | null;
};

/** La deuda que deja una venta fiada. */
export type SaleDebtRecord = {
  customer_id: number;
  original_amount_usd: number;
  due_date: string;
};

/** Todo lo que hace falta para escribir una venta de una sentada. */
export type IssueSaleRecord = {
  customer_id: number | null;
  user_id: number;
  sale_type: SALE_TYPE;
  subtotal_usd: number;
  discount_usd: number;
  total_usd: number;
  exchange_rate: number | null;
  change_usd: number;
  change_currency: CURRENCY;
  items: SaleLineRecord[];
  payments: SalePaymentRecord[];
  /** `null` salvo en la venta fiada. */
  debt: SaleDebtRecord | null;
};

/** La venta recién emitida, lo justo para poder enseñar el recibo. */
export type IssuedSaleRecord = {
  id: number;
  invoice_number: string;
};

const INVOICE_NUMBER_COLUMN = "sale.invoice_number";

/** Cuántas veces se reintenta coger el correlativo antes de rendirse. */
const CLAIM_ATTEMPTS = 5;

/**
 * `created_at` se guarda en UTC (lo pone el `DEFAULT CURRENT_TIMESTAMP` de
 * SQLite) y se lee ya convertido a hora local.
 *
 * Es imprescindible: sin el `localtime`, una venta de las nueve de la noche en
 * Venezuela se guarda como la una de la madrugada del día siguiente en UTC, y
 * tanto el historial del día como el cierre de caja la contarían mañana. El
 * formato con "T" y sin zona es el que `new Date()` interpreta como local, que
 * es justo lo que la pantalla necesita.
 */
const LOCAL_CREATED_AT = sql<string>`
  strftime('%Y-%m-%dT%H:%M:%S', sale.created_at, 'localtime')
`;

/** El día local de la venta, para filtrar por "hoy". */
const LOCAL_DAY = sql<string>`date(sale.created_at, 'localtime')`;

const buildConditions = (
  filters: Pick<SaleFilters, "day" | "userId">,
): Expression<SqlBool>[] => {
  const conditions: Expression<SqlBool>[] = [
    sql<SqlBool>`${LOCAL_DAY} = ${filters.day}`,
  ];

  if (filters.userId !== null) {
    conditions.push(sql<SqlBool>`sale.user_id = ${filters.userId}`);
  }

  return conditions;
};

export class SaleRepository {
  /**
   * Escribe la venta entera: la factura, sus líneas, sus cobros, el descuento
   * del inventario, la deuda si fue fiada y el avance del correlativo.
   *
   * Nota, igual que en `UserRepository.storeUser`: `tauri-plugin-sql` manda
   * cada sentencia a un pool de sqlx, así que el BEGIN/COMMIT de Kysely no
   * está atado a una conexión concreta. Con las escrituras encadenadas de
   * forma secuencial —como aquí— el pool reutiliza la misma conexión y la
   * transacción funciona, pero no hay garantía formal. Por eso el correlativo
   * NO se protege con la transacción sino con un compare-and-swap sobre
   * `pos_setting`, que es correcto pase lo que pase con la conexión.
   */
  async createSale(record: IssueSaleRecord): Promise<IssuedSaleRecord> {
    return db.transaction().execute(async (trx) => {
      const invoice = await claimInvoiceNumber(trx);
      const now = new Date().toISOString();

      let saleId: number;

      try {
        const inserted = await trx
          .insertInto("sale")
          .values({
            invoice_number: invoice.number,
            invoice_serial: invoice.serial,
            customer_id: record.customer_id,
            user_id: record.user_id,
            status: SALE_STATUS.ISSUED,
            sale_type: record.sale_type,
            subtotal_usd: record.subtotal_usd,
            discount_usd: record.discount_usd,
            total_usd: record.total_usd,
            exchange_rate: record.exchange_rate,
            change_usd: record.change_usd,
            change_currency: record.change_currency,
            voided_at: null,
            voided_by_user_id: null,
            void_reason: null,
          })
          .executeTakeFirstOrThrow();

        saleId = Number(inserted.insertId);
      } catch (error) {
        // El dueño puede haber retrocedido el correlativo a mano en los
        // ajustes; entonces el número ya estaba usado.
        if (violatesUniqueConstraint(error, INVOICE_NUMBER_COLUMN)) {
          throw new SalesError(SALES_ERROR_MESSAGES.invoice_number_taken);
        }

        throw error;
      }

      for (const item of record.items) {
        await trx
          .insertInto("sale_item")
          .values({
            sale_id: saleId,
            product_id: item.product_id,
            product_name: item.product_name,
            unit_abbreviation: item.unit_abbreviation,
            quantity: item.quantity,
            unit_price_usd: item.unit_price_usd,
            unit_cost_usd: item.unit_cost_usd,
            line_total_usd: item.line_total_usd,
          })
          .execute();

        if (item.product_id === null) {
          continue;
        }

        // Puede dejar la existencia en negativo, y es a propósito (migración
        // 13): el negativo es la señal de que ese producto hay que recontarlo.
        // El `round` evita arrastrar el polvo de la coma flotante al restar
        // cantidades decimales.
        await trx
          .updateTable("product")
          .set({
            quantity: sql<number>`round(product.quantity - ${item.quantity}, 3)`,
            updated_at: now,
          })
          .where("id", "=", item.product_id)
          .execute();
      }

      for (const payment of record.payments) {
        await trx
          .insertInto("sale_payment")
          .values({
            sale_id: saleId,
            payment_method_id: payment.payment_method_id,
            payment_method_name: payment.payment_method_name,
            currency: payment.currency,
            amount: payment.amount,
            amount_usd: payment.amount_usd,
            reference: payment.reference,
          })
          .execute();
      }

      if (record.debt) {
        // La deuda se escribe aquí y no en un repositorio propio porque tiene
        // que caer dentro de la misma transacción que la venta: una venta
        // fiada sin su deuda es mercancía regalada.
        await trx
          .insertInto("debt")
          .values({
            customer_id: record.debt.customer_id,
            sale_id: saleId,
            user_id: record.user_id,
            original_amount_usd: record.debt.original_amount_usd,
            paid_amount_usd: 0,
            status: DEBT_STATUS.OPEN,
            due_date: record.debt.due_date,
          })
          .execute();
      }

      return {
        id: saleId,
        invoice_number: invoice.number,
      };
    });
  }

  /**
   * Anula una venta y devuelve la mercancía al inventario. Si era fiada,
   * cancela también su deuda.
   */
  async voidSale(
    saleId: number,
    userId: number,
    reason: string | null,
  ): Promise<void> {
    await db.transaction().execute(async (trx) => {
      const sale = await trx
        .selectFrom("sale")
        .select([
          "id",
          "status",
        ])
        .where("id", "=", saleId)
        .executeTakeFirst();

      if (!sale) {
        throw new SalesError(SALES_ERROR_MESSAGES.sale_not_found);
      }

      if (sale.status === SALE_STATUS.VOIDED) {
        throw new SalesError(SALES_ERROR_MESSAGES.already_voided);
      }

      const now = new Date().toISOString();

      await trx
        .updateTable("sale")
        .set({
          status: SALE_STATUS.VOIDED,
          voided_at: now,
          voided_by_user_id: userId,
          void_reason: reason,
          updated_at: now,
        })
        .where("id", "=", saleId)
        .execute();

      const items = await trx
        .selectFrom("sale_item")
        .select([
          "product_id",
          "quantity",
        ])
        .where("sale_id", "=", saleId)
        .execute();

      for (const item of items) {
        if (item.product_id === null) {
          continue;
        }

        await trx
          .updateTable("product")
          .set({
            quantity: sql<number>`round(product.quantity + ${item.quantity}, 3)`,
            updated_at: now,
          })
          .where("id", "=", item.product_id)
          .execute();
      }

      // Anular la venta anula lo que se debía por ella. Los abonos ya hechos
      // los resuelve el módulo de deudas: aquí solo se cierra la deuda.
      await trx
        .updateTable("debt")
        .set({
          status: DEBT_STATUS.CANCELLED,
          updated_at: now,
        })
        .where("sale_id", "=", saleId)
        .where("status", "=", DEBT_STATUS.OPEN)
        .execute();
    });
  }

  /** Una página del historial de un día. */
  async findPage(filters: SaleFilters): Promise<SalePageData> {
    const conditions = buildConditions(filters);

    const rows = await db
      .selectFrom("sale")
      .leftJoin("customer", "customer.id", "sale.customer_id")
      .innerJoin("user", "user.id", "sale.user_id")
      .innerJoin("user_profile", "user_profile.id", "user.profile_id")
      .select([
        "sale.id",
        "sale.invoice_number",
        "sale.status",
        "sale.sale_type",
        "sale.total_usd",
        "customer.name as customer_name",
        LOCAL_CREATED_AT.as("created_at"),
        sql<string>`user_profile.name || ' ' || user_profile.last_name`.as(
          "seller_name",
        ),
        sql<number>`(
          SELECT count(*) FROM sale_item WHERE sale_item.sale_id = sale.id
        )`.as("item_count"),
      ])
      .where((eb) => eb.and(conditions))
      // Lo último vendido arriba: es lo que el cajero acaba de hacer y lo que
      // más falta le hace comprobar o reimprimir.
      .orderBy("sale.id", "desc")
      .limit(filters.pageSize)
      .offset((filters.page - 1) * filters.pageSize)
      .execute();

    const counted = await db
      .selectFrom("sale")
      .select((eb) => eb.fn.countAll().as("total"))
      .where((eb) => eb.and(conditions))
      .executeTakeFirst();

    return {
      items: rows,
      total: Number(counted?.total ?? 0),
    };
  }

  /** La venta entera, con sus líneas y sus cobros: lo que necesita el recibo. */
  async findById(saleId: number): Promise<SaleData | null> {
    const sale = await db
      .selectFrom("sale")
      .leftJoin("customer", "customer.id", "sale.customer_id")
      .innerJoin("user", "user.id", "sale.user_id")
      .innerJoin("user_profile", "user_profile.id", "user.profile_id")
      // La deuda que dejó la venta, si fue fiada. Es un LEFT JOIN y no una
      // resta de los cobros porque en cuanto el módulo de deudas registre un
      // abono, la resta dejaría de dar lo que se fio.
      .leftJoin("debt", (join) =>
        join
          .onRef("debt.sale_id", "=", "sale.id")
          .on("debt.status", "!=", DEBT_STATUS.CANCELLED),
      )
      .select([
        "sale.id",
        "sale.invoice_number",
        "sale.invoice_serial",
        "sale.customer_id",
        "sale.user_id",
        "sale.status",
        "sale.sale_type",
        "sale.subtotal_usd",
        "sale.discount_usd",
        "sale.total_usd",
        "sale.exchange_rate",
        "sale.change_usd",
        "sale.change_currency",
        "sale.voided_at",
        "sale.voided_by_user_id",
        "sale.void_reason",
        "customer.name as customer_name",
        "customer.document as customer_document",
        "customer.phone as customer_phone",
        "debt.original_amount_usd as debt_amount_usd",
        "debt.due_date as debt_due_date",
        LOCAL_CREATED_AT.as("created_at"),
        sql<string>`user_profile.name || ' ' || user_profile.last_name`.as(
          "seller_name",
        ),
      ])
      .where("sale.id", "=", saleId)
      .executeTakeFirst();

    if (!sale) {
      return null;
    }

    const items: SaleItemData[] = await db
      .selectFrom("sale_item")
      .select([
        "id",
        "product_id",
        "product_name",
        "unit_abbreviation",
        "quantity",
        "unit_price_usd",
        "unit_cost_usd",
        "line_total_usd",
      ])
      .where("sale_id", "=", saleId)
      .orderBy("id", "asc")
      .execute();

    const payments: SalePaymentData[] = await db
      .selectFrom("sale_payment")
      .select([
        "id",
        "payment_method_id",
        "payment_method_name",
        "currency",
        "amount",
        "amount_usd",
        "reference",
      ])
      .where("sale_id", "=", saleId)
      .orderBy("id", "asc")
      .execute();

    return {
      ...sale,
      items,
      payments,
    };
  }

  /**
   * El cierre de caja de un día: cuánto se vendió y cuánto debería haber en la
   * gaveta, desglosado por forma de pago.
   */
  async cashUp(
    filters: Pick<SaleFilters, "day" | "userId">,
  ): Promise<CashUpData> {
    const conditions = buildConditions(filters);
    const issued = [
      ...conditions,
      sql<SqlBool>`sale.status = ${SALE_STATUS.ISSUED}`,
    ];

    const totals = await db
      .selectFrom("sale")
      .select([
        sql<number>`count(*)`.as("sales_count"),
        sql<number>`coalesce(sum(CASE WHEN sale.status = ${SALE_STATUS.VOIDED} THEN 1 ELSE 0 END), 0)`.as(
          "voided_count",
        ),
        sql<number>`coalesce(sum(CASE WHEN sale.status = ${SALE_STATUS.ISSUED} THEN sale.total_usd ELSE 0 END), 0)`.as(
          "total_usd",
        ),
        sql<number>`coalesce(sum(CASE WHEN sale.status = ${SALE_STATUS.ISSUED} THEN sale.change_usd ELSE 0 END), 0)`.as(
          "change_usd",
        ),
      ])
      .where((eb) => eb.and(conditions))
      .executeTakeFirst();

    // Lo fiado es el total de las ventas a crédito menos lo que el cliente
    // abonó en el momento: eso último ya está contado en las formas de pago.
    const credit = await db
      .selectFrom("debt")
      .innerJoin("sale", "sale.id", "debt.sale_id")
      .select(
        sql<number>`coalesce(sum(debt.original_amount_usd), 0)`.as(
          "credit_usd",
        ),
      )
      .where((eb) => eb.and(issued))
      .where("debt.status", "!=", DEBT_STATUS.CANCELLED)
      .executeTakeFirst();

    const methods = await db
      .selectFrom("sale_payment")
      .innerJoin("sale", "sale.id", "sale_payment.sale_id")
      .select([
        "sale_payment.payment_method_name",
        "sale_payment.currency",
        sql<number>`sum(sale_payment.amount)`.as("amount"),
        sql<number>`sum(sale_payment.amount_usd)`.as("amount_usd"),
      ])
      .where((eb) => eb.and(issued))
      .groupBy([
        "sale_payment.payment_method_name",
        "sale_payment.currency",
      ])
      .orderBy("sale_payment.payment_method_name", "asc")
      .execute();

    return {
      sales_count: Number(totals?.sales_count ?? 0),
      voided_count: Number(totals?.voided_count ?? 0),
      total_usd: Number(totals?.total_usd ?? 0),
      credit_usd: Number(credit?.credit_usd ?? 0),
      change_usd: Number(totals?.change_usd ?? 0),
      methods,
    };
  }
}

/**
 * Coge el próximo número de factura y avanza el correlativo.
 *
 * El `where` sobre `invoice_next_number` es un compare-and-swap: si otra venta
 * se adelantó, el UPDATE no toca ninguna fila y se vuelve a intentar con el
 * número nuevo. Es lo que cierra la carrera de verdad, sin depender de que la
 * transacción esté atada a una conexión.
 */
const claimInvoiceNumber = async (
  trx: Transaction<DatabaseSchema>,
): Promise<{
  serial: number;
  number: string;
}> => {
  for (let attempt = 0; attempt < CLAIM_ATTEMPTS; attempt++) {
    const setting = await trx
      .selectFrom("pos_setting")
      .select([
        "invoice_prefix",
        "invoice_next_number",
      ])
      .where("id", "=", 1)
      .executeTakeFirst();

    if (!setting) {
      throw new SalesError(SALES_ERROR_MESSAGES.invoice_number_taken);
    }

    const serial = setting.invoice_next_number;

    const claimed = await trx
      .updateTable("pos_setting")
      .set({
        invoice_next_number: serial + 1,
        updated_at: new Date().toISOString(),
      })
      .where("id", "=", 1)
      .where("invoice_next_number", "=", serial)
      .executeTakeFirst();

    if (Number(claimed.numUpdatedRows) === 1) {
      return {
        serial,
        number: formatInvoiceNumber(setting.invoice_prefix, serial),
      };
    }
  }

  throw new SalesError(SALES_ERROR_MESSAGES.invoice_number_taken);
};

import { db } from "../../../db";
import type { ExchangeRateData } from "../../domain/data/ExchangeRateData";

export class ExchangeRateRepository {
  /** La tasa vigente es la fila más reciente; `null` si aún no hay ninguna. */
  async findCurrent(): Promise<ExchangeRateData | null> {
    return (
      (await db
        .selectFrom("exchange_rate")
        .select([
          "id",
          "rate",
          "created_at",
        ])
        .orderBy("id", "desc")
        .limit(1)
        .executeTakeFirst()) ?? null
    );
  }

  /** Historial completo, del cambio más reciente al más antiguo. */
  async findHistory(): Promise<ExchangeRateData[]> {
    return db
      .selectFrom("exchange_rate")
      .select([
        "id",
        "rate",
        "created_at",
      ])
      .orderBy("id", "desc")
      .execute();
  }

  /**
   * Registra una tasa nueva. Si es idéntica a la vigente no escribe nada:
   * un "cambio" que no cambia nada solo ensuciaría el historial.
   */
  async create(rate: number): Promise<void> {
    const current = await this.findCurrent();

    if (current && current.rate === rate) {
      return;
    }

    await db
      .insertInto("exchange_rate")
      .values({
        rate,
      })
      .execute();
  }
}

import Database from "@tauri-apps/plugin-sql";
import { Kysely } from "kysely";
import { TauriSqliteDialect } from "kysely-dialect-tauri";
import type { DatabaseSchema } from "./core/domain/DatabaseSchema";

export const db = new Kysely<DatabaseSchema>({
  dialect: new TauriSqliteDialect({
    database: async (prefix) => {
      return Database.load(`${prefix}easy_inventory_storage.db`);
    },
  }),
});

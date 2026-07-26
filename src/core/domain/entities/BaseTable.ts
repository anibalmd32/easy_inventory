import type { Generated } from "kysely";

/**
 * Columnas que SQLite rellena solo en todas nuestras tablas.
 * `Generated` le dice a Kysely que son opcionales al insertar pero que
 * siempre vienen con valor al seleccionar.
 */
export type BaseTable = {
  id: Generated<number>;
  created_at: Generated<string>;
  updated_at: Generated<string>;
  deleted_at: Generated<string | null>;
};

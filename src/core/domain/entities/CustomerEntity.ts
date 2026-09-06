/**
 * Una fila de `customer` tal como vive en SQLite (migración 14).
 *
 * El cliente es opcional en una venta de mostrador y obligatorio en una venta
 * fiada: es la fila a la que el módulo de deudas le cuelga lo que se debe.
 */
export type CustomerEntity = {
  name: string;
  /** Cédula o RIF. Opcional, pero único entre los que lo tienen. */
  document: string | null;
  phone: string | null;
  /** Nota libre del dueño ("el del taller de la esquina"). */
  notes: string | null;
};

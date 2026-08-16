/**
 * Detecta si un error de SQLite viene de romper una restricción de unicidad
 * sobre una columna concreta.
 *
 * El `qualifier` es `tabla.columna`, no el nombre del índice: aunque la
 * unicidad se declare con un índice con nombre, SQLite informa el conflicto
 * citando la columna (`UNIQUE constraint failed: product_category.name`).
 * Buscar el nombre del índice no encontraría nada nunca.
 */
export const violatesUniqueConstraint = (
  error: unknown,
  qualifier: string,
): boolean => {
  const description =
    error instanceof Error ? error.message : String(error ?? "");

  return (
    description.includes("UNIQUE constraint failed") &&
    description.includes(qualifier)
  );
};

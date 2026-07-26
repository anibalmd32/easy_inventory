/**
 * Nombres de rol tal cual quedan sembrados por la migración
 * `03_roles_and_permissions.sql`. También son el segmento `$role` de las
 * rutas, así que cambiarlos aquí obliga a cambiarlos en la migración.
 */
export enum ROLES {
  SUPERADMIN = "superadmin",
  ADMIN = "admin",
  ACCOUNTANT = "contador",
  SELLER = "vendedor",
}

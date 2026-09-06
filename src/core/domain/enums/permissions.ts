/**
 * Nombres de permiso tal cual quedan sembrados por la migración
 * `03_roles_and_permissions.sql`. Cambiar uno aquí obliga a cambiarlo allá:
 * la sesión guarda estos nombres y la UI se apoya en ellos para decidir qué
 * botones enseña.
 */
export enum PERMISSIONS {
  INVENTORY_VIEW = "inventory.view",
  INVENTORY_CREATE = "inventory.create",
  INVENTORY_UPDATE = "inventory.update",
  INVENTORY_DELETE = "inventory.delete",
  INVOICING_VIEW = "invoicing.view",
  INVOICING_CREATE = "invoicing.create",
  INVOICING_UPDATE = "invoicing.update",
  INVOICING_DELETE = "invoicing.delete",
  DEBTS_VIEW = "debts.view",
  DEBTS_CREATE = "debts.create",
  DEBTS_UPDATE = "debts.update",
  DEBTS_DELETE = "debts.delete",
  REPORTS_VIEW = "reports.view",
  USERS_VIEW = "users.view",
  USERS_CREATE = "users.create",
  USERS_UPDATE = "users.update",
  USERS_DELETE = "users.delete",
  ROLES_VIEW = "roles.view",
  ROLES_MANAGE = "roles.manage",
  SETTINGS_VIEW = "settings.view",
  SETTINGS_MANAGE = "settings.manage",
}

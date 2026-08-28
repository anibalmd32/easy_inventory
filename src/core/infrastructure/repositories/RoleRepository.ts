import { db } from "../../../db";
import type { RoleData } from "../../domain/data/RoleData";

export class RoleRepository {
  /**
   * Los roles con sus permisos y cuánta gente los tiene asignados.
   *
   * Se resuelve en tres consultas y se une en memoria, en vez de con un JOIN
   * que multiplicaría las filas: son cuatro roles y una veintena de permisos,
   * así que no compensa la complejidad de desduplicar.
   */
  async findAllWithPermissions(): Promise<RoleData[]> {
    const roles = await db
      .selectFrom("role")
      .select([
        "id",
        "name",
        "description",
      ])
      .where("deleted_at", "is", null)
      .orderBy("id", "asc")
      .execute();

    const permissions = await db
      .selectFrom("role_permission")
      .innerJoin("permission", "permission.id", "role_permission.permission_id")
      .select([
        "role_permission.role_id as role_id",
        "permission.name as name",
        "permission.description as description",
      ])
      .where("role_permission.deleted_at", "is", null)
      .where("permission.deleted_at", "is", null)
      .orderBy("permission.name", "asc")
      .execute();

    const counts = await db
      .selectFrom("user_role")
      .innerJoin("user", "user.id", "user_role.user_id")
      .select((eb) => [
        "user_role.role_id as role_id",
        eb.fn.countAll<number>().as("total"),
      ])
      .where("user.deleted_at", "is", null)
      .groupBy("user_role.role_id")
      .execute();

    const totalByRole = new Map(
      counts.map((row) => [
        row.role_id,
        row.total,
      ]),
    );

    return roles.map((role) => ({
      name: role.name,
      description: role.description,
      totalAssignedUsers: Number(totalByRole.get(role.id) ?? 0),
      permissions: permissions
        .filter((permission) => permission.role_id === role.id)
        .map((permission) => ({
          name: permission.name,
          description: permission.description,
        })),
    }));
  }

  /** Permisos de un rol con su descripción legible, para mostrarlos. */
  async findPermissionsByRoleName(roleName: string) {
    return db
      .selectFrom("role")
      .innerJoin("role_permission", "role_permission.role_id", "role.id")
      .innerJoin("permission", "permission.id", "role_permission.permission_id")
      .select([
        "permission.name as name",
        "permission.description as description",
      ])
      .where("role.name", "=", roleName)
      .where("role_permission.deleted_at", "is", null)
      .where("permission.deleted_at", "is", null)
      .orderBy("permission.name", "asc")
      .execute();
  }

  async findIdByName(name: string): Promise<number | null> {
    const row = await db
      .selectFrom("role")
      .select("id")
      .where("name", "=", name)
      .where("deleted_at", "is", null)
      .executeTakeFirst();

    return row?.id ?? null;
  }
}

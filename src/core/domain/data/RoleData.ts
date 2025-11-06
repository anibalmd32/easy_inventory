import type { RoleEntity } from "../entities/RoleEntity";
import type { PermissionData } from "./PermissionData";

export type RoleData = RoleEntity & {
  permissions: PermissionData[];
  totalAssignedUsers: number;
};

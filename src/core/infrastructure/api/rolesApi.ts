import { apiFetch } from "../../../libs/api";
import type { RoleData } from "../../domain/data/RoleData";

export function fetchRoles(): Promise<RoleData[]> {
  return apiFetch<RoleData[]>("/api/roles");
}

import { queryOptions } from "@tanstack/react-query";
import { RoleRepository } from "../../infrastructure/repositories/RoleRepository";

const roleRepository = new RoleRepository();

export const profileKeys = {
  all: [
    "profile",
  ] as const,
  permissions: (roleName: string) =>
    [
      "profile",
      "permissions",
      roleName,
    ] as const,
};

/**
 * Los permisos del rol de la sesión, con su descripción legible. La sesión
 * solo guarda los nombres técnicos (`inventory.view`), que no sirven para
 * enseñárselos a nadie.
 */
export const myPermissionsQueryOptions = (roleName: string) =>
  queryOptions({
    queryKey: profileKeys.permissions(roleName),
    queryFn: () => roleRepository.findPermissionsByRoleName(roleName),
    staleTime: Number.POSITIVE_INFINITY,
  });

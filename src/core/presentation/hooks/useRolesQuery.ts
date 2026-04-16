import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../libs/queryKeys";
import { fetchRoles } from "../../infrastructure/api/rolesApi";

export function useRolesQuery() {
  return useQuery({
    queryKey: queryKeys.roles.all,
    queryFn: fetchRoles,
  });
}

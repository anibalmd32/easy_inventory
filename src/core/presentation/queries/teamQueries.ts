import { queryOptions } from "@tanstack/react-query";
import { teamService } from "../../infrastructure/container";

export const teamKeys = {
  all: [
    "team",
  ] as const,
  members: [
    "team",
    "members",
  ] as const,
  roles: [
    "team",
    "roles",
  ] as const,
};

export const teamMembersQueryOptions = queryOptions({
  queryKey: teamKeys.members,
  queryFn: () => teamService.listMembers(),
});

export const teamRolesQueryOptions = queryOptions({
  queryKey: teamKeys.roles,
  queryFn: () => teamService.listRoles(),
});

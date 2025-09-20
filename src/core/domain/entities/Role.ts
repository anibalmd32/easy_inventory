import type { Permission } from "./Permission";

export type Role = {
  name: string;
  permissions: Permission[];
  description?: string;
};

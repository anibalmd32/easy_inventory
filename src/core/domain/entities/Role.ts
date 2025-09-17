import type { BaseEntity } from "./BaseEntity";
import type { Permission } from "./Permission";

export type Role = BaseEntity & {
  name: string;
  permissions: Permission[];
  description?: string;
};

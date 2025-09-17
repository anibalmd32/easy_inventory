import type { BaseEntity } from "./BaseEntity";

export type Permission = BaseEntity & {
  name: string;
  description?: string;
};

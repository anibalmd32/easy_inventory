import type { BaseEntity } from "./BaseEntity";

export type UserProfile = BaseEntity & {
  name: string;
  last_name: string;
  avatar_url?: string;
};

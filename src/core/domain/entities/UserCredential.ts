import type { BaseEntity } from "./BaseEntity";

export type UserCredential = BaseEntity & {
  email: string;
  password_hash: string;
};

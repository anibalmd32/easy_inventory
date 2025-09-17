import type { BaseEntity } from "./BaseEntity";

export type UserSettings = BaseEntity & {
  theme: string;
  language: string;
};

import type { BaseEntity } from "../entities/BaseEntity";
import type { UserSessionEntity } from "../entities/UserSessionEntity";
import type { UserData } from "./UserData";

export type UserSessionData = BaseEntity &
  Omit<UserSessionEntity, "user_id"> & {
    user: UserData;
  };

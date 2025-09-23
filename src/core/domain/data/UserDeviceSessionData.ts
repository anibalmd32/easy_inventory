import type { BaseEntity } from "../entities/BaseEntity";
import type { UserDeviceSessionEntity } from "../entities/UserDeviceSessionEntity";
import type { UserSessionData } from "./UserSessionData";

export type UserDeviceSessionData = BaseEntity &
  Omit<UserDeviceSessionEntity, "user_session_id"> & {
    user_session: UserSessionData;
  };

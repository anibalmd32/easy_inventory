import type { BaseEntity } from "./BaseEntity";
import type { UserDeviceSession } from "./UserDeviceSession";

export type UserSession = BaseEntity & {
  user_id: string;
  token: string;
  expires_at: string;
  active_devices: UserDeviceSession[];
};

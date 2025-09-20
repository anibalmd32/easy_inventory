import type { UserDeviceSession } from "./UserDeviceSession";

export type UserSession = {
  user_id: string;
  token: string;
  expires_at: string;
  active_devices: UserDeviceSession[];
};

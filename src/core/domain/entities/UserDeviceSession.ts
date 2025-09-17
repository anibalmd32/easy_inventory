import type { BaseEntity } from "./BaseEntity";

export type UserDeviceSession = BaseEntity & {
  device_id: string;
  device_type: string;
  ip_address: string;
  last_active_at: string;
};

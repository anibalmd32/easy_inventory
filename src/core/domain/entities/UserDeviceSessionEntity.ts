export type UserDeviceSessionEntity = {
  user_session_id: number;
  device_type: string;
  ip_address: string;
  last_active_at: string;
  user_agent?: string;
};

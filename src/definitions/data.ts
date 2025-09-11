export type CommonProps = {
  id: string;
  created_at: string;
  updated_at: string;
};

// Users authentication and authorization
export type Permission = CommonProps & {
  name: string;
  description?: string;
};

export type Role = CommonProps & {
  name: string;
  permissions: Permission[];
  description?: string;
};

export type UserCredential = CommonProps & {
  email: string;
  password_hash: string;
};

export type UserSettings = CommonProps & {
  theme: string;
  language: string;
};

export type UserProfile = CommonProps & {
  name: string;
  last_name: string;
  avatar_url?: string;
};

export type UserDeviceSession = CommonProps & {
  device_id: string;
  device_type: string;
  ip_address: string;
  last_active_at: string;
};

export type UserSession = CommonProps & {
  user_id: string;
  token: string;
  expires_at: string;
  active_devices: UserDeviceSession[];
};

export type User = CommonProps & {
  profile: UserProfile;
  credentials: UserCredential;
  settings: UserSettings;
  roles: Role[];
};

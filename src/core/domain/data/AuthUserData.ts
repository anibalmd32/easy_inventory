import type { UserProfileData } from "./UserProfileData";
import type { UserSettingData } from "./UserSettingData";

export type AuthUserRoleData = {
  id: number;
  name: string;
  /** Nombres de permiso, p. ej. `inventory.view`. */
  permissions: string[];
};

/**
 * Usuario tal como vive en la sesión. Es deliberadamente más liviano que
 * `UserData`: no arrastra `totalAssignedUsers` ni el detalle de cada
 * permiso, que solo le interesan a la pantalla de administración de roles.
 */
export type AuthUserData = {
  id: number;
  email: string;
  profile: UserProfileData;
  settings: UserSettingData;
  role: AuthUserRoleData;
};

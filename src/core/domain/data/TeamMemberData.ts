/** Un integrante del equipo, tal como se lista en Usuarios y permisos. */
export type TeamMemberData = {
  id: number;
  name: string;
  last_name: string;
  email: string;
  avatar_url?: string;
  role_name: string;
  created_at: string;
};

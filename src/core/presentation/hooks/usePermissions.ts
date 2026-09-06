import type { PERMISSIONS } from "../../domain/enums/permissions";
import { useUserStore } from "../stores/useUserStore";

/**
 * Los permisos del usuario de la sesión.
 *
 * Esconder un botón no es seguridad —la base de datos está en el propio
 * dispositivo— sino claridad: a un vendedor no se le ofrece "Eliminar" para
 * que después le rebote.
 */
export const usePermissions = () => {
  const permissions = useUserStore((state) => state.userData?.role.permissions);

  return {
    can: (permission: PERMISSIONS): boolean =>
      permissions?.includes(permission) ?? false,
  };
};

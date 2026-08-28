import { useTranslation } from "react-i18next";

export interface DisplayPermission {
  name: string;
  description?: string | null;
}

interface PermissionGroupListProps {
  permissions: DisplayPermission[];
}

/**
 * Agrupa los permisos por módulo usando el prefijo de su nombre
 * (`inventory.view` -> `inventory`).
 */
const groupByModule = (permissions: DisplayPermission[]) =>
  permissions.reduce<Record<string, string[]>>((groups, permission) => {
    const [moduleName = "otros"] = permission.name.split(".");
    groups[moduleName] ??= [];
    groups[moduleName].push(permission.description ?? permission.name);

    return groups;
  }, {});

/**
 * Permisos agrupados por módulo, con su descripción legible.
 *
 * Nunca se muestra el nombre técnico (`inventory.view`) si hay descripción:
 * el slug no le dice nada a quien lleva una tienda.
 */
export const PermissionGroupList = ({
  permissions,
}: PermissionGroupListProps) => {
  const { t } = useTranslation();
  const groups = Object.entries(groupByModule(permissions));

  if (groups.length === 0) {
    return <p className="text-sm opacity-60">{t("permissionModules.none")}</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {groups.map(([moduleName, descriptions]) => (
        <div key={moduleName}>
          <p className="text-xs uppercase opacity-50">
            {t(`permissionModules.${moduleName}`)}
          </p>
          <ul className="mt-1 flex flex-col gap-1">
            {descriptions.map((description) => (
              <li className="text-sm" key={description}>
                {description}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

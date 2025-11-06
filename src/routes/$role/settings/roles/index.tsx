import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { BsPencilSquare } from "react-icons/bs";
import { FiShield, FiUserCheck } from "react-icons/fi";
import type { RoleData } from "../../../../core/domain/data/RoleData";

export const Route = createFileRoute("/$role/settings/roles/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  const mockData: RoleData[] = [
    {
      name: "Administrador",
      description: "Tiene acceso completo a todas las funciones.",
      totalAssignedUsers: 1,
      permissions: [
        {
          name: "Gestionar usuarios",
          description: "Puede agregar, editar y eliminar usuarios.",
        },
      ],
    },
    {
      name: "Contador",
      description: "Puede ver y generar informes financieros.",
      totalAssignedUsers: 3,
      permissions: [
        {
          name: "Gestionar usuarios",
          description: "Puede agregar, editar y eliminar usuarios.",
        },
      ],
    },
    {
      name: "Vendedor",
      description: "Puede ver el inventario y procesar ventas.",
      totalAssignedUsers: 5,
      permissions: [
        {
          name: "Gestionar usuarios",
          description: "Puede agregar, editar y eliminar usuarios.",
        },
      ],
    },
  ];
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center p-4 bg-primary rounded-sm">
        <div>
          <h1 className="text-3xl font-bold">
            {t("pages.settings.roles.title")}
          </h1>
          <p className="text-base-content/70">
            {t("pages.settings.roles.description")}
          </p>
        </div>
        <div>
          <button className="btn btn-info" type="button">
            {t("buttons.addRole.label")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockData.map((role) => {
          return (
            <div
              className="card bg-primary text-primary-content"
              key={role.name}
            >
              <div className="card-body space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex justify-between items-center gap-4">
                    <h2 className="text-2xl font-bold">{role.name}</h2>
                    <div className="tooltip" data-tip="Editar rol">
                      <button className="btn btn-ghost" type="button">
                        <BsPencilSquare className="" />
                      </button>
                    </div>
                  </div>
                  <span className="text-black font-semibold badge badge-secondary">
                    {role.totalAssignedUsers}{" "}
                    {t("pages.settings.roles.usersBadge")}
                  </span>
                </div>

                <p className="text-base-content/70">{role.description}</p>

                <div className="card-actions flex justify-between items-center">
                  <div>
                    <Link className="btn btn-ghost" to={"."}>
                      {t("pages.settings.roles.showUsersLink")}{" "}
                      <FiUserCheck className="ml-2" />
                    </Link>
                    <Link className="btn btn-ghost" to={"."}>
                      {t("pages.settings.roles.showPermissionsLink")}{" "}
                      <FiShield className="ml-2" />
                    </Link>
                  </div>
                  <button className="btn btn-soft btn-info" type="button">
                    {t("buttons.addUser.label")}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

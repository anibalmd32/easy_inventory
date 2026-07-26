import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { BiometricToggleCard } from "../../../core/presentation/components/BiometricToggleCard";
import { UserAvatar } from "../../../core/presentation/components/UserAvatar";
import { useUserStore } from "../../../core/presentation/stores/useUserStore";

export const Route = createFileRoute("/$role/profile/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const userData = useUserStore((state) => state.userData);

  // El guard de `/$role` ya garantiza que hay sesión; esto es solo para que
  // TypeScript no tenga que confiar en ello.
  if (!userData) {
    return null;
  }

  const displayName =
    `${userData.profile.name} ${userData.profile.last_name}`.trim();

  const fields = [
    {
      label: t("inputs.name.label"),
      value: userData.profile.name,
    },
    {
      label: t("inputs.lastName.label"),
      value: userData.profile.last_name,
    },
    {
      label: t("inputs.email.label"),
      value: userData.email,
    },
    {
      label: t("pages.profile.role"),
      value: userData.role.name,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t("pages.profile.title")}</h1>

      <div className="card bg-base-100 shadow-sm">
        <div className="card-body gap-4 p-4 sm:p-6">
          <div className="flex items-center gap-4">
            <UserAvatar
              avatarUrl={userData.profile.avatar_url}
              name={displayName}
              sizeClassName="w-16"
            />
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold">{displayName}</p>
              <p className="truncate text-sm opacity-60">{userData.email}</p>
            </div>
          </div>

          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.label}>
                <dt className="text-xs uppercase opacity-60">{field.label}</dt>
                <dd className="truncate font-medium">{field.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <BiometricToggleCard />

      <div className="card bg-base-100 shadow-sm">
        <div className="card-body gap-3 p-4 sm:p-6">
          <h2 className="font-semibold">{t("pages.profile.permissions")}</h2>
          <div className="flex flex-wrap gap-1">
            {userData.role.permissions.map((permission) => (
              <span className="badge badge-soft badge-sm" key={permission}>
                {permission}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm opacity-60">{t("pages.profile.editSoon")}</p>
    </div>
  );
}

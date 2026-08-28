import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { MdShield } from "react-icons/md";
import { BiometricToggleCard } from "../../../core/presentation/components/BiometricToggleCard";
import { PermissionGroupList } from "../../../core/presentation/components/PermissionGroupList";
import { ProfileEmailCard } from "../../../core/presentation/forms/Profile/ProfileEmailCard";
import { ProfileIdentityCard } from "../../../core/presentation/forms/Profile/ProfileIdentityCard";
import { ProfilePasswordCard } from "../../../core/presentation/forms/Profile/ProfilePasswordCard";
import { myPermissionsQueryOptions } from "../../../core/presentation/queries/profileQueries";
import { useUserStore } from "../../../core/presentation/stores/useUserStore";

export const Route = createFileRoute("/$role/profile/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const userData = useUserStore((state) => state.userData);
  const roleName = userData?.role.name ?? "";
  const permissions = useQuery({
    ...myPermissionsQueryOptions(roleName),
    enabled: roleName !== "",
  });

  // El guard de `/$role` ya garantiza que hay sesión; esto es solo para que
  // TypeScript no tenga que confiar en ello.
  if (!userData) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold">{t("pages.profile.title")}</h1>
        <p className="text-sm opacity-70">{t("pages.profile.subtitle")}</p>
      </div>

      <ProfileIdentityCard />
      <ProfileEmailCard />
      <ProfilePasswordCard />
      <BiometricToggleCard />

      <section className="card bg-base-100 shadow-sm">
        <div className="card-body gap-4 p-4 sm:p-6">
          <header className="flex items-start gap-3">
            <MdShield className="mt-1 shrink-0 opacity-60" size={22} />
            <div className="min-w-0">
              <h2 className="font-semibold">
                {t("pages.profile.permissions.title")}
              </h2>
              <p className="text-sm opacity-70">
                {t("pages.profile.permissions.description", {
                  role: t(`roles.${roleName}`),
                })}
              </p>
            </div>
          </header>

          {permissions.isPending ? (
            <div className="flex flex-col gap-2">
              <div className="skeleton h-8 w-full" />
              <div className="skeleton h-8 w-full" />
            </div>
          ) : (
            <PermissionGroupList permissions={permissions.data ?? []} />
          )}
        </div>
      </section>
    </div>
  );
}

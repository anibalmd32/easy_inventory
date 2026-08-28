import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MdArrowBack,
  MdDeleteOutline,
  MdGroup,
  MdPersonAdd,
  MdShield,
} from "react-icons/md";
import type { TeamMemberData } from "../../../../core/domain/data/TeamMemberData";
import { ROLES } from "../../../../core/domain/enums/roles";
import { teamService } from "../../../../core/infrastructure/container";
import { ConfirmDialog } from "../../../../core/presentation/components/ConfirmDialog";
import { FormDialog } from "../../../../core/presentation/components/FormDialog";
import { PermissionGroupList } from "../../../../core/presentation/components/PermissionGroupList";
import { UserAvatar } from "../../../../core/presentation/components/UserAvatar";
import { TeamMemberForm } from "../../../../core/presentation/forms/Team/TeamMemberForm";
import { useErrorMessage } from "../../../../core/presentation/hooks/useErrorMessage";
import {
  teamKeys,
  teamMembersQueryOptions,
  teamRolesQueryOptions,
} from "../../../../core/presentation/queries/teamQueries";
import { useUserStore } from "../../../../core/presentation/stores/useUserStore";

export const Route = createFileRoute("/$role/settings/roles/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const { role } = Route.useParams();
  const queryClient = useQueryClient();
  const resolveErrorMessage = useErrorMessage();
  const currentUserId = useUserStore((state) => state.userData?.id ?? 0);

  const members = useQuery(teamMembersQueryOptions);
  const roles = useQuery(teamRolesQueryOptions);
  const [isFormOpen, setFormOpen] = useState(false);
  const [pendingRemoval, setPendingRemoval] = useState<TeamMemberData | null>(
    null,
  );

  const remove = useMutation({
    mutationFn: (userId: number) =>
      teamService.removeMember(userId, currentUserId),
    onSuccess: async () => {
      setPendingRemoval(null);
      await queryClient.invalidateQueries({
        queryKey: teamKeys.all,
      });
    },
  });

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <div>
        <Link
          className="mb-2 inline-flex items-center gap-1 text-sm opacity-70 hover:opacity-100"
          params={{
            role,
          }}
          to="/$role/settings"
        >
          <MdArrowBack size={16} />
          {t("pages.settings.title")}
        </Link>
        <h1 className="text-2xl font-bold">
          {t("pages.settings.groups.roles.title")}
        </h1>
        <p className="text-sm opacity-70">
          {t("pages.settings.groups.roles.description")}
        </p>
      </div>

      {/* --- Equipo ---------------------------------------------------- */}
      <section className="card bg-base-100 shadow-sm">
        <div className="card-body gap-4 p-4 sm:p-6">
          <header className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <MdGroup className="mt-1 shrink-0 opacity-60" size={22} />
              <div className="min-w-0">
                <h2 className="font-semibold">
                  {t("pages.settings.team.members.title")}
                </h2>
                <p className="text-sm opacity-70">
                  {t("pages.settings.team.members.description")}
                </p>
              </div>
            </div>
            <button
              className="btn btn-primary btn-sm shrink-0"
              onClick={() => setFormOpen(true)}
              type="button"
            >
              <MdPersonAdd size={18} />
              {t("pages.settings.team.members.add")}
            </button>
          </header>

          {members.isPending ? (
            <div className="flex flex-col gap-2">
              <div className="skeleton h-14 w-full" />
              <div className="skeleton h-14 w-full" />
            </div>
          ) : (
            <ul className="list rounded-box bg-base-200">
              {members.data?.map((member) => {
                const fullName = `${member.name} ${member.last_name}`.trim();
                const isSuperAdmin = member.role_name === ROLES.SUPERADMIN;
                const isSelf = member.id === currentUserId;

                return (
                  <li className="list-row items-center" key={member.id}>
                    <UserAvatar
                      avatarUrl={member.avatar_url}
                      name={fullName}
                      sizeClassName="w-10"
                    />
                    <div className="list-col-grow min-w-0">
                      <p className="flex flex-wrap items-center gap-2">
                        <span className="truncate font-medium">{fullName}</span>
                        {isSelf ? (
                          <span className="badge badge-ghost badge-xs">
                            {t("pages.settings.team.members.you")}
                          </span>
                        ) : null}
                      </p>
                      <p className="truncate text-sm opacity-60">
                        {member.email}
                      </p>
                      <span
                        className={
                          isSuperAdmin
                            ? "badge badge-primary badge-sm mt-1"
                            : "badge badge-ghost badge-sm mt-1"
                        }
                      >
                        {t(`roles.${member.role_name}`)}
                      </span>
                    </div>

                    {/* Ni el dueño ni uno mismo se pueden eliminar: es lo que
                        impide quedarse fuera del propio negocio. */}
                    {isSuperAdmin || isSelf ? null : (
                      <button
                        aria-label={t("buttons.delete.label")}
                        className="btn btn-ghost btn-sm btn-square shrink-0 text-error"
                        onClick={() => setPendingRemoval(member)}
                        type="button"
                      >
                        <MdDeleteOutline size={18} />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* --- Roles y permisos ------------------------------------------ */}
      <section className="card bg-base-100 shadow-sm">
        <div className="card-body gap-4 p-4 sm:p-6">
          <header className="flex items-start gap-3">
            <MdShield className="mt-1 shrink-0 opacity-60" size={22} />
            <div className="min-w-0">
              <h2 className="font-semibold">
                {t("pages.settings.team.roles.title")}
              </h2>
              <p className="text-sm opacity-70">
                {t("pages.settings.team.roles.description")}
              </p>
            </div>
          </header>

          {roles.isPending ? (
            <div className="flex flex-col gap-2">
              <div className="skeleton h-12 w-full" />
              <div className="skeleton h-12 w-full" />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {roles.data?.map((roleItem) => (
                <details
                  className="collapse-arrow collapse border border-base-300 bg-base-200"
                  key={roleItem.name}
                >
                  <summary className="collapse-title">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">
                        {t(`roles.${roleItem.name}`)}
                      </span>
                      <span className="badge badge-ghost badge-sm">
                        {t("pages.settings.team.roles.assigned", {
                          count: roleItem.totalAssignedUsers,
                        })}
                      </span>
                    </span>
                    <span className="mt-1 block text-sm opacity-70">
                      {roleItem.description}
                    </span>
                  </summary>
                  <div className="collapse-content">
                    <PermissionGroupList permissions={roleItem.permissions} />
                  </div>
                </details>
              ))}
            </div>
          )}

          <p className="text-sm opacity-60">
            {t("pages.settings.team.roles.readOnly")}
          </p>
        </div>
      </section>

      <FormDialog
        onClose={() => setFormOpen(false)}
        open={isFormOpen}
        title={t("pages.settings.team.members.createTitle")}
      >
        <TeamMemberForm onDone={() => setFormOpen(false)} />
      </FormDialog>

      <ConfirmDialog
        confirmLabel={t("buttons.delete.label")}
        description={t("pages.settings.team.members.deleteDescription", {
          name: pendingRemoval
            ? `${pendingRemoval.name} ${pendingRemoval.last_name}`.trim()
            : "",
        })}
        errorMessage={resolveErrorMessage(remove.error)}
        isPending={remove.isPending}
        onCancel={() => setPendingRemoval(null)}
        onConfirm={() => pendingRemoval && remove.mutate(pendingRemoval.id)}
        open={pendingRemoval !== null}
        title={t("pages.settings.team.members.deleteTitle")}
      />
    </div>
  );
}

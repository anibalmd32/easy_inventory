import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { FiLogOut, FiSettings, FiUser } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { useDetailsDropdown } from "../hooks/useDetailsDropdown";
import { useUserStore } from "../stores/useUserStore";
import { UserAvatar } from "./UserAvatar";

/**
 * Menú de cuenta de la barra superior: perfil, configuración y cerrar sesión.
 * En mobile sustituye al pie del panel lateral, que allí no se muestra.
 */
export const AppAccountMenu = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const userData = useUserStore((state) => state.userData);
  const { isOpen, detailsRef, close, syncOpenState } = useDetailsDropdown();

  if (!userData) {
    return null;
  }

  const displayName =
    `${userData.profile.name} ${userData.profile.last_name}`.trim();
  const role = userData.role.name;

  return (
    <details
      className="dropdown dropdown-end"
      onToggle={syncOpenState}
      open={isOpen}
      ref={detailsRef}
    >
      <summary
        aria-label={t("common.account")}
        className="btn btn-ghost btn-circle"
      >
        <UserAvatar
          avatarUrl={userData.profile.avatar_url}
          name={displayName}
        />
      </summary>

      <div className="dropdown-content z-1 mt-1 w-64 rounded-box bg-base-100 p-2 shadow-sm">
        <div className="flex items-center gap-3 px-2 py-2">
          <UserAvatar
            avatarUrl={userData.profile.avatar_url}
            name={displayName}
            sizeClassName="w-10"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{displayName}</p>
            <p className="truncate text-xs opacity-60">{userData.email}</p>
            <span className="badge badge-soft badge-xs mt-1">{role}</span>
          </div>
        </div>

        <ul className="menu w-full p-0">
          <li>
            <Link
              onClick={close}
              params={{
                role,
              }}
              to="/$role/profile"
            >
              <FiUser size={16} />
              {t("common.profile")}
            </Link>
          </li>
          <li>
            <Link
              onClick={close}
              params={{
                role,
              }}
              to="/$role/settings"
            >
              <FiSettings size={16} />
              {t("common.settings")}
            </Link>
          </li>
          <li>
            <button
              className="text-error"
              onClick={() => {
                close();
                logout();
              }}
              type="button"
            >
              <FiLogOut size={16} />
              {t("buttons.logout.label")}
            </button>
          </li>
        </ul>
      </div>
    </details>
  );
};

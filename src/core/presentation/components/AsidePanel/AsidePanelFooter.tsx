import { useTranslation } from "react-i18next";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";

interface AsidePanelFooterProps {
  isOpen: boolean;
}

export const AsidePanelFooter = ({ isOpen }: AsidePanelFooterProps) => {
  const { t } = useTranslation();
  const { logout } = useAuth();

  const userProfile = {
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    avatar: "",
  };

  return (
    <div className="flex-shrink-0 border-t border-l-base-300 p-2 flex flex-col items-center">
      <div className="flex items-center gap-3 mb-3 bg-info-content p-2 rounded-lg cursor-pointer">
        {userProfile.avatar ? (
          <img
            alt={userProfile.name}
            className="w-10 h-10 rounded-full"
            src={userProfile.avatar}
          />
        ) : (
          <div
            className={`rounded-full bg-primary text-primary-content flex items-center justify-center ${isOpen ? "w-10 h-10" : "w-5 h-5 text-lg"}`}
          >
            {userProfile.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className={`flex-1 min-w-0 ${isOpen ? "block" : "hidden"}`}>
          <p className="text-sm font-medium truncate">{userProfile.name}</p>
          <p className="text-xs text-base-content/60 truncate">
            {userProfile.email}
          </p>
        </div>
      </div>

      <button
        className={`btn btn-error btn-circle ${isOpen ? "w-full flex items-center gap-2 text-sm" : ""}`}
        onClick={logout}
        type="button"
      >
        <FiLogOut className="w-4 h-4" />
        <span className={`${isOpen ? "block" : "hidden"}`}>
          {t("buttons.logout.label")}
        </span>
      </button>
    </div>
  );
};

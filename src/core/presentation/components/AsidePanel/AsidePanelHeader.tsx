import { FiMenu } from "react-icons/fi";
import { useBusinessSettings } from "../../stores/useBusinessSettings";

type AsidePanelHeaderProps = {
  togglePanel: () => void;
  isOpen: boolean;
};

export const AsidePanelHeader = ({
  togglePanel,
  isOpen,
}: AsidePanelHeaderProps) => {
  const { businessSettings } = useBusinessSettings();

  return (
    <div className="flex-shrink-0 flex items-center justify-between min-h-[40px] max-h-[40px]">
      <img
        alt={businessSettings.name}
        className={`w-8 h-8 ${isOpen ? "block" : "hidden"} animate-fade-in`}
        src={businessSettings.logoUrl}
      />
      <h1
        className={`text-xl font-bold ${isOpen ? "block" : "hidden"} animate-fade-in overflow-clip`}
      >
        {businessSettings.name}
      </h1>
      <button
        className="btn btn-ghost btn-circle"
        onClick={togglePanel}
        type="button"
      >
        <FiMenu className="w-4 h-4" />
      </button>
    </div>
  );
};

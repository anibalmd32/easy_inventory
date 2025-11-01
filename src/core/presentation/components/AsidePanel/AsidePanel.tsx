import { useState } from "react";
import type { IconType } from "react-icons";
import { AsidePanelBody } from "./AsidePanelBody";
import { AsidePanelFooter } from "./AsidePanelFooter";
import { AsidePanelHeader } from "./AsidePanelHeader";

export interface NavItem {
  label: string;
  href: string;
  Icon: IconType;
  children?: NavItem[];
}

export interface NavSection {
  section: string;
  items: NavItem[];
}

interface AsidePanelNavigationProps {
  sections: NavSection[];
}

export const AsidePanel = ({ sections }: AsidePanelNavigationProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`flex flex-col justify-between h-full bg-primary text-base-content border-r border-base-300 p-3 transition-width duration-300 ${isOpen ? "w-64" : "w-16"} overflow-hidden`}
    >
      <AsidePanelHeader isOpen={isOpen} togglePanel={togglePanel} />
      <AsidePanelBody isOpen={isOpen} sections={sections} />
      <AsidePanelFooter isOpen={isOpen} />
    </div>
  );
};

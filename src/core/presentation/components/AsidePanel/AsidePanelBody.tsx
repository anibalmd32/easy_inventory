import type { NavSection } from "./AsidePanel";
import { AsidePanelNavItem } from "./AsidePanelNavItem";

interface AsidePanelBodyProps {
  sections: NavSection[];
  isOpen: boolean;
}

export const AsidePanelBody = ({ sections, isOpen }: AsidePanelBodyProps) => {
  return (
    <div className={`flex-1 ${isOpen ? "py-4" : "py-2"} overflow-hidden`}>
      <nav className={`${isOpen ? "space-y-4" : "space-y-2"}`}>
        {sections.map((section, index) => (
          <div key={section.section || `section-${index}`}>
            {section.section && (
              <div className="">
                <span
                  className={`
                    text-xs font-semibold uppercase tracking-wider
                    text-base-content/70 max-h-[32px] min-h-[32px] flex items-center
                    ${isOpen ? "block" : "hidden"}
                  `}
                >
                  {section.section}
                </span>
              </div>
            )}

            <div className="space-y-1">
              {section.items.map((item) => (
                <AsidePanelNavItem
                  isOpen={isOpen}
                  item={item}
                  key={item.label}
                />
              ))}
            </div>

            {index < sections.length - 1 && (
              <div
                className={`divider ${isOpen ? "my-6" : "my-2"} transition-all duration-200`}
              />
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

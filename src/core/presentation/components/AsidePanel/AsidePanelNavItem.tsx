import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import type { NavItem } from "./AsidePanel";

interface AsidePanelNavItemProps {
  item: NavItem;
  level?: number;
  isOpen: boolean;
}

export const AsidePanelNavItem = ({
  item,
  level,
  isOpen,
}: AsidePanelNavItemProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (label: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(label)) {
      newExpanded.delete(label);
    } else {
      newExpanded.add(label);
    }
    setExpandedItems(newExpanded);
  };

  const isItemActive = (href: string) => {
    return window.location.pathname === href;
  };
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedItems.has(item.label);
  const isActive = isItemActive(item.href);
  return (
    <div
      className={`w-full ${isOpen ? "" : "tooltip tooltip-right"}`}
      data-tip={`${isOpen ? "" : item.label}`}
      key={item.label}
    >
      {hasChildren ? (
        <div className="w-full">
          <button
            className={`
              w-full flex items-center gap-3 ${isOpen ? "px-4" : "px-2"} py-3 text-left transition-all duration-200 cursor-pointer
              ${level === 0 ? "rounded-lg" : "rounded-md"}
              ${
                isActive
                  ? "bg-primary text-primary-content"
                  : "hover:bg-base-200 text-base-content"
              }
            `}
            data-tip={isOpen ? "" : item.label}
            onClick={() => toggleItem(item.label)}
            type="button"
          >
            <item.Icon className="w-5 h-5 flex-shrink-0" />
            <span
              className={`flex-1 text-sm font-medium ${isOpen ? "block" : "hidden"}`}
            >
              {item.label}
            </span>
            <FiChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""} ${isOpen ? "block" : "hidden"}`}
            />
          </button>

          {isExpanded && (
            <div className={`${isOpen ? "ml-4" : "ml-0"} mt-1 space-y-1`}>
              {item.children?.map((child) => (
                <AsidePanelNavItem
                  isOpen={isOpen}
                  item={child}
                  key={child.label}
                  level={(level || 0) + 1}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <Link
          className={`
            w-full flex items-center gap-3 ${isOpen ? "px-4" : "px-2"} py-3 duration-200 transition-all
            ${level === 0 ? "rounded-lg" : "rounded-md"}
            ${
              isActive
                ? "bg-primary text-primary-content"
                : "hover:bg-base-200 text-base-content"
            }
          `}
          to={item.href}
        >
          <item.Icon className="w-5 h-5 flex-shrink-0" />
          <span
            className={`flex-1 text-sm font-medium ${isOpen ? "block" : "hidden"}`}
          >
            {item.label}
          </span>
        </Link>
      )}
    </div>
  );
};

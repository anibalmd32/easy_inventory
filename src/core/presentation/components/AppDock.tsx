import { Link } from "@tanstack/react-router";
import type { NavItem } from "./AsidePanel/AsidePanel";

interface AppDockProps {
  items: NavItem[];
}

/**
 * Navegación principal en mobile. Es un `dock` de daisyUI: queda fijo abajo,
 * al alcance del pulgar. En desktop no se muestra porque esa navegación la
 * cubre el panel lateral.
 */
export const AppDock = ({ items }: AppDockProps) => {
  return (
    <nav className="dock lg:hidden">
      {items.map((item) => (
        <Link
          activeOptions={{
            exact: item.exact ?? false,
          }}
          activeProps={{
            className: "dock-active",
          }}
          key={item.href}
          to={item.href}
        >
          <item.Icon size={20} />
          <span className="dock-label">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

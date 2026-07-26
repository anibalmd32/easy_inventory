import { useBusinessSettings } from "../stores/useBusinessSettings";
import { AppAccountMenu } from "./AppAccountMenu";
import { LangSelect } from "./LangSelect";

/**
 * Barra superior del área autenticada.
 *
 * La marca solo se muestra en mobile porque en desktop ya la lleva el panel
 * lateral. El menú de cuenta también es exclusivo de mobile: en desktop esas
 * acciones viven en el pie del panel.
 */
export const AppTopBar = () => {
  const businessSettings = useBusinessSettings(
    (state) => state.businessSettings,
  );

  return (
    // El `pt-safe` va en el <header> y no en el .navbar interno para que el
    // fondo de la barra llegue hasta el borde de la pantalla y quede por
    // debajo de la hora y la batería, en vez de solaparse con ellas.
    <header className="border-b border-base-300 bg-base-100 pt-safe">
      <div className="navbar min-h-14 px-2 lg:px-4">
        <div className="navbar-start min-w-0 gap-2 lg:hidden">
          <img
            alt=""
            className="h-7 w-7 shrink-0 object-contain"
            src={businessSettings.logoUrl}
          />
          <span className="truncate font-semibold">
            {businessSettings.name}
          </span>
        </div>

        <div className="navbar-end gap-1">
          <LangSelect />
          <div className="lg:hidden">
            <AppAccountMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

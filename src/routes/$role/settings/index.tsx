import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import type { IconType } from "react-icons";
import { FiShield } from "react-icons/fi";
import {
  MdChevronRight,
  MdInventory2,
  MdOutlineStore,
  MdPointOfSale,
  MdReceiptLong,
} from "react-icons/md";

export const Route = createFileRoute("/$role/settings/")({
  component: RouteComponent,
});

type SettingsGroup = {
  key: string;
  Icon: IconType;
  /** Sin `to` mientras el módulo no exista: la fila se muestra apagada. */
  to?:
    | "/$role/settings/inventory"
    | "/$role/settings/pos"
    | "/$role/settings/business"
    | "/$role/settings/roles";
};

// El orden sigue el recorrido del negocio: primero lo que vendes, luego cómo
// lo cobras, luego lo que te deben, y al final la casa y quién la maneja.
const GROUPS: SettingsGroup[] = [
  {
    key: "inventory",
    Icon: MdInventory2,
    to: "/$role/settings/inventory",
  },
  {
    key: "pos",
    Icon: MdPointOfSale,
    to: "/$role/settings/pos",
  },
  {
    key: "debts",
    Icon: MdReceiptLong,
  },
  {
    key: "business",
    Icon: MdOutlineStore,
    to: "/$role/settings/business",
  },
  {
    key: "roles",
    Icon: FiShield,
    to: "/$role/settings/roles",
  },
];

function RouteComponent() {
  const { t } = useTranslation();
  const { role } = Route.useParams();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold">{t("pages.settings.title")}</h1>
        <p className="text-sm opacity-70">{t("pages.settings.subtitle")}</p>
      </div>

      <ul className="list rounded-box bg-base-100 shadow-sm">
        {GROUPS.map(({ key, Icon, to }) => {
          const title = t(`pages.settings.groups.${key}.title`);
          const description = t(`pages.settings.groups.${key}.description`);

          if (!to) {
            return (
              <li
                className="list-row items-center opacity-50"
                key={key}
                title={t("common.comingSoon")}
              >
                <Icon size={22} />
                <div className="min-w-0">
                  <p className="font-medium">{title}</p>
                  <p className="text-sm opacity-70">{description}</p>
                </div>
                <span className="badge badge-ghost badge-sm shrink-0">
                  {t("common.soon")}
                </span>
              </li>
            );
          }

          return (
            <li className="list-row items-center p-0" key={key}>
              <Link
                className="flex w-full items-center gap-4 rounded-box p-4 transition-colors hover:bg-base-200"
                params={{
                  role,
                }}
                to={to}
              >
                <Icon className="shrink-0" size={22} />
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{title}</span>
                  <span className="block text-sm opacity-70">
                    {description}
                  </span>
                </span>
                <MdChevronRight className="shrink-0 opacity-50" size={20} />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

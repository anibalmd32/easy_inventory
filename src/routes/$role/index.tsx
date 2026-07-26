import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useUserStore } from "../../core/presentation/stores/useUserStore";

export const Route = createFileRoute("/$role/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const userData = useUserStore((state) => state.userData);

  return (
    <div>
      <h1 className="text-2xl font-bold">
        {t("pages.home.greeting", {
          name: userData?.profile.name ?? "",
        })}
      </h1>
      <p className="text-sm opacity-70">{t("pages.home.subtitle")}</p>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ModulePlaceholder } from "../../../core/presentation/components/ModulePlaceholder";

export const Route = createFileRoute("/$role/debts/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return <ModulePlaceholder title={t("common.debts")} />;
}

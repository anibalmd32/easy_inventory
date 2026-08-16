import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { MdArrowBack } from "react-icons/md";
import type { MeasurementUnitData } from "../../../../core/domain/data/MeasurementUnitData";
import type { ProductCategoryData } from "../../../../core/domain/data/ProductCategoryData";
import { inventorySettingsService } from "../../../../core/infrastructure/container";
import { CatalogSection } from "../../../../core/presentation/components/CatalogSection";
import { CategoryForm } from "../../../../core/presentation/forms/InventorySettings/CategoryForm";
import { LowQuantityCard } from "../../../../core/presentation/forms/InventorySettings/LowQuantityCard";
import { UnitForm } from "../../../../core/presentation/forms/InventorySettings/UnitForm";
import {
  inventorySettingsKeys,
  measurementUnitsQueryOptions,
  productCategoriesQueryOptions,
} from "../../../../core/presentation/queries/inventorySettingsQueries";

export const Route = createFileRoute("/$role/settings/inventory/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const { role } = Route.useParams();
  const categories = useQuery(productCategoriesQueryOptions);
  const units = useQuery(measurementUnitsQueryOptions);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <div>
        <Link
          className="mb-2 inline-flex items-center gap-1 text-sm opacity-70 hover:opacity-100"
          params={{
            role,
          }}
          to="/$role/settings"
        >
          <MdArrowBack size={16} />
          {t("pages.settings.title")}
        </Link>
        <h1 className="text-2xl font-bold">
          {t("pages.settings.groups.inventory.title")}
        </h1>
        <p className="text-sm opacity-70">
          {t("pages.settings.groups.inventory.description")}
        </p>
      </div>

      <LowQuantityCard />

      <CatalogSection<ProductCategoryData>
        addLabel={t("pages.settings.inventory.categories.add")}
        createTitle={t("pages.settings.inventory.categories.createTitle")}
        deleteDescription={(name) =>
          t("pages.settings.inventory.categories.deleteDescription", {
            name,
          })
        }
        deleteTitle={t("pages.settings.inventory.categories.deleteTitle")}
        description={t("pages.settings.inventory.categories.description")}
        editTitle={t("pages.settings.inventory.categories.editTitle")}
        emptyBody={t("pages.settings.inventory.categories.emptyBody")}
        emptyTitle={t("pages.settings.inventory.categories.emptyTitle")}
        isLoading={categories.isPending}
        items={categories.data}
        listKey={inventorySettingsKeys.categories}
        onDelete={(id) => inventorySettingsService.deleteCategory(id)}
        renderForm={({ item, onDone }) => (
          <CategoryForm item={item} onDone={onDone} />
        )}
        renderMeta={(item) =>
          item.description ? (
            <p className="truncate text-sm opacity-70">{item.description}</p>
          ) : null
        }
        title={t("pages.settings.inventory.categories.title")}
      />

      <CatalogSection<MeasurementUnitData>
        addLabel={t("pages.settings.inventory.units.add")}
        createTitle={t("pages.settings.inventory.units.createTitle")}
        deleteDescription={(name) =>
          t("pages.settings.inventory.units.deleteDescription", {
            name,
          })
        }
        deleteTitle={t("pages.settings.inventory.units.deleteTitle")}
        description={t("pages.settings.inventory.units.description")}
        editTitle={t("pages.settings.inventory.units.editTitle")}
        emptyBody={t("pages.settings.inventory.units.emptyBody")}
        emptyTitle={t("pages.settings.inventory.units.emptyTitle")}
        isLoading={units.isPending}
        items={units.data}
        listKey={inventorySettingsKeys.units}
        onDelete={(id) => inventorySettingsService.deleteUnit(id)}
        renderForm={({ item, onDone }) => (
          <UnitForm item={item} onDone={onDone} />
        )}
        // La abreviatura se muestra tal cual aparecerá junto a las cifras.
        renderMeta={(item) => (
          <span className="badge badge-ghost badge-sm mt-1 font-mono">
            {item.abbreviation}
          </span>
        )}
        title={t("pages.settings.inventory.units.title")}
      />
    </div>
  );
}

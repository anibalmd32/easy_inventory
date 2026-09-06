import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { MdSearch, MdWarningAmber } from "react-icons/md";
import { UNCATEGORIZED_FILTER } from "../../../infrastructure/dtos/ProductDtos";
import { productCategoriesQueryOptions } from "../../queries/inventorySettingsQueries";
import { ScanCodeButton } from "./ScanCodeButton";

interface ProductFiltersBarProps {
  search: string;
  onSearchChange: (search: string) => void;
  categoryId: number | null;
  onCategoryChange: (categoryId: number | null) => void;
  onlyLow: boolean;
  onOnlyLowChange: (onlyLow: boolean) => void;
  /** Cuántos productos están por acabarse en todo el inventario. */
  lowCount: number;
}

/** El valor del `<select>` es una cadena; `""` significa "todas". */
const ALL_CATEGORIES = "";

export const ProductFiltersBar = ({
  search,
  onSearchChange,
  categoryId,
  onCategoryChange,
  onlyLow,
  onOnlyLowChange,
  lowCount,
}: ProductFiltersBarProps) => {
  const { t } = useTranslation();
  const categories = useQuery(productCategoriesQueryOptions);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <label className="input w-full">
          <MdSearch className="opacity-50" size={18} />
          <input
            aria-label={t("pages.inventory.filters.searchLabel")}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("pages.inventory.filters.searchPlaceholder")}
            type="search"
            value={search}
          />
        </label>

        {/* Escanear aquí busca el producto que se tiene en la mano. */}
        <ScanCodeButton
          className="btn btn-outline"
          label={t("pages.inventory.filters.scan")}
          onScanned={onSearchChange}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          aria-label={t("pages.inventory.filters.categoryLabel")}
          className="select select-sm w-auto grow sm:grow-0"
          onChange={(e) => {
            const value = e.target.value;
            onCategoryChange(value === ALL_CATEGORIES ? null : Number(value));
          }}
          value={categoryId === null ? ALL_CATEGORIES : String(categoryId)}
        >
          <option value={ALL_CATEGORIES}>
            {t("pages.inventory.filters.allCategories")}
          </option>
          {categories.data?.map((category) => (
            <option key={category.id} value={String(category.id)}>
              {category.name}
            </option>
          ))}
          <option value={String(UNCATEGORIZED_FILTER)}>
            {t("pages.inventory.filters.uncategorized")}
          </option>
        </select>

        <button
          aria-pressed={onlyLow}
          className={
            onlyLow ? "btn btn-warning btn-sm gap-1" : "btn btn-sm gap-1"
          }
          onClick={() => onOnlyLowChange(!onlyLow)}
          type="button"
        >
          <MdWarningAmber size={16} />
          {t("pages.inventory.filters.onlyLow")}
          {lowCount > 0 ? (
            <span className="badge badge-xs">{lowCount}</span>
          ) : null}
        </button>
      </div>
    </div>
  );
};

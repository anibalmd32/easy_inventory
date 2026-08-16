import { queryOptions } from "@tanstack/react-query";
import { inventorySettingsService } from "../../infrastructure/container";

export const inventorySettingsKeys = {
  all: [
    "inventory-settings",
  ] as const,
  categories: [
    "inventory-settings",
    "categories",
  ] as const,
  units: [
    "inventory-settings",
    "units",
  ] as const,
  lowQuantity: [
    "inventory-settings",
    "low-quantity",
  ] as const,
};

export const productCategoriesQueryOptions = queryOptions({
  queryKey: inventorySettingsKeys.categories,
  queryFn: () => inventorySettingsService.listCategories(),
});

export const measurementUnitsQueryOptions = queryOptions({
  queryKey: inventorySettingsKeys.units,
  queryFn: () => inventorySettingsService.listUnits(),
});

export const inventorySettingQueryOptions = queryOptions({
  queryKey: inventorySettingsKeys.lowQuantity,
  queryFn: () => inventorySettingsService.getSettings(),
});

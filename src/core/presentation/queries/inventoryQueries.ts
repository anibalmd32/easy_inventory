import { queryOptions } from "@tanstack/react-query";
import {
  barcodeScannerService,
  inventoryService,
} from "../../infrastructure/container";
import type { ProductFilters } from "../../infrastructure/dtos/ProductDtos";

/** Los filtros que viajan en la clave de la query, sin la paginación. */
type CatalogFilters = Pick<ProductFilters, "search" | "categoryId" | "onlyLow">;

export const inventoryKeys = {
  all: [
    "inventory",
  ] as const,
  /**
   * Los filtros forman parte de la clave: cada combinación es una consulta
   * distinta a SQLite, y así React Query las cachea por separado en vez de
   * pisarse entre sí al cambiar de página.
   */
  products: (filters: ProductFilters) =>
    [
      "inventory",
      "products",
      filters,
    ] as const,
  catalogOptions: (filters: CatalogFilters) =>
    [
      "inventory",
      "catalog-options",
      filters,
    ] as const,
  lowStock: [
    "inventory",
    "low-stock",
  ] as const,
  scanner: [
    "inventory",
    "scanner",
  ] as const,
};

export const productsQueryOptions = (filters: ProductFilters) =>
  queryOptions({
    queryKey: inventoryKeys.products(filters),
    queryFn: () => inventoryService.listProducts(filters),
    // Al pasar de página la lista anterior se queda en pantalla en vez de
    // parpadear a vacío mientras SQLite responde.
    placeholderData: (previous) => previous,
  });

export const catalogOptionsQueryOptions = (filters: CatalogFilters) =>
  queryOptions({
    queryKey: inventoryKeys.catalogOptions(filters),
    queryFn: () => inventoryService.listCatalogOptions(filters),
  });

export const lowStockCountQueryOptions = queryOptions({
  queryKey: inventoryKeys.lowStock,
  queryFn: () => inventoryService.countLowStock(),
});

/**
 * Si este dispositivo puede escanear códigos. En escritorio el plugin no
 * existe y esto resuelve a `false`, así que el botón se oculta solo.
 */
export const scannerAvailabilityQueryOptions = queryOptions({
  queryKey: inventoryKeys.scanner,
  queryFn: () => barcodeScannerService.isAvailable(),
  staleTime: Number.POSITIVE_INFINITY,
});

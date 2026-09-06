import { queryOptions } from "@tanstack/react-query";
import {
  inventoryService,
  pointOfSaleService,
} from "../../infrastructure/container";
import type { CustomerFilters } from "../../infrastructure/dtos/CustomerDtos";
import type { SaleFilters } from "../../infrastructure/dtos/SaleDtos";

export const salesKeys = {
  all: [
    "sales",
  ] as const,
  /**
   * Los filtros forman parte de la clave, igual que en el inventario: cada
   * combinación es una consulta distinta a SQLite y así React Query las cachea
   * por separado en vez de pisarse al cambiar de página.
   */
  list: (filters: SaleFilters) =>
    [
      "sales",
      "list",
      filters,
    ] as const,
  detail: (id: number) =>
    [
      "sales",
      "detail",
      id,
    ] as const,
  cashUp: (filters: Pick<SaleFilters, "day" | "userId">) =>
    [
      "sales",
      "cash-up",
      filters,
    ] as const,
  customers: (filters: CustomerFilters) =>
    [
      "sales",
      "customers",
      filters,
    ] as const,
  customer: (id: number) =>
    [
      "sales",
      "customer",
      id,
    ] as const,
  /** El buscador del carrito. Vive bajo "sales" para invalidarlo al cobrar. */
  saleProducts: (search: string) =>
    [
      "sales",
      "products",
      search,
    ] as const,
};

export const salesQueryOptions = (filters: SaleFilters) =>
  queryOptions({
    queryKey: salesKeys.list(filters),
    queryFn: () => pointOfSaleService.listSales(filters),
    // Al pasar de página la lista anterior se queda en pantalla en vez de
    // parpadear a vacío mientras SQLite responde.
    placeholderData: (previous) => previous,
  });

export const saleDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: salesKeys.detail(id),
    queryFn: () => pointOfSaleService.getSale(id),
  });

export const cashUpQueryOptions = (
  filters: Pick<SaleFilters, "day" | "userId">,
) =>
  queryOptions({
    queryKey: salesKeys.cashUp(filters),
    queryFn: () => pointOfSaleService.cashUp(filters),
  });

export const customersQueryOptions = (filters: CustomerFilters) =>
  queryOptions({
    queryKey: salesKeys.customers(filters),
    queryFn: () => pointOfSaleService.listCustomers(filters),
    placeholderData: (previous) => previous,
  });

export const customerQueryOptions = (id: number) =>
  queryOptions({
    queryKey: salesKeys.customer(id),
    queryFn: () => pointOfSaleService.getCustomer(id),
  });

/** Cuántos productos se ofrecen a la vez en el buscador del carrito. */
export const SALE_SEARCH_LIMIT = 12;

export const saleProductsQueryOptions = (search: string) =>
  queryOptions({
    queryKey: salesKeys.saleProducts(search),
    queryFn: () => inventoryService.searchForSale(search, SALE_SEARCH_LIMIT),
    placeholderData: (previous) => previous,
  });

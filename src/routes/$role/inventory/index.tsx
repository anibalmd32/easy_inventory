import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useDeferredValue, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MdAdd,
  MdChevronLeft,
  MdChevronRight,
  MdLockOutline,
  MdPictureAsPdf,
} from "react-icons/md";
import type { ProductData } from "../../../core/domain/data/ProductData";
import { PERMISSIONS } from "../../../core/domain/enums/permissions";
import { inventoryService } from "../../../core/infrastructure/container";
import type { ProductFilters } from "../../../core/infrastructure/dtos/ProductDtos";
import { ConfirmDialog } from "../../../core/presentation/components/ConfirmDialog";
import { FormDialog } from "../../../core/presentation/components/FormDialog";
import { CatalogDialog } from "../../../core/presentation/components/Inventory/CatalogDialog";
import { ProductFiltersBar } from "../../../core/presentation/components/Inventory/ProductFiltersBar";
import { ProductListItem } from "../../../core/presentation/components/Inventory/ProductListItem";
import { ProductForm } from "../../../core/presentation/forms/Inventory/ProductForm";
import { useErrorMessage } from "../../../core/presentation/hooks/useErrorMessage";
import { usePermissions } from "../../../core/presentation/hooks/usePermissions";
import {
  inventoryKeys,
  lowStockCountQueryOptions,
  productsQueryOptions,
} from "../../../core/presentation/queries/inventoryQueries";

export const Route = createFileRoute("/$role/inventory/")({
  component: RouteComponent,
});

/** Filas por página. Con la foto, cinco llenan la pantalla de un móvil. */
const PAGE_SIZE = 8;

type DialogState =
  | {
      mode: "closed";
    }
  | {
      mode: "create";
    }
  | {
      mode: "edit";
      item: ProductData;
    };

function RouteComponent() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const resolveErrorMessage = useErrorMessage();
  const { can } = usePermissions();

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [onlyLow, setOnlyLow] = useState(false);
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<DialogState>({
    mode: "closed",
  });
  const [pendingDelete, setPendingDelete] = useState<ProductData | null>(null);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  // El buscador escribe en cada tecla; diferirlo deja que el texto entre sin
  // esperar a que SQLite conteste.
  const deferredSearch = useDeferredValue(search);

  const filters: ProductFilters = {
    search: deferredSearch,
    categoryId,
    onlyLow,
    page,
    pageSize: PAGE_SIZE,
  };

  const products = useQuery(productsQueryOptions(filters));
  const lowStock = useQuery(lowStockCountQueryOptions);

  const remove = useMutation({
    mutationFn: (id: number) => inventoryService.deleteProduct(id),
    onSuccess: async () => {
      setPendingDelete(null);
      await queryClient.invalidateQueries({
        queryKey: inventoryKeys.all,
      });
    },
  });

  if (!can(PERMISSIONS.INVENTORY_VIEW)) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-3 rounded-box border border-base-300 border-dashed p-8 text-center">
        <MdLockOutline className="opacity-40" size={32} />
        <p className="font-medium">{t("pages.inventory.noAccess.title")}</p>
        <p className="text-sm opacity-70">
          {t("pages.inventory.noAccess.body")}
        </p>
      </div>
    );
  }

  const canCreate = can(PERMISSIONS.INVENTORY_CREATE);
  const total = products.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  // La página se acota al calcular: al borrar el último producto de la última
  // página, el número deja de existir y esto vuelve solo a la anterior.
  const currentPage = Math.min(page, totalPages);
  const hasFilters = search.trim().length > 0 || categoryId !== null || onlyLow;
  const isEmpty = !products.isPending && total === 0;

  /** Cambiar un filtro devuelve a la primera página. */
  const withFirstPage =
    <T,>(apply: (value: T) => void) =>
    (value: T) => {
      apply(value);
      setPage(1);
    };

  const clearFilters = () => {
    setSearch("");
    setCategoryId(null);
    setOnlyLow(false);
    setPage(1);
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold">{t("common.inventory")}</h1>
          <p className="text-sm opacity-70">
            {t("pages.inventory.subtitle", {
              count: total,
            })}
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            className="btn btn-sm"
            onClick={() => setIsCatalogOpen(true)}
            type="button"
          >
            <MdPictureAsPdf size={18} />
            {t("pages.inventory.catalog.action")}
          </button>

          {canCreate ? (
            <button
              className="btn btn-primary btn-sm"
              onClick={() =>
                setDialog({
                  mode: "create",
                })
              }
              type="button"
            >
              <MdAdd size={18} />
              {t("pages.inventory.list.add")}
            </button>
          ) : null}
        </div>
      </header>

      <ProductFiltersBar
        categoryId={categoryId}
        lowCount={lowStock.data ?? 0}
        onCategoryChange={withFirstPage(setCategoryId)}
        onlyLow={onlyLow}
        onOnlyLowChange={withFirstPage(setOnlyLow)}
        onSearchChange={withFirstPage(setSearch)}
        search={search}
      />

      {products.isPending ? (
        <div className="flex flex-col gap-2">
          <div className="skeleton h-20 w-full" />
          <div className="skeleton h-20 w-full" />
          <div className="skeleton h-20 w-full" />
        </div>
      ) : null}

      {isEmpty ? (
        <div className="flex flex-col items-center gap-3 rounded-box border border-base-300 border-dashed p-8 text-center">
          <p className="font-medium">
            {hasFilters
              ? t("pages.inventory.list.noResultsTitle")
              : t("pages.inventory.list.emptyTitle")}
          </p>
          <p className="text-sm opacity-70">
            {hasFilters
              ? t("pages.inventory.list.noResultsBody")
              : t("pages.inventory.list.emptyBody")}
          </p>

          {hasFilters ? (
            <button className="btn btn-sm" onClick={clearFilters} type="button">
              {t("pages.inventory.list.clearFilters")}
            </button>
          ) : null}

          {!hasFilters && canCreate ? (
            <button
              className="btn btn-primary btn-sm"
              onClick={() =>
                setDialog({
                  mode: "create",
                })
              }
              type="button"
            >
              <MdAdd size={18} />
              {t("pages.inventory.list.add")}
            </button>
          ) : null}
        </div>
      ) : null}

      {!products.isPending && total > 0 ? (
        <ul className="list rounded-box bg-base-200">
          {products.data?.items.map((product) => (
            <ProductListItem
              canDelete={can(PERMISSIONS.INVENTORY_DELETE)}
              canEdit={can(PERMISSIONS.INVENTORY_UPDATE)}
              key={product.id}
              onDelete={setPendingDelete}
              onEdit={(item) =>
                setDialog({
                  mode: "edit",
                  item,
                })
              }
              product={product}
            />
          ))}
        </ul>
      ) : null}

      {totalPages > 1 ? (
        <nav className="flex items-center justify-between gap-3">
          <p className="text-sm opacity-70">
            {t("common.pagination.range", {
              from: (currentPage - 1) * PAGE_SIZE + 1,
              to: Math.min(currentPage * PAGE_SIZE, total),
              total,
            })}
          </p>
          <div className="join">
            <button
              aria-label={t("common.pagination.previous")}
              className="btn btn-sm join-item"
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
              type="button"
            >
              <MdChevronLeft size={18} />
            </button>
            <span className="btn btn-sm join-item pointer-events-none">
              {currentPage} / {totalPages}
            </span>
            <button
              aria-label={t("common.pagination.next")}
              className="btn btn-sm join-item"
              disabled={currentPage === totalPages}
              onClick={() => setPage(currentPage + 1)}
              type="button"
            >
              <MdChevronRight size={18} />
            </button>
          </div>
        </nav>
      ) : null}

      <FormDialog
        onClose={() =>
          setDialog({
            mode: "closed",
          })
        }
        open={dialog.mode !== "closed"}
        title={
          dialog.mode === "edit"
            ? t("pages.inventory.form.editTitle")
            : t("pages.inventory.form.createTitle")
        }
      >
        <ProductForm
          item={dialog.mode === "edit" ? dialog.item : null}
          onDone={() =>
            setDialog({
              mode: "closed",
            })
          }
        />
      </FormDialog>

      <ConfirmDialog
        confirmLabel={t("buttons.delete.label")}
        description={t("pages.inventory.list.deleteDescription", {
          name: pendingDelete?.name ?? "",
        })}
        errorMessage={resolveErrorMessage(remove.error)}
        isPending={remove.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && remove.mutate(pendingDelete.id)}
        open={pendingDelete !== null}
        title={t("pages.inventory.list.deleteTitle")}
      />

      <CatalogDialog
        filters={{
          search: deferredSearch,
          categoryId,
          onlyLow,
        }}
        onClose={() => setIsCatalogOpen(false)}
        open={isCatalogOpen}
      />
    </div>
  );
}

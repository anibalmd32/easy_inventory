import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MdChevronLeft,
  MdChevronRight,
  MdDeleteSweep,
  MdLockOutline,
  MdShoppingCartCheckout,
} from "react-icons/md";
import { PERMISSIONS } from "../../../core/domain/enums/permissions";
import { inventoryService } from "../../../core/infrastructure/container";
import type { SaleFilters } from "../../../core/infrastructure/dtos/SaleDtos";
import { CartLineRow } from "../../../core/presentation/components/Pos/CartLineRow";
import { CashUpCard } from "../../../core/presentation/components/Pos/CashUpCard";
import { CheckoutDialog } from "../../../core/presentation/components/Pos/CheckoutDialog";
import { ProductPicker } from "../../../core/presentation/components/Pos/ProductPicker";
import { SaleDetailDialog } from "../../../core/presentation/components/Pos/SaleDetailDialog";
import { SaleListItem } from "../../../core/presentation/components/Pos/SaleListItem";
import { PriceDisplay } from "../../../core/presentation/components/PriceDisplay";
import { useCart } from "../../../core/presentation/hooks/useCart";
import { usePermissions } from "../../../core/presentation/hooks/usePermissions";
import { salesQueryOptions } from "../../../core/presentation/queries/salesQueries";
import { useUserStore } from "../../../core/presentation/stores/useUserStore";
import { localDay } from "../../../utils/localDay";

export const Route = createFileRoute("/$role/invoicing/")({
  component: RouteComponent,
});

/** Ventas por página en el historial del día. */
const PAGE_SIZE = 10;

type Tab = "sell" | "today";

function RouteComponent() {
  const { t } = useTranslation();
  const { can } = usePermissions();
  const cart = useCart();
  const currentUserId = useUserStore((state) => state.userData?.id ?? null);

  const [tab, setTab] = useState<Tab>("sell");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [openSaleId, setOpenSaleId] = useState<number | null>(null);
  const [justIssued, setJustIssued] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [cashUpUserId, setCashUpUserId] = useState<number | null>(null);

  // El día se calcula en hora local: en Venezuela, una venta de las nueve de
  // la noche se guarda como mañana en UTC y el cajero la buscaría hoy.
  const day = localDay();

  /**
   * Quien no puede ver reportes solo ve lo suyo: un vendedor no tiene por qué
   * saber cuánto vendió el otro turno. Se DERIVA del permiso en vez de
   * corregir el estado, así el filtro no puede quedarse abierto por error.
   */
  const canSeeEveryone = can(PERMISSIONS.REPORTS_VIEW);
  const visibleUserId = canSeeEveryone ? null : currentUserId;

  const filters: SaleFilters = {
    day,
    userId: visibleUserId,
    page,
    pageSize: PAGE_SIZE,
  };

  const sales = useQuery({
    ...salesQueryOptions(filters),
    enabled: tab === "today",
  });

  /**
   * Lo que devuelve la cámara es un código de barras: se busca por coincidencia
   * exacta y se añade solo. Si no está en el inventario se avisa en vez de
   * añadir cualquier cosa parecida.
   */
  const addByCode = useMutation({
    mutationFn: (code: string) => inventoryService.findByCode(code),
    onSuccess: (product) => {
      if (product) {
        setScanMessage(null);
        cart.add(product);

        return;
      }

      setScanMessage(t("pages.invoicing.cart.unknownCode"));
    },
  });

  if (!can(PERMISSIONS.INVOICING_VIEW)) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-3 rounded-box border border-base-300 border-dashed p-8 text-center">
        <MdLockOutline className="opacity-40" size={32} />
        <p className="font-medium">{t("pages.invoicing.noAccess.title")}</p>
        <p className="text-sm opacity-70">
          {t("pages.invoicing.noAccess.body")}
        </p>
      </div>
    );
  }

  const canSell = can(PERMISSIONS.INVOICING_CREATE);
  const canVoid = can(PERMISSIONS.INVOICING_DELETE);
  const canManageCustomers = can(PERMISSIONS.INVOICING_UPDATE);
  const total = sales.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  // La página se acota al calcular, como en el inventario: al quedarse sin
  // filas la última página deja de existir y esto vuelve solo a la anterior.
  const currentPage = Math.min(page, totalPages);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <header>
        <h1 className="text-2xl font-bold">{t("common.invoicing")}</h1>
        <p className="text-sm opacity-70">{t("pages.invoicing.subtitle")}</p>
      </header>

      <div className="tabs tabs-box" role="tablist">
        <button
          aria-selected={tab === "sell"}
          className={tab === "sell" ? "tab tab-active" : "tab"}
          onClick={() => setTab("sell")}
          role="tab"
          type="button"
        >
          {t("pages.invoicing.tabs.sell")}
        </button>
        <button
          aria-selected={tab === "today"}
          className={tab === "today" ? "tab tab-active" : "tab"}
          onClick={() => setTab("today")}
          role="tab"
          type="button"
        >
          {t("pages.invoicing.tabs.today")}
        </button>
      </div>

      {tab === "sell" ? (
        <>
          {canSell ? (
            <ProductPicker
              onDismissScanMessage={() => setScanMessage(null)}
              onPick={(product) => cart.add(product)}
              onScanned={(code) => addByCode.mutate(code)}
              scanMessage={scanMessage}
            />
          ) : (
            <p className="rounded-box border border-base-300 border-dashed p-6 text-center text-sm opacity-70">
              {t("pages.invoicing.cart.cannotSell")}
            </p>
          )}

          {cart.isEmpty ? (
            <p className="rounded-box border border-base-300 border-dashed p-6 text-center text-sm opacity-70">
              {t("pages.invoicing.cart.empty")}
            </p>
          ) : (
            <>
              <ul className="list rounded-box bg-base-200">
                {cart.lines.map((line) => (
                  <CartLineRow
                    key={line.product_id}
                    line={line}
                    onQuantityChange={cart.setQuantity}
                    onRemove={cart.remove}
                  />
                ))}
              </ul>

              <button
                className="btn btn-ghost btn-sm self-start"
                onClick={cart.clear}
                type="button"
              >
                <MdDeleteSweep size={18} />
                {t("pages.invoicing.cart.clear")}
              </button>

              {/* El total y el botón de cobrar se quedan pegados abajo: con el
                  carrito largo, el cajero no debería tener que subir a mirar
                  cuánto es ni bajar a cobrar. */}
              <div className="sticky bottom-2 z-10 flex flex-col gap-2 rounded-box bg-base-100 p-3 shadow-lg">
                <dl className="flex flex-col gap-1 text-sm">
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="opacity-70">
                      {t("pages.invoicing.cart.subtotal")}
                    </dt>
                    <dd>
                      <PriceDisplay
                        amountUsd={cart.totals.subtotal_usd}
                        size="sm"
                      />
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="font-medium">
                      {t("pages.invoicing.cart.total")}
                    </dt>
                    <dd>
                      <PriceDisplay
                        amountUsd={cart.totals.total_usd}
                        size="lg"
                      />
                    </dd>
                  </div>
                </dl>

                {cart.shortLines.length > 0 ? (
                  <p className="text-warning text-xs">
                    {t("pages.invoicing.cart.shortWarning", {
                      count: cart.shortLines.length,
                    })}
                  </p>
                ) : null}

                <button
                  className="btn btn-primary btn-block"
                  disabled={!canSell}
                  onClick={() => setIsCheckingOut(true)}
                  type="button"
                >
                  <MdShoppingCartCheckout size={20} />
                  {t("pages.invoicing.cart.checkout")}
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <CashUpCard
            canSeeEveryone={canSeeEveryone}
            currentUserId={currentUserId}
            day={day}
            onUserIdChange={setCashUpUserId}
            userId={canSeeEveryone ? cashUpUserId : currentUserId}
          />

          {sales.isPending ? (
            <div className="flex flex-col gap-2">
              <div className="skeleton h-16 w-full" />
              <div className="skeleton h-16 w-full" />
            </div>
          ) : null}

          {!sales.isPending && total === 0 ? (
            <p className="rounded-box border border-base-300 border-dashed p-6 text-center text-sm opacity-70">
              {t("pages.invoicing.list.empty")}
            </p>
          ) : null}

          {total > 0 ? (
            <ul className="list rounded-box bg-base-200">
              {sales.data?.items.map((sale) => (
                <SaleListItem
                  key={sale.id}
                  onOpen={(saleId) => {
                    setJustIssued(false);
                    setOpenSaleId(saleId);
                  }}
                  sale={sale}
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
        </>
      )}

      <CheckoutDialog
        canCreateCustomer={canManageCustomers}
        lines={cart.lines}
        onClose={() => setIsCheckingOut(false)}
        onIssued={(saleId) => {
          setIsCheckingOut(false);
          cart.clear();
          setJustIssued(true);
          setOpenSaleId(saleId);
        }}
        open={isCheckingOut}
        totals={cart.totals}
      />

      <SaleDetailDialog
        canVoid={canVoid}
        justIssued={justIssued}
        onClose={() => {
          setOpenSaleId(null);
          setJustIssued(false);
        }}
        saleId={openSaleId}
      />
    </div>
  );
}

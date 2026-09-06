import { useQuery } from "@tanstack/react-query";
import { useDeferredValue, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdAdd, MdClose, MdSearch, MdWarningAmber } from "react-icons/md";
import { formatQuantity } from "../../../../utils/formatQuantity";
import type { ProductSaleRecord } from "../../../infrastructure/repositories/ProductRepository";
import { saleProductsQueryOptions } from "../../queries/salesQueries";
import { ScanCodeButton } from "../Inventory/ScanCodeButton";
import { PriceDisplay } from "../PriceDisplay";

interface ProductPickerProps {
  onPick: (product: ProductSaleRecord) => void;
  /** Lo que se hace con lo que devuelve la cámara. */
  onScanned: (code: string) => void;
  /** Aviso de que el código escaneado no está en el inventario. */
  scanMessage: string | null;
  onDismissScanMessage: () => void;
}

/**
 * El buscador de productos del mostrador.
 *
 * Es lo primero de la pantalla porque es lo que el cajero toca en cada venta.
 * Los resultados aparecen mientras escribe y se añaden de un toque: con el
 * cliente esperando, cada paso de más cuenta.
 */
export const ProductPicker = ({
  onPick,
  onScanned,
  scanMessage,
  onDismissScanMessage,
}: ProductPickerProps) => {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState("");

  // El buscador escribe en cada tecla; diferirlo deja que el texto entre sin
  // esperar a que SQLite conteste.
  const deferredSearch = useDeferredValue(search);
  const products = useQuery(saleProductsQueryOptions(deferredSearch));

  const items = products.data ?? [];

  return (
    <section className="flex flex-col gap-2">
      <div className="join w-full">
        <label className="input join-item flex w-full items-center gap-2">
          <MdSearch className="opacity-60" size={18} />
          <input
            aria-label={t("pages.invoicing.cart.searchLabel")}
            className="grow"
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("pages.invoicing.cart.searchPlaceholder")}
            type="search"
            value={search}
          />
          {search.length > 0 ? (
            <button
              aria-label={t("buttons.close.label")}
              className="btn btn-ghost btn-xs btn-circle"
              onClick={() => setSearch("")}
              type="button"
            >
              <MdClose size={16} />
            </button>
          ) : null}
        </label>

        <ScanCodeButton
          className="btn join-item"
          label={t("pages.invoicing.cart.scan")}
          onScanned={onScanned}
        />
      </div>

      {scanMessage ? (
        <div className="alert alert-warning alert-soft" role="alert">
          <MdWarningAmber className="shrink-0" size={18} />
          <span className="text-sm">{scanMessage}</span>
          <button
            aria-label={t("buttons.close.label")}
            className="btn btn-ghost btn-xs btn-circle"
            onClick={onDismissScanMessage}
            type="button"
          >
            <MdClose size={16} />
          </button>
        </div>
      ) : null}

      {items.length === 0 && !products.isPending ? (
        <p className="rounded-box border border-base-300 border-dashed p-4 text-center text-sm opacity-70">
          {search.trim().length > 0
            ? t("pages.invoicing.cart.noResults")
            : t("pages.invoicing.cart.noProducts")}
        </p>
      ) : null}

      {items.length > 0 ? (
        <ul className="list max-h-64 overflow-y-auto rounded-box bg-base-200">
          {items.map((product) => (
            <li className="list-row items-center" key={product.id}>
              <div className="list-col-grow min-w-0">
                <p className="truncate font-medium">{product.name}</p>
                <div className="flex flex-wrap items-center gap-x-2">
                  <PriceDisplay amountUsd={product.sale_price} size="sm" />
                  <span
                    className={
                      product.quantity <= 0
                        ? "text-xs text-error"
                        : "text-xs opacity-60"
                    }
                  >
                    {formatQuantity(product.quantity, i18n.language)}{" "}
                    {product.unit_abbreviation}
                  </span>
                </div>
              </div>

              <button
                aria-label={t("pages.invoicing.cart.add", {
                  name: product.name,
                })}
                className="btn btn-primary btn-sm btn-square shrink-0"
                onClick={() => onPick(product)}
                type="button"
              >
                <MdAdd size={20} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
};

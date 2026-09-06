import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdClose, MdPictureAsPdf, MdSave, MdShare } from "react-icons/md";
import { formatRate } from "../../../../utils/formatRate";
import {
  buildProductCatalogPdf,
  type CatalogBusiness,
} from "../../../../utils/pdf/buildProductCatalogPdf";
import { CURRENCY, CURRENCY_SYMBOL } from "../../../domain/enums/currencies";
import {
  fileDeliveryService,
  inventoryService,
} from "../../../infrastructure/container";
import type { ProductFilters } from "../../../infrastructure/dtos/ProductDtos";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import { usePriceFormatter } from "../../hooks/usePriceFormatter";
import { businessSettingQueryOptions } from "../../queries/businessSettingsQueries";
import { catalogOptionsQueryOptions } from "../../queries/inventoryQueries";
import { currentRateQueryOptions } from "../../queries/posSettingsQueries";
import { FormAlert } from "../FormAlert";

type CatalogFilters = Pick<ProductFilters, "search" | "categoryId" | "onlyLow">;

interface CatalogDialogProps {
  open: boolean;
  onClose: () => void;
  /** Los mismos filtros del listado: el catálogo parte de lo que se ve. */
  filters: CatalogFilters;
}

const PDF_MIME_TYPE = "application/pdf";

/** Un nombre de archivo que sobreviva a cualquier sistema de archivos. */
const buildFileName = (businessName: string): string => {
  const slug = businessName
    .trim()
    .toLowerCase()
    .normalize("NFD")
    // Se quitan las tildes: `ó` se descompone en `o` + acento, y el acento
    // suelto cae en este rango.
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const today = new Date().toISOString().slice(0, 10);

  return slug.length > 0
    ? `catalogo-${slug}-${today}.pdf`
    : `catalogo-${today}.pdf`;
};

/**
 * Arma el catálogo en PDF: se marca qué productos entran y se comparte o se
 * guarda.
 *
 * Parte de los filtros del listado en vez de ofrecer siempre el inventario
 * entero, porque lo normal es mandar una sección ("bebidas") y no las
 * trescientas cosas que hay en la tienda.
 */
export const CatalogDialog = ({
  open,
  onClose,
  filters,
}: CatalogDialogProps) => {
  const { t, i18n } = useTranslation();
  const resolveErrorMessage = useErrorMessage();
  const options = useQuery({
    ...catalogOptionsQueryOptions(filters),
    enabled: open,
  });
  const { data: business } = useQuery(businessSettingQueryOptions);
  const { data: rate } = useQuery(currentRateQueryOptions);
  const { format } = usePriceFormatter();

  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [done, setDone] = useState(false);

  const available = options.data;

  // Al abrir, todo viene marcado: lo más frecuente es mandar la lista tal
  // como se está viendo, y quitar es más rápido que ir marcando uno a uno.
  useEffect(() => {
    if (available) {
      setSelected(new Set(available.map((product) => product.id)));
    }
  }, [
    available,
  ]);

  useEffect(() => {
    if (open) {
      setDone(false);
    }
  }, [
    open,
  ]);

  const buildPdf = async () => {
    const products = await inventoryService.listForCatalog([
      ...selected,
    ]);

    const catalogBusiness: CatalogBusiness = {
      name: business?.name ?? "",
      logo: business?.logo ?? null,
      tax_id: business?.tax_id ?? "",
      address: business?.address ?? "",
      phone: business?.phone ?? "",
    };

    const bytes = buildProductCatalogPdf({
      products,
      business: catalogBusiness,
      formatPrice: format,
      labels: {
        title: t("pages.inventory.catalog.defaultTitle"),
        uncategorized: t("pages.inventory.filters.uncategorized"),
        generatedAt: t("pages.inventory.catalog.generatedAt", {
          date: new Date().toLocaleDateString(i18n.language, {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
        }),
        page: (current, pages) =>
          t("pages.inventory.catalog.page", {
            current,
            total: pages,
          }),
        rateNote: rate
          ? t("pages.inventory.catalog.rateNote", {
              symbol: CURRENCY_SYMBOL[CURRENCY.VES],
              rate: formatRate(rate.rate, i18n.language),
            })
          : null,
      },
    });

    return {
      bytes,
      fileName: buildFileName(business?.name ?? ""),
    };
  };

  const share = useMutation({
    mutationFn: async () => {
      const { bytes, fileName } = await buildPdf();

      try {
        return await fileDeliveryService.share(
          fileName,
          bytes,
          PDF_MIME_TYPE,
          t("pages.inventory.catalog.shareTitle"),
        );
      } catch (error) {
        // En escritorio no hay hoja de compartir: en vez de dejar al usuario
        // con un error, se le ofrece guardar el archivo.
        console.error(error);

        return fileDeliveryService.saveAs(
          fileName,
          bytes,
          "pdf",
          t("pages.inventory.catalog.pdfFilter"),
        );
      }
    },
    onSuccess: (result) => setDone(result.done),
  });

  const saveAs = useMutation({
    mutationFn: async () => {
      const { bytes, fileName } = await buildPdf();

      return fileDeliveryService.saveAs(
        fileName,
        bytes,
        "pdf",
        t("pages.inventory.catalog.pdfFilter"),
      );
    },
    onSuccess: (result) => setDone(result.done),
  });

  if (!open) {
    return null;
  }

  const isBusy = share.isPending || saveAs.isPending;
  const total = available?.length ?? 0;
  const allSelected = total > 0 && selected.size === total;
  const errorMessage =
    resolveErrorMessage(share.error) ?? resolveErrorMessage(saveAs.error);

  const toggle = (id: number) =>
    setSelected((current) => {
      const next = new Set(current);

      if (!next.delete(id)) {
        next.add(id);
      }

      return next;
    });

  const toggleAll = () =>
    setSelected(
      allSelected ? new Set() : new Set((available ?? []).map((p) => p.id)),
    );

  return (
    <dialog className="modal modal-open modal-bottom sm:modal-middle">
      <div className="modal-box flex max-h-[85vh] flex-col">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <MdPictureAsPdf className="text-error" size={22} />
              {t("pages.inventory.catalog.title")}
            </h3>
            <p className="mt-1 text-sm opacity-70">
              {t("pages.inventory.catalog.description")}
            </p>
          </div>
          <button
            aria-label={t("buttons.close.label")}
            className="btn btn-ghost btn-circle btn-sm shrink-0"
            onClick={onClose}
            type="button"
          >
            <MdClose size={18} />
          </button>
        </div>

        {errorMessage ? <FormAlert message={errorMessage} /> : null}

        {done ? (
          <output className="alert alert-success alert-soft">
            <span className="text-sm">
              {t("pages.inventory.catalog.success")}
            </span>
          </output>
        ) : null}

        {options.isPending ? (
          <div className="flex flex-col gap-2">
            <div className="skeleton h-10 w-full" />
            <div className="skeleton h-10 w-full" />
          </div>
        ) : null}

        {!options.isPending && total === 0 ? (
          <p className="rounded-box border border-base-300 border-dashed p-6 text-center text-sm opacity-70">
            {t("pages.inventory.catalog.empty")}
          </p>
        ) : null}

        {total > 0 ? (
          <>
            <div className="flex items-center justify-between gap-3 border-base-300 border-b pb-2">
              <span className="text-sm opacity-70">
                {t("pages.inventory.catalog.selectedCount", {
                  count: selected.size,
                  total,
                })}
              </span>
              <button
                className="btn btn-ghost btn-xs"
                onClick={toggleAll}
                type="button"
              >
                {allSelected
                  ? t("pages.inventory.catalog.selectNone")
                  : t("pages.inventory.catalog.selectAll")}
              </button>
            </div>

            <ul className="menu w-full flex-nowrap overflow-y-auto px-0">
              {available?.map((product) => (
                <li key={product.id}>
                  <label className="flex items-center gap-3">
                    <input
                      checked={selected.has(product.id)}
                      className="checkbox checkbox-sm"
                      onChange={() => toggle(product.id)}
                      type="checkbox"
                    />
                    <span className="min-w-0 flex-1 truncate">
                      {product.name}
                    </span>
                    <span className="shrink-0 text-sm opacity-60">
                      {format(product.sale_price).primary}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        <div className="modal-action flex-col gap-2 sm:flex-row">
          <button
            className="btn btn-primary btn-block sm:btn-auto"
            disabled={isBusy || selected.size === 0}
            onClick={() => share.mutate()}
            type="button"
          >
            {share.isPending ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <MdShare size={18} />
            )}
            {t("pages.inventory.catalog.share")}
          </button>
          <button
            className="btn btn-block sm:btn-auto"
            disabled={isBusy || selected.size === 0}
            onClick={() => saveAs.mutate()}
            type="button"
          >
            {saveAs.isPending ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <MdSave size={18} />
            )}
            {t("pages.inventory.catalog.save")}
          </button>
        </div>
      </div>

      <button
        aria-label={t("buttons.close.label")}
        className="modal-backdrop"
        onClick={onClose}
        type="button"
      />
    </dialog>
  );
};

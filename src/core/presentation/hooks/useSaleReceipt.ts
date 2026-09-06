import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { formatQuantity } from "../../../utils/formatQuantity";
import { formatRate } from "../../../utils/formatRate";
import { formatDate, formatDateTime } from "../../../utils/localDay";
import {
  buildSaleReceiptPdf,
  type ReceiptWidth,
} from "../../../utils/pdf/buildSaleReceiptPdf";
import type { SaleData } from "../../domain/data/SaleData";
import { CURRENCY, CURRENCY_SYMBOL } from "../../domain/enums/currencies";
import { fileDeliveryService } from "../../infrastructure/container";
import { businessSettingQueryOptions } from "../queries/businessSettingsQueries";
import { posSettingQueryOptions } from "../queries/posSettingsQueries";
import { usePriceFormatter } from "./usePriceFormatter";

const PDF_MIME_TYPE = "application/pdf";

const AMOUNT_FORMATTER = new Intl.NumberFormat("es-VE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Un nombre de archivo que sobreviva a cualquier sistema de archivos. */
const buildFileName = (invoiceNumber: string): string => {
  const slug = invoiceNumber
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `recibo-${slug || "venta"}.pdf`;
};

/**
 * Arma el recibo de una venta y lo entrega: compartir en el móvil, guardar en
 * escritorio.
 *
 * No se imprime: en una bodega venezolana mandarle el recibo al cliente por
 * WhatsApp resuelve más que una impresora térmica, y funciona sin depender de
 * ningún cacharro. El PDF sale con el ancho de un rollo, así que si algún día
 * hay impresora se manda tal cual.
 */
export const useSaleReceipt = () => {
  const { t, i18n } = useTranslation();
  const { format } = usePriceFormatter();
  const { data: business } = useQuery(businessSettingQueryOptions);
  const { data: posSettings } = useQuery(posSettingQueryOptions);

  const [width, setWidth] = useState<ReceiptWidth>(58);
  const [done, setDone] = useState(false);

  const buildPdf = (sale: SaleData) => {
    // Lo fiado sale de la fila de la deuda, no de restar los cobros: en cuanto
    // el módulo de deudas registre un abono, la resta daría otro número y el
    // recibo reimpreso dejaría de coincidir con el que se entregó.
    const owed = sale.debt_amount_usd;

    const bytes = buildSaleReceiptPdf({
      sale,
      width,
      business: {
        name: business?.name ?? "",
        tax_id: business?.tax_id ?? "",
        address: business?.address ?? "",
        phone: business?.phone ?? "",
      },
      showBusinessInfo: posSettings?.invoice_show_business_info ?? true,
      formattedDateTime: formatDateTime(sale.created_at, i18n.language),
      formattedDueDate: sale.debt_due_date
        ? formatDate(sale.debt_due_date, i18n.language)
        : null,
      formattedOwed: owed !== null ? format(owed).primary : null,
      formatPrice: format,
      formatPaid: (amount, currency) =>
        `${CURRENCY_SYMBOL[currency as CURRENCY] ?? ""}${
          currency === CURRENCY.VES ? " " : ""
        }${AMOUNT_FORMATTER.format(amount)}`,
      formatQuantity: (value) => formatQuantity(value, i18n.language),
      labels: {
        title: t("pages.invoicing.receipt.defaultTitle"),
        voided: t("pages.invoicing.receipt.voided"),
        dateTime: t("pages.invoicing.receipt.dateTime"),
        soldBy: t("pages.invoicing.receipt.soldBy"),
        customer: t("pages.invoicing.receipt.customer"),
        anonymous: t("pages.invoicing.customers.anonymous"),
        subtotal: t("pages.invoicing.receipt.subtotal"),
        total: t("pages.invoicing.receipt.total"),
        paidWith: t("pages.invoicing.receipt.paidWith"),
        change: t("pages.invoicing.receipt.change"),
        owed: t("pages.invoicing.receipt.owed"),
        dueDate: t("pages.invoicing.receipt.dueDate"),
        rateNote: sale.exchange_rate
          ? t("pages.invoicing.receipt.rateNote", {
              symbol: CURRENCY_SYMBOL[CURRENCY.VES],
              rate: formatRate(sale.exchange_rate, i18n.language),
            })
          : null,
        footerNote: posSettings?.invoice_footer_note ?? "",
      },
    });

    return {
      bytes,
      fileName: buildFileName(sale.invoice_number),
    };
  };

  const share = useMutation({
    mutationFn: async (sale: SaleData) => {
      const { bytes, fileName } = buildPdf(sale);

      try {
        return await fileDeliveryService.share(
          fileName,
          bytes,
          PDF_MIME_TYPE,
          t("pages.invoicing.receipt.shareTitle"),
        );
      } catch (error) {
        // En escritorio no hay hoja de compartir: en vez de dejar al cajero
        // con un error, se le ofrece guardar el archivo.
        console.error(error);

        return fileDeliveryService.saveAs(
          fileName,
          bytes,
          "pdf",
          t("pages.invoicing.receipt.pdfFilter"),
        );
      }
    },
    onSuccess: (result) => setDone(result.done),
  });

  const saveAs = useMutation({
    mutationFn: async (sale: SaleData) => {
      const { bytes, fileName } = buildPdf(sale);

      return fileDeliveryService.saveAs(
        fileName,
        bytes,
        "pdf",
        t("pages.invoicing.receipt.pdfFilter"),
      );
    },
    onSuccess: (result) => setDone(result.done),
  });

  return {
    width,
    setWidth,
    done,
    resetDone: () => setDone(false),
    share,
    saveAs,
    isBusy: share.isPending || saveAs.isPending,
  };
};

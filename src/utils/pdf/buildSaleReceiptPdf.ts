import { jsPDF } from "jspdf";
import type { SaleData } from "../../core/domain/data/SaleData";

/**
 * Ancho del papel, en milímetros. Son los dos rollos que se venden en
 * cualquier parte; 58 es el de las impresoras de bolsillo y 80 el de mostrador.
 */
export type ReceiptWidth = 58 | 80;

/** Datos del negocio que van en la cabecera del recibo. */
export type ReceiptBusiness = {
  name: string;
  tax_id: string;
  address: string;
  phone: string;
};

/** Textos ya traducidos. El generador no conoce i18n. */
export type ReceiptLabels = {
  /** Título cuando el negocio todavía no tiene nombre. */
  title: string;
  voided: string;
  dateTime: string;
  soldBy: string;
  customer: string;
  subtotal: string;
  total: string;
  paidWith: string;
  change: string;
  owed: string;
  dueDate: string;
  anonymous: string;
  /** Nota de la tasa usada ("Tasa: Bs 36,50 por dólar"). */
  rateNote: string | null;
  footerNote: string;
};

export type ReceiptInput = {
  sale: SaleData;
  business: ReceiptBusiness;
  /** `false` cuando el dueño apagó los datos del negocio en la factura. */
  showBusinessInfo: boolean;
  labels: ReceiptLabels;
  width: ReceiptWidth;
  /** Fecha y hora ya formateadas en el idioma activo. */
  formattedDateTime: string;
  /** Vencimiento de la deuda, ya formateado, o `null` si no fue fiada. */
  formattedDueDate: string | null;
  /** Lo que quedó a deber, ya formateado, o `null`. */
  formattedOwed: string | null;
  /** El mismo formateo de precios que se ve en pantalla. */
  formatPrice: (amountUsd: number) => {
    primary: string;
    secondary: string | null;
  };
  /** Un importe en la moneda con la que se pagó, ya formateado. */
  formatPaid: (amount: number, currency: string) => string;
  /** Cantidades como "1,5" o "2". */
  formatQuantity: (value: number) => string;
};

/** Margen a cada lado. El área imprimible de un rollo es menor que el papel. */
const MARGIN = 4;
const LINE = 3.6;
const SMALL_LINE = 3;
const TOP = 6;
/** Altura del lienzo de medición: cualquier recibo cabe de sobra. */
const MEASURE_HEIGHT = 2000;

/**
 * Arma el recibo de una venta en PDF, con el ancho de un rollo térmico.
 *
 * No se imprime directamente: se comparte o se guarda con
 * `FileDeliveryService`. En una bodega venezolana mandar el recibo por
 * WhatsApp es más útil que imprimirlo, y así funciona sin depender de ninguna
 * impresora.
 *
 * El alto del papel es continuo, así que se hace en dos pasadas: la primera
 * dibuja sobre un lienzo altísimo solo para medir dónde termina el recibo, y
 * la segunda lo dibuja de verdad sobre una página de ese alto exacto. Sin
 * esto, todos los recibos saldrían con un palmo de papel en blanco debajo.
 */
export const buildSaleReceiptPdf = (input: ReceiptInput): Uint8Array => {
  const measured = drawReceipt(
    new jsPDF({
      unit: "mm",
      format: [
        input.width,
        MEASURE_HEIGHT,
      ],
    }),
    input,
  );

  const doc = new jsPDF({
    unit: "mm",
    format: [
      input.width,
      measured + MARGIN,
    ],
  });

  drawReceipt(doc, input);

  // `arraybuffer` y no `blob`: lo que sigue es escribirlo en disco con el
  // plugin de archivos, que espera bytes.
  return new Uint8Array(doc.output("arraybuffer"));
};

/** Dibuja el recibo y devuelve la altura que ocupó. */
const drawReceipt = (doc: jsPDF, input: ReceiptInput): number => {
  const { sale, business, labels } = input;
  const width = input.width - MARGIN * 2;
  const left = MARGIN;
  const right = input.width - MARGIN;
  const center = input.width / 2;

  let y = TOP;

  /** Texto centrado que se parte solo si no cabe. */
  const centered = (text: string, size: number, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);

    for (const line of doc.splitTextToSize(text, width) as string[]) {
      doc.text(line, center, y, {
        align: "center",
      });
      y += size <= 7 ? SMALL_LINE : LINE;
    }
  };

  /** Etiqueta a la izquierda, valor a la derecha, en la misma línea. */
  const row = (label: string, value: string, bold = false, size = 8) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.text(label, left, y);
    doc.text(value, right, y, {
      align: "right",
    });
    y += LINE;
  };

  const divider = () => {
    y += 1;
    doc.setLineWidth(0.1);
    doc.line(left, y, right, y);
    y += 2.5;
  };

  // --- Cabecera ---------------------------------------------------------

  if (input.showBusinessInfo) {
    centered(business.name.trim() || labels.title, 10, true);

    for (const line of [
      business.tax_id,
      business.address,
      business.phone,
    ]) {
      if (line.trim().length > 0) {
        centered(line, 7);
      }
    }
  } else {
    centered(business.name.trim() || labels.title, 10, true);
  }

  y += 1;
  centered(sale.invoice_number, 9, true);

  // Una factura anulada tiene que gritarlo: es lo primero que hay que ver si
  // alguien la enseña como comprobante de pago.
  if (sale.voided_at !== null) {
    centered(labels.voided, 10, true);
  }

  divider();

  // --- Datos de la venta ------------------------------------------------

  row(labels.dateTime, input.formattedDateTime, false, 7);
  row(labels.soldBy, sale.seller_name, false, 7);
  row(labels.customer, sale.customer_name ?? labels.anonymous, false, 7);

  divider();

  // --- Líneas -----------------------------------------------------------

  for (const item of sale.items) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    for (const line of doc.splitTextToSize(
      item.product_name,
      width,
    ) as string[]) {
      doc.text(line, left, y);
      y += LINE;
    }

    const unit =
      item.unit_abbreviation.length > 0 ? ` ${item.unit_abbreviation}` : "";
    const detail = `${input.formatQuantity(item.quantity)}${unit} x ${
      input.formatPrice(item.unit_price_usd).primary
    }`;

    row(detail, input.formatPrice(item.line_total_usd).primary, false, 7);
  }

  divider();

  // --- Totales ----------------------------------------------------------

  const total = input.formatPrice(sale.total_usd);

  row(labels.subtotal, input.formatPrice(sale.subtotal_usd).primary, false, 8);
  row(labels.total, total.primary, true, 10);

  if (total.secondary) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(total.secondary, right, y, {
      align: "right",
    });
    y += SMALL_LINE;
  }

  // --- Cobro ------------------------------------------------------------

  if (sale.payments.length > 0) {
    divider();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text(labels.paidWith, left, y);
    y += LINE;

    for (const payment of sale.payments) {
      row(
        payment.payment_method_name,
        input.formatPaid(payment.amount, payment.currency),
        false,
        7,
      );
    }
  }

  if (sale.change_usd > 0) {
    row(labels.change, input.formatPrice(sale.change_usd).primary, false, 8);
  }

  // --- Fiado ------------------------------------------------------------

  if (input.formattedOwed) {
    divider();
    row(labels.owed, input.formattedOwed, true, 9);

    if (input.formattedDueDate) {
      row(labels.dueDate, input.formattedDueDate, false, 7);
    }
  }

  // --- Pie --------------------------------------------------------------

  divider();

  if (labels.rateNote) {
    centered(labels.rateNote, 6);
  }

  if (labels.footerNote.trim().length > 0) {
    y += 1;
    centered(labels.footerNote, 7);
  }

  return y;
};

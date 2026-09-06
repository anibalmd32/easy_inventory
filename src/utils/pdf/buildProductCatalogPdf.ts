import { jsPDF } from "jspdf";
import type { ProductData } from "../../core/domain/data/ProductData";

/** Datos del negocio que van en la cabecera del catálogo. */
export type CatalogBusiness = {
  name: string;
  logo: string | null;
  tax_id: string;
  address: string;
  phone: string;
};

/** Textos ya traducidos. El generador no conoce i18n. */
export type CatalogLabels = {
  /** Título cuando el negocio todavía no tiene nombre. */
  title: string;
  uncategorized: string;
  generatedAt: string;
  page: (current: number, total: number) => string;
  /** Nota de la tasa usada para convertir a bolívares. */
  rateNote: string | null;
};

export type CatalogPrice = {
  primary: string;
  secondary: string | null;
};

export type CatalogInput = {
  products: ProductData[];
  business: CatalogBusiness;
  labels: CatalogLabels;
  /** El mismo formateo de precios que se ve en pantalla. */
  formatPrice: (amountUsd: number) => CatalogPrice;
};

// Medidas en milímetros sobre A4 vertical.
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 14;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const PHOTO_SIZE = 18;
const ROW_HEIGHT = 22;
const FOOTER_SPACE = 16;

/** Gris de las líneas y los textos secundarios. */
const MUTED = 120;

/**
 * Arma el catálogo de productos en PDF: cabecera con los datos del negocio,
 * los productos agrupados por categoría y, en cada uno, su foto y su precio en
 * las dos monedas.
 *
 * Deliberadamente NO lleva el precio de costo ni las existencias: es el
 * documento que el dueño le manda a sus clientes por WhatsApp.
 */
export const buildProductCatalogPdf = ({
  products,
  business,
  labels,
  formatPrice,
}: CatalogInput): Uint8Array => {
  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
  });

  let cursorY = drawHeader(doc, business, labels);

  for (const [category, items] of groupByCategory(products, labels)) {
    cursorY = ensureSpace(doc, cursorY, 14, business, labels);
    cursorY = drawCategoryHeading(doc, category, cursorY);

    for (const product of items) {
      cursorY = ensureSpace(doc, cursorY, ROW_HEIGHT, business, labels);
      cursorY = drawProduct(doc, product, cursorY, formatPrice);
    }
  }

  drawFooters(doc, labels);

  // `arraybuffer` y no `blob`: lo que sigue es escribirlo en disco con el
  // plugin de archivos, que espera bytes.
  return new Uint8Array(doc.output("arraybuffer"));
};

const groupByCategory = (
  products: ProductData[],
  labels: CatalogLabels,
): [
  string,
  ProductData[],
][] => {
  const groups = new Map<string, ProductData[]>();

  for (const product of products) {
    const key = product.category_name ?? labels.uncategorized;
    const current = groups.get(key);

    if (current) {
      current.push(product);
    } else {
      groups.set(key, [
        product,
      ]);
    }
  }

  // Las categorías van alfabéticas, pero "sin categoría" siempre al final:
  // es el cajón de sastre, no una categoría más.
  return [
    ...groups.entries(),
  ].sort(([a], [b]) => {
    if (a === labels.uncategorized) {
      return 1;
    }

    if (b === labels.uncategorized) {
      return -1;
    }

    return a.localeCompare(b);
  });
};

const drawHeader = (
  doc: jsPDF,
  business: CatalogBusiness,
  labels: CatalogLabels,
): number => {
  const hasLogo = Boolean(business.logo);
  const textX = hasLogo ? MARGIN + 22 : MARGIN;
  let y = MARGIN + 6;

  if (business.logo) {
    try {
      doc.addImage(business.logo, MARGIN, MARGIN, 18, 18, undefined, "FAST");
    } catch {
      // Un logo ilegible no puede impedir que salga el catálogo.
    }
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(0);
  doc.text(business.name.trim() || labels.title, textX, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(MUTED);

  const contact = [
    business.tax_id,
    business.phone,
    business.address,
  ]
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
    .join("  ·  ");

  if (contact.length > 0) {
    y += 5;
    doc.text(contact, textX, y, {
      maxWidth: CONTENT_WIDTH - (textX - MARGIN),
    });
  }

  y += 5;
  doc.text(labels.generatedAt, textX, y);

  if (labels.rateNote) {
    y += 4;
    doc.text(labels.rateNote, textX, y);
  }

  const lineY = Math.max(y + 4, MARGIN + 20);
  doc.setDrawColor(MUTED);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, lineY, PAGE_WIDTH - MARGIN, lineY);

  return lineY + 8;
};

const drawCategoryHeading = (
  doc: jsPDF,
  category: string,
  y: number,
): number => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.text(category.toUpperCase(), MARGIN, y);

  return y + 5;
};

const drawProduct = (
  doc: jsPDF,
  product: ProductData,
  y: number,
  formatPrice: (amountUsd: number) => CatalogPrice,
): number => {
  const hasPhoto = Boolean(product.photo);
  const textX = hasPhoto ? MARGIN + PHOTO_SIZE + 4 : MARGIN;
  const price = formatPrice(product.sale_price);

  if (product.photo) {
    try {
      doc.addImage(
        product.photo,
        MARGIN,
        y,
        PHOTO_SIZE,
        PHOTO_SIZE,
        // Un alias por producto: sin él jsPDF vuelve a incrustar la misma
        // imagen cada vez que aparece y el archivo se hincha.
        `product-${product.id}`,
        "FAST",
      );
    } catch {
      // Una foto rota no puede tumbar el catálogo entero.
    }
  }

  // El precio se dibuja primero para saber cuánto sitio deja al nombre.
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(0);
  const priceWidth = doc.getTextWidth(price.primary);
  doc.text(price.primary, PAGE_WIDTH - MARGIN, y + 6, {
    align: "right",
  });

  if (price.secondary) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(MUTED);
    doc.text(price.secondary, PAGE_WIDTH - MARGIN, y + 10.5, {
      align: "right",
    });
  }

  const nameWidth = PAGE_WIDTH - MARGIN - textX - priceWidth - 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(0);
  const nameLines = doc.splitTextToSize(product.name, nameWidth).slice(0, 2);
  doc.text(nameLines, textX, y + 5);

  let detailY = y + 5 + nameLines.length * 4.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(MUTED);

  if (product.description) {
    const descriptionLines = doc
      .splitTextToSize(product.description, nameWidth)
      .slice(0, 2);
    doc.text(descriptionLines, textX, detailY);
    detailY += descriptionLines.length * 3.8;
  }

  if (product.sku) {
    doc.text(product.sku, textX, detailY);
  }

  const bottom = y + ROW_HEIGHT - 3;
  doc.setDrawColor(230);
  doc.setLineWidth(0.2);
  doc.line(MARGIN, bottom, PAGE_WIDTH - MARGIN, bottom);

  return y + ROW_HEIGHT;
};

/** Abre página nueva si lo que viene no cabe en lo que queda. */
const ensureSpace = (
  doc: jsPDF,
  y: number,
  needed: number,
  business: CatalogBusiness,
  labels: CatalogLabels,
): number => {
  if (y + needed <= PAGE_HEIGHT - FOOTER_SPACE) {
    return y;
  }

  doc.addPage();

  // En las páginas siguientes basta con el nombre del negocio: repetir la
  // ficha completa robaría media hoja a los productos.
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(MUTED);
  doc.text(business.name.trim() || labels.title, MARGIN, MARGIN);
  doc.setDrawColor(MUTED);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, MARGIN + 3, PAGE_WIDTH - MARGIN, MARGIN + 3);

  return MARGIN + 11;
};

const drawFooters = (doc: jsPDF, labels: CatalogLabels): void => {
  const total = doc.getNumberOfPages();

  for (let page = 1; page <= total; page++) {
    doc.setPage(page);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(MUTED);
    doc.text(labels.page(page, total), PAGE_WIDTH / 2, PAGE_HEIGHT - 8, {
      align: "center",
    });
  }
};

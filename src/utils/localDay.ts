/**
 * El día de una fecha en formato `YYYY-MM-DD`, en HORA LOCAL.
 *
 * `toISOString().slice(0, 10)` daría el día en UTC, y en Venezuela (UTC-4) eso
 * significa que todo lo vendido después de las ocho de la noche contaría como
 * mañana. El historial y el cierre de caja tienen que hablar del mismo "hoy"
 * que el cajero.
 */
export const localDay = (date: Date = new Date()): string => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
};

/** Hora corta de una venta ("21:14"), para la fila del historial. */
export const formatTime = (iso: string, locale: string): string =>
  new Date(iso).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });

/** Fecha y hora completas, para el recibo y el detalle de la venta. */
export const formatDateTime = (iso: string, locale: string): string =>
  new Date(iso).toLocaleString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

/** Solo la fecha ("15 oct 2026"), para el vencimiento de un fiado. */
export const formatDate = (iso: string, locale: string): string =>
  new Date(iso).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

/**
 * Formatea una tasa de cambio para mostrarla: dos decimales mínimos y hasta
 * cuatro, con el separador y los símbolos del idioma activo.
 */
export const formatRate = (rate: number, locale: string): string =>
  rate.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });

/** Fecha y hora cortas de un cambio de tasa ("16 ago 2026, 09:14"). */
export const formatRateDateTime = (iso: string, locale: string): string =>
  new Date(iso).toLocaleString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

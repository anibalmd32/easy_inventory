/**
 * Formatea una existencia. Sin decimales cuando es un número entero (lo
 * normal) y con hasta tres cuando la mercancía se pesa: "12" y "1,5".
 */
export const formatQuantity = (value: number, locale: string): string =>
  value.toLocaleString(locale, {
    maximumFractionDigits: 3,
  });

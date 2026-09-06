/** A cuántos dígitos se rellena el correlativo: "A-" + 000123. */
const SERIAL_DIGITS = 6;

/**
 * Compone el número de factura que se imprime: el prefijo de la configuración
 * del punto de venta pegado al correlativo, relleno de ceros.
 *
 * Se rellena a seis dígitos para que los números salgan alineados en el
 * recibo y para que ordenarlos como texto dé el mismo orden que ordenarlos
 * como número. El prefijo puede estar vacío, y entonces solo queda el número.
 */
export const formatInvoiceNumber = (prefix: string, serial: number): string =>
  `${prefix}${String(serial).padStart(SERIAL_DIGITS, "0")}`;

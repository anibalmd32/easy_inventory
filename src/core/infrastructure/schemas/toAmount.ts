/**
 * Convierte lo que escribe el usuario a número.
 *
 * En español la coma es el separador decimal y el punto el de los miles, así
 * que "1.250,75" tiene que llegar como 1250.75. Si no hay coma se deja el
 * punto tal cual: quien escribe "1.5" quiere uno con medio, no mil quinientos.
 *
 * Vive aquí y no dentro de un esquema concreto porque lo usan los precios del
 * inventario, las cantidades del carrito y los importes del cobro, y las tres
 * tienen que interpretar la coma igual.
 */
export const toAmount = (value: string): number => {
  const cleaned = value.replace(/\s/g, "");

  return Number(
    cleaned.includes(",")
      ? cleaned.replace(/\./g, "").replace(",", ".")
      : cleaned,
  );
};

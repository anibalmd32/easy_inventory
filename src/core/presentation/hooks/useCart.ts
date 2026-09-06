import { useMemo, useState } from "react";
import { roundMoney, roundQuantity } from "../../../utils/money";
import type { CartLineData, CartTotalsData } from "../../domain/data/CartData";
import type { ProductSaleRecord } from "../../infrastructure/repositories/ProductRepository";

/**
 * El carrito de la venta que se está armando.
 *
 * Vive en la pantalla y no en la base de datos: hasta que se cobra no hay
 * venta ninguna. Se guarda en el estado de React y no en un store global
 * porque un carrito a medias no debe sobrevivir a salir del punto de venta:
 * el cajero siguiente se encontraría con la compra del anterior.
 */
export const useCart = () => {
  const [lines, setLines] = useState<CartLineData[]>([]);

  const add = (product: ProductSaleRecord, quantity = 1) => {
    setLines((current) => {
      const existing = current.find((line) => line.product_id === product.id);

      // Escanear dos veces el mismo producto suma, no duplica la línea: si
      // no, el carrito se llenaría de filas repetidas de una en una.
      if (existing) {
        return current.map((line) =>
          line.product_id === product.id
            ? {
                ...line,
                quantity: roundQuantity(line.quantity + quantity),
              }
            : line,
        );
      }

      return [
        ...current,
        {
          product_id: product.id,
          product_name: product.name,
          unit_abbreviation: product.unit_abbreviation,
          unit_price_usd: product.sale_price,
          unit_cost_usd: product.cost_price,
          quantity: roundQuantity(quantity),
          available_quantity: product.quantity,
        },
      ];
    });
  };

  const setQuantity = (productId: number, quantity: number) => {
    setLines((current) =>
      current.map((line) =>
        line.product_id === productId
          ? {
              ...line,
              quantity: roundQuantity(quantity),
            }
          : line,
      ),
    );
  };

  const remove = (productId: number) => {
    setLines((current) =>
      current.filter((line) => line.product_id !== productId),
    );
  };

  const clear = () => setLines([]);

  const totals = useMemo<CartTotalsData>(() => {
    // Se redondea línea a línea y no solo al final, igual que hace el
    // servicio al emitir: si no, el total de la pantalla y el de la factura
    // podrían discrepar en un céntimo.
    const subtotal = roundMoney(
      lines.reduce(
        (sum, line) => sum + roundMoney(line.quantity * line.unit_price_usd),
        0,
      ),
    );

    return {
      subtotal_usd: subtotal,
      discount_usd: 0,
      total_usd: subtotal,
    };
  }, [
    lines,
  ]);

  /** Las líneas que piden más de lo que hay apuntado. Solo se avisa. */
  const shortLines = useMemo(
    () => lines.filter((line) => line.quantity > line.available_quantity),
    [
      lines,
    ],
  );

  return {
    lines,
    totals,
    shortLines,
    isEmpty: lines.length === 0,
    add,
    setQuantity,
    remove,
    clear,
  };
};

export type Cart = ReturnType<typeof useCart>;

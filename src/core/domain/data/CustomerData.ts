import type { CustomerEntity } from "../entities/CustomerEntity";

/**
 * Un cliente tal como se busca y se elige en el punto de venta.
 *
 * Lleva lo que debe ya sumado porque es justo lo que hay que mirar antes de
 * fiarle otra vez: resolverlo en SQL evita traerse todas sus deudas para
 * sumarlas en memoria.
 */
export type CustomerData = CustomerEntity & {
  id: number;
  /** Suma de sus deudas abiertas, en dólares. 0 si no debe nada. */
  open_debt_usd: number;
};

/** Una página del buscador de clientes, con el total para poder paginar. */
export type CustomerPageData = {
  items: CustomerData[];
  total: number;
};

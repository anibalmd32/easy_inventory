import type { SaleEntity } from "../entities/SaleEntity";
import type { SaleItemEntity } from "../entities/SaleItemEntity";
import type { SalePaymentEntity } from "../entities/SalePaymentEntity";
import type { CURRENCY } from "../enums/currencies";
import type { SALE_STATUS, SALE_TYPE } from "../enums/sales";

/** Una línea de la venta, ya sin el `sale_id` que la vista no necesita. */
export type SaleItemData = Omit<SaleItemEntity, "sale_id"> & {
  id: number;
};

/** Un pago de la venta. */
export type SalePaymentData = Omit<SalePaymentEntity, "sale_id"> & {
  id: number;
};

/**
 * Una venta en el historial: lo justo para la fila de la lista. Las líneas y
 * los pagos no vienen aquí porque el historial de un día puede ser largo y
 * cada venta arrastraría varias filas más.
 */
export type SaleListItemData = {
  id: number;
  invoice_number: string;
  created_at: string;
  status: SALE_STATUS;
  sale_type: SALE_TYPE;
  total_usd: number;
  /** Nombre del cliente, o `null` si fue una venta de mostrador. */
  customer_name: string | null;
  /** Quién la hizo, ya resuelto. */
  seller_name: string;
  /** Cuántas líneas tiene, para el resumen de la fila. */
  item_count: number;
};

/** Una página del historial de ventas. */
export type SalePageData = {
  items: SaleListItemData[];
  total: number;
};

/**
 * Una venta completa: es lo que necesita el recibo y la pantalla de detalle.
 * Los datos del negocio y de la factura no viven aquí, los pone el generador
 * del recibo desde la configuración.
 */
export type SaleData = SaleEntity & {
  id: number;
  created_at: string;
  customer_name: string | null;
  customer_document: string | null;
  customer_phone: string | null;
  seller_name: string;
  /**
   * Lo que quedó a deber por esta venta y para cuándo, si fue fiada. Sale de
   * la fila de `debt`: derivarlo restando los cobros daría otro número en
   * cuanto el módulo de deudas registre el primer abono.
   */
  debt_amount_usd: number | null;
  debt_due_date: string | null;
  items: SaleItemData[];
  payments: SalePaymentData[];
};

/** Lo cobrado con una forma de pago concreta durante el cierre de caja. */
export type CashUpMethodData = {
  payment_method_name: string;
  currency: CURRENCY;
  /** Lo que entregaron los clientes, en esa moneda. */
  amount: number;
  /** Lo mismo en dólares, para poder sumar peras con manzanas. */
  amount_usd: number;
};

/**
 * El cierre de caja de un cajero (o de todos) en un día: cuánto vendió y
 * cuánto debería haber en la gaveta.
 */
export type CashUpData = {
  sales_count: number;
  voided_count: number;
  /** Total facturado sin contar las anuladas. */
  total_usd: number;
  /** Lo que se llevaron fiado y todavía no está cobrado. */
  credit_usd: number;
  /** Vuelto entregado. Ya está descontado de lo que hay en la gaveta. */
  change_usd: number;
  /** Lo cobrado de verdad, por forma de pago y moneda. */
  methods: CashUpMethodData[];
};

import type { APP_ACTIONS, INVOICE_STATUS } from './enums';

export interface Category {
  id: number;
  name: string;
  color: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  categoryId: number | null;
  createdAt: Date;
  updatedAt: Date;
  category: Category | null;
}

export interface ShoppingList {
  id: number;
  productId: number;
  isPurchased: boolean;
  product: Product;
}

export interface Sale {
  id: number;
  productId: number;
  productQuantity: number;
  product: Product;
  currentProductQuantity?: number;
}

export interface Customer {
  id: number;
  name: string;
  dni: string;
  din_prefix: string;
  phone: string;
}

export interface SaleToCustomer {
  id: number;
  customerId: number;
  saleId: number;
  customer: Customer;
  sale: Sale;
}

export interface Invoice {
  id: number;
  items: SaleToCustomer[];
  total: string;
  status: INVOICE_STATUS;
  generatedAt: string;
  customerName: string;
  paidAt?: string;
  canceledAt?: string;
  customer?: Customer;
}

export interface InvoiceTemplate {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Setting {
  id: number;
  businessName: string;
  logoUrl: string;
  minimumStock: number;
  invoiceTemplateId: number;
  invoiceTemplate?: InvoiceTemplate;
}

export interface Notification {
  id: number;
  action: APP_ACTIONS;
  description: string;
  emittedAt: string;
}

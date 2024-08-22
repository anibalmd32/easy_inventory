import type { ActionTypes, InvoiceStatus } from "./enums";

export interface Category {
	id: number;
	name: string;
}

export interface Product {
	id: number;
	name: string;
	price: string;
	quantity: number;
	categoryId?: number;
	createdAt: string;
	updatedAt: string;
}

export interface ShopingList {
	id: number;
	productId: number;
	isPurchased: boolean;
}

export interface Sale {
	id: number;
	productId: number;
	productQuantity: number;
}

export interface Customer {
	id: number;
	name: string;
	dni: string;
	phone: string;
}

export interface SaleToCustomer {
	id: number;
	customerId: number;
	saleId: number;
}

export interface Invoice {
	id: number;
	items: SaleToCustomer[];
	total: string;
	status: InvoiceStatus;
	generatedAt: string;
	paidAt?: string;
	canceledAt?: string;
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
}

export interface Notification {
	id: number;
	action: ActionTypes;
	description: string;
	emitedAt: string;
}

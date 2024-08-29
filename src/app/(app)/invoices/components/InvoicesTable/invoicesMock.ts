import { InvoiceData } from "../../definitions/invoicesData";
import { InvoiceStatus } from "@/definitions/enums";
import { Prisma } from "@prisma/client";

export interface Item {
	id: number;
	name: string;
	price: number;
	quantity: number;
	category: {
		id: number;
		name: string;
	};
	createdAt: string;
}

const items: Prisma.JsonValue[] = [
	{
		id: 1,
		name: "Producto 1",
		price: 100,
		quantity: 1,
		category: {
			id: 1,
			name: "Category 1",
		},
		createdAt: ''
	},
	{
		id: 2,
		name: "Producto 2",
		price: 200,
		quantity: 2,
		category: {
			id: 2,
			name: "Category 2",
		},
		createdAt: ''
	},
	{
		id: 3,
		name: "Producto 3",
		price: 300,
		quantity: 3,
		category: {
			id: 3,
			name: "Category 3",
		},
		createdAt: ''
	}
]

export const invoicesMock: InvoiceData[] = [
	{
		id: 1,
		customer: {
			id: 1,
			name: "Juan Mendoza",
			phone: "555-123-4567",
			dni: "12345678",
		},
		status: InvoiceStatus.PAID,
		generatedAt: new Date(),
		customerId: 1,
		items: items,
		total: "100",
		canceledAt: null,
		paidAt: new Date(),
	},
	{
		id: 2,
		customer: {
			id: 2,
			name: "Juan Perez",
			phone: "555-123-4567",
			dni: "12345678",
		},
		status: InvoiceStatus.PAID,
		generatedAt: new Date(),
		customerId: 2,
		items: items,
		total: "200",
		canceledAt: null,
		paidAt: new Date(),
	},
	{
		id: 3,
		customer: {
			id: 3,
			name: "Juan Perez",
			phone: "555-123-4567",
			dni: "12345678",
		},
		status: InvoiceStatus.PAID,
		generatedAt: new Date(),
		customerId: 3,
		items: items,
		total: "300",
		canceledAt: null,
		paidAt: new Date(),
	},
	{
		id: 4,
		customer: {
			id: 4,
			name: "Juan Perez",
			phone: "555-123-4567",
			dni: "12345678",
		},
		status: InvoiceStatus.CANCELED,
		generatedAt: new Date(),
		customerId: 4,
		items: items,
		total: "400",
		canceledAt: null,
		paidAt: null,
	},
	{
		id: 5,
		customer: {
			id: 5,
			name: "Juan Perez",
			phone: "555-123-4567",
			dni: "12345678",
		},
		status: InvoiceStatus.PENDING,
		generatedAt: new Date(),
		customerId: 5,
		items: items,
		total: "500",
		canceledAt: null,
		paidAt: null,
	},
	{
		id: 6,
		customer: {
			id: 6,
			name: "Juan Perez",
			phone: "555-123-4567",
			dni: "12345678",
		},
		status: InvoiceStatus.PAID,
		generatedAt: new Date(),
		customerId: 6,
		items: items,
		total: "600",
		canceledAt: null,
		paidAt: new Date(),
	},
	{
		id: 7,
		customer: {
			id: 7,
			name: "Juan Perez",
			phone: "555-123-4567",
			dni: "12345678",
		},
		status: InvoiceStatus.PAID,
		generatedAt: new Date(),
		customerId: 7,
		items: items,
		total: "700",
		canceledAt: null,
		paidAt: new Date(),
	},
	{
		id: 8,
		customer: {
			id: 8,
			name: "Juan Perez",
			phone: "555-123-4567",
			dni: "12345678",
		},
		status: InvoiceStatus.PAID,
		generatedAt: new Date(),
		customerId: 8,
		items: items,
		total: "800",
		canceledAt: null,
		paidAt: new Date(),
	},
	{
		id: 9,
		customer: {
			id: 9,
			name: "Juan Perez",
			phone: "555-123-4567",
			dni: "12345678",
		},
		status: InvoiceStatus.PAID,
		generatedAt: new Date(),
		customerId: 9,
		items: items,
		total: "900",
		canceledAt: null,
		paidAt: new Date(),
	},
	{
		id: 10,
		customer: {
			id: 10,
			name: "Juan Perez",
			phone: "555-123-4567",
			dni: "12345678",
		},
		status: InvoiceStatus.PAID,
		generatedAt: new Date(),
		customerId: 10,
		items: items,
		total: "1000",
		canceledAt: null,
		paidAt: new Date(),
	},
	{
		id: 11,
		customer: {
			id: 11,
			name: "Juan Perez",
			phone: "555-123-4567",
			dni: "12345678",
		},
		status: InvoiceStatus.PAID,
		generatedAt: new Date(),
		customerId: 11,
		items: items,
		total: "1100",
		canceledAt: null,
		paidAt: new Date(),
	},
	{
		id: 12,
		customer: {
			id: 12,
			name: "Juan Perez",
			phone: "555-123-4567",
			dni: "12345678",
		},
		status: InvoiceStatus.PAID,
		generatedAt: new Date(),
		customerId: 12,
		items: items,
		total: "1200",
		canceledAt: null,
		paidAt: new Date(),
	},
	{
		id: 13,
		customer: {
			id: 13,
			name: "Juan Perez",
			phone: "555-123-4567",
			dni: "12345678",
		},
		status: InvoiceStatus.PAID,
		generatedAt: new Date(),
		customerId: 13,
		items: items,
		total: "1300",
		canceledAt: null,
		paidAt: new Date(),
	},
]
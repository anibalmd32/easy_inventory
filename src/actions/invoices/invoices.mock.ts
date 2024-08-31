import { Invoice, INVOICE_STATUS, SaleToCustomer, Customer, Sale } from "@/definitions/";
import { productsMock } from "../Products/products.mock";

export const customersMock: Customer[] = [
	{ id: 1, name: "Phillipe Smith", phone: "555-123-4567", dni: "12345678" },
	{ id: 2, name: "Jhon Doe", phone: "555-123-4567", dni: "12345678" },
	{ id: 3, name: "Mark Johnson", phone: "555-123-4567", dni: "12345678" },
]

export const salesMock: Sale[] = [
	{ id: 1, productId: 1, productQuantity: 12, product: productsMock[0] },
	{ id: 2, productId: 2, productQuantity: 9, product: productsMock[1] },
	{ id: 3, productId: 3, productQuantity: 10, product: productsMock[2] },
]

export const saleToCustomersMock: SaleToCustomer[] = [
	{ id: 1, customerId: 1, saleId: 1, customer: customersMock[0], sale: salesMock[0] },
	{ id: 2, customerId: 2, saleId: 2, customer: customersMock[1], sale: salesMock[1] },
	{ id: 3, customerId: 3, saleId: 3, customer: customersMock[2], sale: salesMock[2] },
]

export const invoicesMock: Invoice[] = [
	{
		id: 1,
		items: saleToCustomersMock,
		total: "100",
		generatedAt: new Date().toDateString(),
		status: INVOICE_STATUS.PAID,
		paidAt: new Date().toDateString(),
	},
	{
		id: 2,
		items: saleToCustomersMock,
		total: "200",
		status: INVOICE_STATUS.PAID,
		generatedAt: new Date().toDateString(),
		paidAt: new Date().toDateString(),
	},
	{
		id: 3,
		items: saleToCustomersMock,
		total: "300",
		status: INVOICE_STATUS.PAID,
		generatedAt: new Date().toDateString(),
		paidAt: new Date().toDateString(),
	},
	{
		id: 4,
		items: saleToCustomersMock,
		total: "400",
		status: INVOICE_STATUS.CANCELED,
		generatedAt: new Date().toDateString(),
		canceledAt: new Date().toDateString(),
	},
	{
		id: 5,
		items: saleToCustomersMock,
		total: "500",
		status: INVOICE_STATUS.PENDING,
		generatedAt: new Date().toDateString(),
	},
	{
		id: 6,
		items: saleToCustomersMock,
		total: "600",
		status: INVOICE_STATUS.PAID,
		generatedAt: new Date().toDateString(),
		paidAt: new Date().toDateString(),
	},
	{
		id: 7,
		items: saleToCustomersMock,
		total: "700",
		status: INVOICE_STATUS.PAID,
		generatedAt: new Date().toDateString(),
		paidAt: new Date().toDateString(),
	},
	{
		id: 8,
		items: saleToCustomersMock,
		total: "800",
		status: INVOICE_STATUS.PAID,
		generatedAt: new Date().toDateString(),
		paidAt: new Date().toDateString(),
	},
	{
		id: 9,
		items: saleToCustomersMock,
		total: "900",
		status: INVOICE_STATUS.PAID,
		generatedAt: new Date().toDateString(),
		paidAt: new Date().toDateString(),
	},
	{
		id: 10,
		items: saleToCustomersMock,
		total: "1000",
		status: INVOICE_STATUS.PAID,
		generatedAt: new Date().toDateString(),
		paidAt: new Date().toDateString(),
	},
	{
		id: 11,
		items: saleToCustomersMock,
		total: "1100",
		status: INVOICE_STATUS.PAID,
		generatedAt: new Date().toDateString(),
		paidAt: new Date().toDateString(),
	},
	{
		id: 12,
		items: saleToCustomersMock,
		total: "1200",
		status: INVOICE_STATUS.PAID,
		generatedAt: new Date().toDateString(),
		paidAt: new Date().toDateString(),
	},
	{
		id: 13,
		items: saleToCustomersMock,
		total: "1300",
		status: INVOICE_STATUS.PAID,
		generatedAt: new Date().toDateString(),
		paidAt: new Date().toDateString(),
	},
]
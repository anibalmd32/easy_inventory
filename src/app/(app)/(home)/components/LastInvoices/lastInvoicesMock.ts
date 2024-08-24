import { Invoice } from "@/definitions/entities";
import { InvoiceStatus } from "@/definitions/enums";

interface LastInvoiceMockItem extends Omit<Invoice, "items"> {} 

export const lastInvoicesMock: LastInvoiceMockItem[] = [
	{
		id: 1,
		generatedAt: "2023-01-01T00:00:00.000Z",
		total: "100.00",
		status: InvoiceStatus.PAID,
	},
	{
		id: 2,
		generatedAt: "2023-02-01T00:00:00.000Z",
		total: "200.00",
		status: InvoiceStatus.PAID,
	},
	{
		id: 3,
		generatedAt: "2023-03-01T00:00:00.000Z",
		total: "300.00",
		status: InvoiceStatus.PAID,
	},
	{
		id: 4,
		generatedAt: "2023-04-01T00:00:00.000Z",
		total: "400.00",
		status: InvoiceStatus.PAID,
	},
	{
		id: 5,
		generatedAt: "2023-05-01T00:00:00.000Z",
		total: "500.00",
		status: InvoiceStatus.PAID,
	},
]

'use server'
import { invoicesMock } from "../invoices/invoices.mock"

export class InvoicesServer {
	async getInvoices() {
		return invoicesMock
	}
}

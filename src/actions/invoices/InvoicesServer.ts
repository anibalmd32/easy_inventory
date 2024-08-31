'use server'
import { invoicesMock } from "../invoices/invoices.mock"

export async function getInvoices() {
	return invoicesMock
}

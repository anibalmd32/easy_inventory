import { Invoice, Customer } from "@prisma/client"

export interface InvoiceData extends Invoice {
	customer: Customer;
}

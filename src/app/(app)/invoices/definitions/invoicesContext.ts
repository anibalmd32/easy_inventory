import { InvoiceData } from "./invoicesData"
import { Table } from "@tanstack/react-table";

export interface InvoiceCtx {
	invoices: InvoiceData[];
}

export interface DataTableCtx {
	table: Table<InvoiceData>;
}

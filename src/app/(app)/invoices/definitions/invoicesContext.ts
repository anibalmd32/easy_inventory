import { InvoiceData } from "./data"
import { Table } from "@tanstack/react-table";

export interface InvoiceCtx {
	invoices: InvoiceData[];
}

export interface DataTableCtx {
	table: Table<InvoiceData>;
}

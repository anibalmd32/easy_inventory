'use client'

import { InvoicesTable } from "../InvoicesTable"
import { useInvoicesTable } from "../../hooks/useInvoicesTable"
import { InvoicesTablePagination } from "../InvoicesTable/InvoicesTablePagination";
import { InvoicesFilter } from "../InvoicesFilters/InvoicesFilter";

export function TableContainer() {
	const { table } = useInvoicesTable();

	return (
		<>
			<InvoicesFilter table={table} />
			<InvoicesTable table={table} />
			<InvoicesTablePagination table={table} />
		</>
	)
}

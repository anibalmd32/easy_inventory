'use client'
import { DataTable } from "@/components/shared/DataTable";
import { invoicesTableColumns } from './invoicesTableColumns'
import { useInvoices } from "../../hooks/useInvoices";

export function InvoicesTable() {
	const { invoices } = useInvoices();

	return (
		<div>
			<DataTable
				columns={invoicesTableColumns}
				data={invoices}
				filterColumn="customer"
			/>
		</div>
	)
}

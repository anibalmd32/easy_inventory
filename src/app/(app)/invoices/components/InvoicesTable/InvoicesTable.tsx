'use client'

import { DataTable } from "@/components/shared/DataTable";
import { useInvoicesTable } from "../../hooks/useInvoicesTable";
import { invoicesTableColumns } from '../../utils/invoicesTableColumns'

export function InvoicesTable() {
	const { table } = useInvoicesTable();

	return (
		<div>
			<DataTable
				columns={invoicesTableColumns}
				tableHook={table}
				filterColumn="customer"
			/>
		</div>
	)
}

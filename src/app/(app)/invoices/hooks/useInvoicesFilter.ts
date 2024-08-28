import * as React from "react"
import { ColumnFiltersState } from "@tanstack/react-table"

export function useInvoicesFilter() {
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

	return {
		columnFilters,
		setColumnFilters,
	}
}

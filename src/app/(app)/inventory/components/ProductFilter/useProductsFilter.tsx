import * as React from "react"
import { ColumnFiltersState } from "@tanstack/react-table"

export function useProductsFilter() {
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

	return {
		columnFilters,
		setColumnFilters,
	}
}

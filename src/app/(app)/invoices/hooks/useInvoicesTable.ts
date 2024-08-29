'use client'

import {
	ColumnFiltersState,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
	SortingState,
	getSortedRowModel,
} from "@tanstack/react-table";
import { invoicesTableColumns } from '../utils/invoicesTableColumns'
import { useInvoices } from "../context/useInvoices";
import React from "react";

export const useInvoicesTable = () => {
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
	const [sorting, setSorting] = React.useState<SortingState>([])

	const { invoices } = useInvoices();

	const table = useReactTable({
		data: invoices,
		columns: invoicesTableColumns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onSortingChange: setSorting,
    	getSortedRowModel: getSortedRowModel(),
		state: {
			columnFilters,
			sorting,
		}
	});

	return {
	  table
  };
};
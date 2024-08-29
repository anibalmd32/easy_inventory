'use client'

import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { invoicesTableColumns } from '../utils/invoicesTableColumns'
import { useInvoices } from "../context/useInvoices";
import { useInvoicesFilter } from "./useInvoicesFilter";

export const useInvoicesTable = () => {
	const { invoices } = useInvoices();
	const { setColumnFilters, columnFilters } = useInvoicesFilter();

	const table = useReactTable({
		data: invoices,
		columns: invoicesTableColumns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
		  columnFilters,
		}
	});

	return {
	  table
  };
};
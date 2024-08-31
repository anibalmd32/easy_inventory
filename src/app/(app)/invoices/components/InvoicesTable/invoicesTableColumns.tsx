"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Invoice, INVOICE_STATUS } from '@/definitions'
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import * as ShadDropdown from "@/components/ui/dropdown-menu"
import { InvoiceDetails } from "./InvoicesTableActions"
import { DataTableColumnHeader } from "@/components/shared/DataTable"
import { formatDate } from '@/lib/utils'

export const invoicesTableColumns: ColumnDef<Invoice>[] = [
	{
		accessorKey: 'id',
		enableSorting: true,
		header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
		cell: ({ row }) => {
			return <div className="min-w-16">{ row.getValue('id')}</div>
		}
	},
	{
		accessorKey: 'customer',
		enableSorting: false,
		enableColumnFilter: true,
		header: ({ column }) => <DataTableColumnHeader column={column} title="Cliente" />,
		cell: ({ row }) => {
			const customer = row.original.items[0].customer;
			return <div className="min-w-16">{ customer.name }</div>
		}
	},
	{
		accessorKey: 'status',
		enableSorting: false,
		header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
		cell: ({ row }) => {
			const original = row.original;
			const status = original.status;
			const quantityClass = status === INVOICE_STATUS.PAID ? 'text-green-500' : 'text-red-500';

			return (
				<Badge className={quantityClass}>
					{status === INVOICE_STATUS.PAID && "Pagada"}
					{status === INVOICE_STATUS.CANCELED && "Cancelada"}
					{status === INVOICE_STATUS.PENDING && "Por pagar"}
				</Badge>
			)
		}
	},
	{
		accessorKey: 'total',
		enableSorting: true,
		header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
		cell: ({ row }) => {
			const total = row.original.total
			return <div className="min-w-16">${ total }</div>
		}
	},
	{
		accessorKey: 'generatedAt',
		enableSorting: false,
		header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha" />,
		cell: ({ row }) => {
			const date = new Date(row.original.generatedAt)
			const formatedDate = formatDate(date)

			return (
				<div className="min-w-16">
					{formatedDate}
				</div>
			)
		}
	},
	{
    id: "actions",
    cell: ({ row }) => {
		
		return (
			<ShadDropdown.DropdownMenu>
				<ShadDropdown.DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</ShadDropdown.DropdownMenuTrigger>
				<ShadDropdown.DropdownMenuContent align="end" className="bg-gray-800 text-gray-200">
					<ShadDropdown.DropdownMenuLabel>
						Acciones
					</ShadDropdown.DropdownMenuLabel>

					<ShadDropdown.DropdownMenuSeparator />

					<InvoiceDetails rowData={row.original} />
				</ShadDropdown.DropdownMenuContent>
			</ShadDropdown.DropdownMenu>	
		)},
	},
]

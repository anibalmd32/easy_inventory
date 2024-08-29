"use client"
import { ColumnDef } from "@tanstack/react-table"
import { InvoiceData } from '../definitions/invoicesData'
import { InvoiceStatus } from "@/definitions/enums"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { InvoiceDetails } from "../components/InvoicesTable/InvoicesTableActions"
import { DataTableColumnHeader } from "@/components/shared/DataTable"

export const invoicesTableColumns: ColumnDef<InvoiceData>[] = [
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
			const customer = row.original.customer;
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
			const quantityClass = status === InvoiceStatus.PAID ? 'text-green-500' : 'text-red-500';

			return (
				<Badge className={quantityClass}>
					{status === InvoiceStatus.PAID && "Pagada"}
					{status === InvoiceStatus.CANCELED && "Cancelada"}
					{status === InvoiceStatus.PENDING && "Por pagar"}
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
			const date = row.original.generatedAt
			const formatedDate = date.toLocaleDateString('es-ES', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			})

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
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-8 w-8 p-0">
					<MoreHorizontal className="h-4 w-4" />
				</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="bg-gray-800 text-gray-200">
					<DropdownMenuLabel>Acciones</DropdownMenuLabel>

					<DropdownMenuSeparator />

					<InvoiceDetails rowData={row.original} />
				</DropdownMenuContent>
			</DropdownMenu>
			)
		},
	},
]

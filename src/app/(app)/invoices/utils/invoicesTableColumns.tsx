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

export const invoicesTableColumns: ColumnDef<InvoiceData>[] = [
	{
		accessorKey: 'id',
		header: () => <div className="text-gray-200 font-bold">ID</div>,
		enableSorting: true,
		enableColumnFilter: true,
		cell: ({ row }) => {
			return <div>{ row.getValue('id')}</div>
		}
	},
	{
		accessorKey: 'customer',
		header: () => <div className="text-gray-200 font-bold">Cliente</div>,
		enableSorting: true,
		enableColumnFilter: true,
		cell: ({ row }) => {
			const customer = row.original.customer;
			return <div>{ customer.name }</div>
		}
	},
	{
		accessorKey: 'status',
		header: () => <div className="text-gray-200 font-bold">Estado</div>,
		enableSorting: true,
		enableColumnFilter: true,
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
		header: () => <div className="text-gray-200 font-bold">Total</div>,
		enableSorting: true,
		enableColumnFilter: true,
		cell: ({ row }) => {
			const total = row.original.total
			return <div>${ total }</div>
		}
	},
	{
		accessorKey: 'generatedAt',
		header: () => <div className="text-gray-200 font-bold">Fecha</div>,
		enableSorting: true,
		enableColumnFilter: true,
		cell: ({ row }) => {
			const date = row.original.generatedAt
			const formatedDate = date.toLocaleDateString('es-ES', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			})

			return (
				<div className="text-gray-200">
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

"use client"
import { ColumnDef } from "@tanstack/react-table"
import { ProductData } from '../../definitions/inventoryData'
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { EditProductBtn, DeletProductBtn } from "./PorductsTableActions"

export const ProductsTableColumns: ColumnDef<ProductData>[] = [
	{
		accessorKey: 'name',
		header: () => <div className="text-gray-200 font-bold">Nombre</div>,
		enableSorting: true,
		enableColumnFilter: true,
		cell: ({ row }) => {
			return <div>{ row.getValue('name')}</div>
		}
	},
	{
		accessorKey: 'price',
		header: () => <div className="text-gray-200 font-bold">Precio</div>,
		enableSorting: true,
		enableColumnFilter: true,
		cell: ({ row }) => {
			return <div>${ row.getValue('price')}</div>
		}
	},
	{
		accessorKey: 'quantity',
		header: () => <div className="text-gray-200 font-bold">Cantidad</div>,
		enableSorting: true,
		enableColumnFilter: true,
		cell: ({ row }) => {
			const original = row.original;
			const quantity = original.quantity;
			const quantityClass = quantity > 5 ? 'text-green-500' : 'text-red-500';

			return <div className={quantityClass}>{ row.getValue('quantity')}</div>
		}
	},
	{
		accessorKey: 'category',
		header: () => <div className="text-gray-200 font-bold">Categoria</div>,
		enableSorting: true,
		enableColumnFilter: true,
		cell: ({ row }) => {
			return <Badge variant={'secondary'}>
				{row.original.category ? row.original.category.name : 'Sin categoria'}
			</Badge>
		}
	},
	
	{
		accessorKey: 'createdAt',
		header: () => <div className="text-gray-200 font-bold">Creado</div>,
		enableSorting: true,
		enableColumnFilter: true,
		cell: ({ row }) => {
			const date = new Date(row.getValue('createdAt'));
			return <div>{date.toLocaleDateString('es-ES', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			}) }</div>
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

					<EditProductBtn rowData={row.original} />
					<DeletProductBtn rowData={row.original} />
				</DropdownMenuContent>
			</DropdownMenu>
			)
		},
	},
]

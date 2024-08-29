"use client"
import { ColumnDef } from "@tanstack/react-table"
import { ProductData } from '../definitions/inventoryData'
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
import { EditProductBtn, DeletProductBtn } from "../components/ProductsTable/ProductsTableActions"
import { DataTableColumnHeader } from "@/components/shared/DataTable"
import { formatDate	} from "@/lib/utils"

export const productsTableColumns: ColumnDef<ProductData>[] = [
	{
		accessorKey: 'name',
		enableSorting: false,
		enableColumnFilter: true,
		header: ({column}) => <DataTableColumnHeader column={column} title="Nombre" />,
		cell: ({ row }) => {
			return <div>{ row.getValue('name')}</div>
		}
	},
	{
		accessorKey: 'price',
		enableSorting: true,
		enableColumnFilter: false,
		header: ({column}) => <DataTableColumnHeader column={column} title="Precio" />,
		cell: ({ row }) => {
			return <div>${ row.getValue('price')}</div>
		}
	},
	{
		accessorKey: 'quantity',
		enableSorting: true,
		enableColumnFilter: false,
		header: ({column}) => <DataTableColumnHeader column={column} title="Cantidad" />,
		cell: ({ row }) => {
			const original = row.original;
			const quantity = original.quantity;
			const quantityClass = quantity > 5 ? 'text-green-500' : 'text-red-500';

			return <div className={quantityClass}>{ row.getValue('quantity')}</div>
		}
	},
	{
		accessorKey: 'category',
		enableSorting: false,
		enableColumnFilter: false,
		header: ({column}) => <DataTableColumnHeader column={column} title="Categoria" />,
		cell: ({ row }) => {
			return <Badge variant={'default'}>
				{row.original.category ? row.original.category.name : 'Sin categoria'}
			</Badge>
		}
	},
	
	{
		accessorKey: 'createdAt',
		enableSorting: true,
		enableColumnFilter: false,
		header: ({column}) => <DataTableColumnHeader column={column} title="Agregado" />,
		cell: ({ row }) => {
			const date = new Date(row.getValue('createdAt'));
			return <div>{formatDate(date)}</div>
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

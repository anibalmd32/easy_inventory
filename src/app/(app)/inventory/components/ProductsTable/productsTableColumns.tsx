"use client"
import { DataTableColumnHeader } from "@/components/shared/DataTable"
import * as ShadDropdown from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EditProductBtn, DeleteProductBtn } from "./ProductsTableActions"
import { MoreHorizontal } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { Product } from '@/definitions'
import { formatDate } from "@/lib/utils"

export const productsTableColumns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    enableSorting: false,
    enableColumnFilter: true,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nombre" />,
    cell: ({ row }) => {
      return <div>{row.getValue('name')}</div>
    }
  },
  {
    accessorKey: 'price',
    enableSorting: true,
    enableColumnFilter: false,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Precio" />,
    cell: ({ row }) => {
      return <div>${row.getValue('price')}</div>
    }
  },
  {
    accessorKey: 'quantity',
    enableSorting: true,
    enableColumnFilter: false,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cantidad" />,
    cell: ({ row }) => {
      const original = row.original;
      const quantity = original.quantity;
      const quantityClass = quantity > 5 ? 'text-green-500' : 'text-red-500';

      return <div className={quantityClass}>{row.getValue('quantity')}</div>
    }
  },
  {
    accessorKey: 'category',
    enableSorting: false,
    enableColumnFilter: false,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Categoria" />,
    cell: ({ row }) => {
      const category = row.original.category;
      return (
        <Badge variant={'default'} style={{ backgroundColor: category?.color }}>
          {category ? category.name : 'Sin categoría'}
        </Badge>
      )
    }
  },
  {
    accessorKey: 'createdAt',
    enableSorting: true,
    enableColumnFilter: false,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Agregado" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return <div>{formatDate(date)}</div>
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
            <ShadDropdown.DropdownMenuLabel>Acciones</ShadDropdown.DropdownMenuLabel>

            <ShadDropdown.DropdownMenuSeparator />

            <EditProductBtn rowData={row.original} />
            <DeleteProductBtn rowData={row.original} />
          </ShadDropdown.DropdownMenuContent>
        </ShadDropdown.DropdownMenu>
      )
    },
  },
]

'use client';
import { DataTableColumnHeader } from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { Product } from '@/definitions';
import { formatDate } from '@/lib/utils';
import { ProductsTableActionsDropdown } from './ProductsTableActionsDropdown';

export const productsTableColumns = (
  dolarPrice: number | null,
): ColumnDef<Product>[] => {
  return [
    {
      accessorKey: 'name',
      enableSorting: false,
      enableColumnFilter: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nombre" />
      ),
      cell: ({ row }) => {
        return <div>{row.getValue('name')}</div>;
      },
    },
    {
      accessorKey: 'price',
      enableSorting: true,
      enableColumnFilter: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Precio" />
      ),
      cell: ({ row }) => {
        const bsPrice = dolarPrice
          ? dolarPrice * Number(row.getValue('price'))
          : null;

        return (
          <div>
            ${row.getValue('price')} {bsPrice && <span>(Bs. {bsPrice})</span>}
          </div>
        );
      },
    },
    {
      accessorKey: 'quantity',
      enableSorting: true,
      enableColumnFilter: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Cantidad" />
      ),
      cell: ({ row }) => {
        const original = row.original;
        const quantity = original.quantity;
        const quantityClass = quantity > 5 ? 'text-green-500' : 'text-red-500';

        return <div className={quantityClass}>{row.getValue('quantity')}</div>;
      },
    },
    {
      accessorKey: 'category',
      enableSorting: false,
      enableColumnFilter: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Categoría" />
      ),
      cell: ({ row }) => {
        const category = row.original.category;
        return (
          <Badge
            variant={'default'}
            style={{ backgroundColor: category?.color }}
          >
            {category ? category.name : 'Sin categoría'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      enableSorting: true,
      enableColumnFilter: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Agregado" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'));
        return <div>{formatDate(date)}</div>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <ProductsTableActionsDropdown rowData={row.original} />
      ),
    },
  ];
};

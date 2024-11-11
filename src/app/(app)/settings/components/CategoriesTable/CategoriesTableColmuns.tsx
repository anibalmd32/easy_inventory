import { DataTableColumnHeader } from '@/components/shared/DataTable';
import { Category } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';

import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as ShadDropdown from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { DeleteCategory, EditCategory } from './CategoriesTableActions';

export const categoriesTableColumns: ColumnDef<Category>[] = [
  {
    accessorKey: 'name',
    enableSorting: true,

    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Nombre" />;
    },

    cell: ({ row }) => {
      return <div>{row.getValue('name')}</div>;
    },
  },

  {
    accessorKey: 'color',
    enableSorting: true,

    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Color" />;
    },

    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full"
            style={{ backgroundColor: row.getValue('color') }}
          />
          <span className="text-xs font-bold">{row.getValue('color')}</span>
        </div>
      );
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <ShadDropdown.DropdownMenu>
          <ShadDropdown.DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </ShadDropdown.DropdownMenuTrigger>
          <ShadDropdown.DropdownMenuContent
            align="end"
            className="bg-gray-800 text-gray-200"
          >
            <ShadDropdown.DropdownMenuLabel>
              Acciones
            </ShadDropdown.DropdownMenuLabel>

            <ShadDropdown.DropdownMenuSeparator />
            <EditCategory rowData={row.original} />
            <DeleteCategory rowData={row.original} />
          </ShadDropdown.DropdownMenuContent>
        </ShadDropdown.DropdownMenu>
      );
    },
  },
];

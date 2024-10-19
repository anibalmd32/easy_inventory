'use client';
import * as ShadDropdown from '@/components/ui/dropdown-menu';
import { DeleteProductBtn, EditProductBtn, ProductsTableActionsProps } from './ProductsTableActions';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { useInventory } from '../../InventoryProvider';

export function ProductsTableActionsDropdown({ rowData }: ProductsTableActionsProps) {
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

        <EditProductBtn rowData={rowData} />
        <DeleteProductBtn rowData={rowData} />
      </ShadDropdown.DropdownMenuContent>
    </ShadDropdown.DropdownMenu>
  );
}
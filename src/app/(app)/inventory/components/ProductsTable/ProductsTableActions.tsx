'use client'
import React from "react"
import * as ShadAlert from "@/components/ui/alert-dialog"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useInventory } from '../../hooks/useInventory'
import { Product } from "@/definitions";
import { useProductForm } from '../ProductsForm'

interface ProductsTableActionsProps {
  rowData: Product;
}

export const EditProductBtn = ({ rowData }: ProductsTableActionsProps) => {
  const { setOpenForm, setDefaultValues, setProductId } = useProductForm()

  const handleEdit = () => {
    setProductId(rowData.id);
    setDefaultValues({
      name: rowData.name,
      price: rowData.price,
      quantity: String(rowData.quantity),
      category: rowData.category?.id ? String(rowData.category.id) : null
    });
    setOpenForm(true);
  }

  return (
    <DropdownMenuItem
      className="cursor-pointer"
      onClick={handleEdit}
    >
      Editar
    </DropdownMenuItem>
  );
}

export const DeleteProductBtn = ({ rowData }: ProductsTableActionsProps) => {
  const { productsOperations } = useInventory()

  return (
    <ShadAlert.AlertDialog>
      <ShadAlert.AlertDialogTrigger className="cursor-pointer hover:bg-gray-200 text-gray-200 hover:text-black transition-all duration-300 w-full p-1 pl-2 rounded-sm text-left mt-1 text-sm">
        Eliminar
      </ShadAlert.AlertDialogTrigger>
      <ShadAlert.AlertDialogContent className="bg-gray-950 text-gray-200">
        <ShadAlert.AlertDialogHeader>
          <ShadAlert.AlertDialogTitle>
            Estas seguro?
          </ShadAlert.AlertDialogTitle>
          <ShadAlert.AlertDialogDescription>
            Esta acción eliminara el producto del inventario
          </ShadAlert.AlertDialogDescription>
        </ShadAlert.AlertDialogHeader>
        <ShadAlert.AlertDialogFooter>
          <ShadAlert.AlertDialogCancel className="bg-gray-900 hover:bg-gray-800 hover:text-gray-200 text-gray-200 transition-all duration-300">
            Cancelar
          </ShadAlert.AlertDialogCancel>
          <ShadAlert.AlertDialogAction
            onClick={async () => {
              await productsOperations.remove(rowData)
            }}
            className="bg-gray-900 hover:bg-gray-800 text-gray-200 transition-all duration-300"
          >
            Eliminar
          </ShadAlert.AlertDialogAction>
        </ShadAlert.AlertDialogFooter>
      </ShadAlert.AlertDialogContent>
    </ShadAlert.AlertDialog>
  );
}

import React from "react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import useInventory from "../../context/useInventory"
import { ProductData } from "../../definitions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


interface ProductsTableActionsProps {
	rowData: ProductData;
}

export const EditProductBtn = ({ rowData }: ProductsTableActionsProps) => {
    const { setOpenForm, setDefaultFormvalues, setProductId } = useInventory()

  return (
    <DropdownMenuItem className="cursor-pointer" onClick={() => {
      setProductId(rowData.id)
      setDefaultFormvalues({
        name: rowData.name,
        price: rowData.price,
        quantity: String(rowData.quantity),
        category: rowData.category?.id ? String(rowData.category.id) : null,
      })
      setOpenForm(true)
    }}>
      Editar
    </DropdownMenuItem>
  );
}

export const DeletProductBtn = ({ rowData }: ProductsTableActionsProps) => {
  const { productsOperations } = useInventory()
    
  return (
    <AlertDialog>
      <AlertDialogTrigger className="cursor-pointer hover:bg-gray-200 text-gray-200 hover:text-black transition-all duration-300 w-full p-1 pl-2 rounded-sm text-left mt-1 text-sm">
          Eliminar
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-gray-950 text-gray-200">
        <AlertDialogHeader>
          <AlertDialogTitle>Estas seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta accion eliminara el producto del inventario
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-900 hover:bg-gray-800 hover:text-gray-200 text-gray-200 transition-all duration-300">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await productsOperations.remove(rowData)
            }}
            className="bg-gray-900 hover:bg-gray-800 text-gray-200 transition-all duration-300"
          >
            Eliminar
          </AlertDialogAction>
          </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


      
import * as ShadAlert from '@/components/ui/alert-dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Category } from '@/definitions';
import { useSettings } from '../../../hooks/useSettings';

export const EditCategory = ({ rowData }: { rowData: Category }) => {
  const { useCategories } = useSettings();
  const { toggleForm, setDefaultFormValues } = useCategories();

  const handleEdit = () => {
    setDefaultFormValues(rowData);
    toggleForm();
  };

  return (
    <DropdownMenuItem className="cursor-pointer" onClick={handleEdit}>
      Editar
    </DropdownMenuItem>
  );
};

export const DeleteCategory = ({ rowData }: { rowData: Category }) => {
  return (
    <ShadAlert.AlertDialog>
      <ShadAlert.AlertDialogTrigger className="cursor-pointer hover:bg-gray-200 text-gray-200 hover:text-black transition-all duration-300 w-full p-1 pl-2 rounded-sm text-left mt-1 text-sm">
        Eliminar
      </ShadAlert.AlertDialogTrigger>
      <ShadAlert.AlertDialogContent className="bg-gray-950 text-gray-200">
        <ShadAlert.AlertDialogHeader>
          <ShadAlert.AlertDialogTitle>Estas seguro?</ShadAlert.AlertDialogTitle>
          <ShadAlert.AlertDialogDescription>
            Esta acción eliminara la categoría
          </ShadAlert.AlertDialogDescription>
        </ShadAlert.AlertDialogHeader>
        <ShadAlert.AlertDialogFooter>
          <ShadAlert.AlertDialogCancel className="bg-gray-900 hover:bg-gray-800 hover:text-gray-200 text-gray-200 transition-all duration-300">
            Cancelar
          </ShadAlert.AlertDialogCancel>
          <ShadAlert.AlertDialogAction
            onClick={async () => {
              await new Promise((resolve) => setTimeout(resolve, 1000));
              console.log('eliminando...', rowData);
            }}
            className="bg-gray-900 hover:bg-gray-800 text-gray-200 transition-all duration-300"
          >
            Eliminar
          </ShadAlert.AlertDialogAction>
        </ShadAlert.AlertDialogFooter>
      </ShadAlert.AlertDialogContent>
    </ShadAlert.AlertDialog>
  );
};

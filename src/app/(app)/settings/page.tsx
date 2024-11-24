import { PageTitle } from '@/components/shared/PageTitle';
import { SettingsProvider } from './SettingsProvider';
import CategoriesTable from './components/Categories/CategoriesTable/CategoriesTable';
import CategoryForm from './components/Categories/CategoriesForm/CategoryForm';

export const revalidate = 0;

export default async function SettingsPage() {
  return (
    <SettingsProvider>
      <PageTitle>Configuraciones</PageTitle>

      <div>
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold">Categorías</h2>
          <CategoryForm />
        </div>
        <CategoriesTable />
      </div>
    </SettingsProvider>
  );
}

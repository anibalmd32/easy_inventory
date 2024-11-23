import { PageTitle } from '@/components/shared/PageTitle';
import { SettingsProvider } from './SettingsProvider';
import CategoriesTable from './components/Categories/CategoriesTable/CategoriesTable';

export const revalidate = 0;

export default async function SettingsPage() {
  return (
    <SettingsProvider>
      <PageTitle>Configuraciones</PageTitle>
      <CategoriesTable />
    </SettingsProvider>
  );
}

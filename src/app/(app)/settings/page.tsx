import { PageTitle } from '@/components/shared/PageTitle';
import { SettingsProvider } from './SettingsProvider';
import { getSettings } from '@/actions/settings/settings.server';
import { Logo } from '@/app/(app)/settings/components/Logo/Logo';
import { MinimumStock } from './components/MinimumStock/MinimumStock';
import CreateCategory from './components/CreateCategory/CreateCategory';
import CategoriesTable from './components/CategoriesTable/CategoriesTable';

export const revalidate = 0;

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <SettingsProvider storedSettings={settings}>
      <PageTitle>Settings</PageTitle>
      <div className="flex justify-center gap-4 mb-7">
        <Logo />
        <MinimumStock />
        <CreateCategory />
      </div>
      <CategoriesTable />
    </SettingsProvider>
  );
}

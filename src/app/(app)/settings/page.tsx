import { SettingsProvider } from './SettingsProvider';
import { getSettings } from '@/actions/settings/settings.server';

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <SettingsProvider storedSettings={settings}>
      <div>Settings page</div>
    </SettingsProvider>
  );
}

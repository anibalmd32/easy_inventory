'use client';

import { createContext, useState } from 'react';
import { Setting } from '@/definitions';
import SettingsEventHandler from '@/eventHandlers/SettingsEventHandler';

interface SettingsCtx {
  settings: Setting;
  eventHandler: SettingsEventHandler;
}

interface ProviderProps {
  children: React.ReactNode;
  storedSettings: Setting;
}

export const SettingsContext = createContext<SettingsCtx>({} as SettingsCtx);

export function SettingsProvider(props: ProviderProps) {
  const [settings, setSettings] = useState<Setting>(props.storedSettings);

  const eventHandler = new SettingsEventHandler({});

  return (
    <SettingsContext.Provider
      value={{
        eventHandler,
        settings,
      }}
    >
      {props.children}
    </SettingsContext.Provider>
  );
}

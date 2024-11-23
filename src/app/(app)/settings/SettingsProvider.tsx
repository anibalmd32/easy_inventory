'use client';

import { createContext } from 'react';
import categoriesHook from './hooks/useCategories';

interface SettingsCtx {
  useCategories: typeof categoriesHook;
}

export const SettingsContext = createContext<SettingsCtx>({} as SettingsCtx);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  return (
    <SettingsContext.Provider
      value={{
        useCategories: categoriesHook,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

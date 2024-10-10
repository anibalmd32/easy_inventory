'use client';
import React, { createContext, useContext } from 'react';
import { Setting } from '@/definitions';
import ToastEventHandlers from '@/eventHandlers/ToastEventHandlers';
import { useToast } from '@/components/hooks/use-toast';

interface AppCtx {
  userSettings: Setting;
  toastEvents: ToastEventHandlers;
}

interface AppProviderProps extends Omit<AppCtx, 'toastEvents'> {
  children: React.ReactNode;
}

const AppContext = createContext<AppCtx>({} as AppCtx);

export const AppProvider = ({ children, userSettings }: AppProviderProps) => {
  const { toast } = useToast();

  return (
    <AppContext.Provider
      value={{
        userSettings,
        toastEvents: new ToastEventHandlers({ toast }),
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

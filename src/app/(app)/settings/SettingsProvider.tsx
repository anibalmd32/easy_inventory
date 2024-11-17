'use client';

import { createContext, useState, useCallback, useEffect } from 'react';
import { Category, Setting } from '@/definitions';
import SettingsEventHandler from '@/eventHandlers/SettingsEventHandler';
import {
  formSchema,
  formSchemaDefaultValues,
} from './components/CategoriesForm/Schema';
import { z } from 'zod';
import { CategoriesForm } from './components/CategoriesForm/CategoriesForm';
import { MinimunStockForm } from './components/MinimunStockForm/MinimunStockForm';
import { BusinessNameForm } from './components/BusinessNameForm/BusinessNameForm';
import { getAllCategoriesAction } from '@/core/frameworks/server-actions/categories.actions';
import useCategories from './hooks/useCategories';

interface SettingsCtx {
  settings: Setting;
  eventHandler: SettingsEventHandler;
  selectedColor: string;
  categoryId: number | null;
  setCategoriesOpenForm: (open: boolean) => void;
  setBusinessForm: (open: boolean) => void;
  setMinStockForm: (open: boolean) => void;
  setCategoryId: (id: number | null) => void;
  setDefaultFormValues: (form: z.infer<typeof formSchema>) => void;
  categoriesOpenForm: boolean;
  minStockForm: boolean;
  businessForm: boolean;
  defaultFormValues: z.infer<typeof formSchema>;
}

interface ProviderProps {
  children: React.ReactNode;
  storedSettings: Setting;
}

export const SettingsContext = createContext<SettingsCtx>({} as SettingsCtx);

export function SettingsProvider(props: ProviderProps) {
  const [settings, setSettings] = useState<Setting>(props.storedSettings);
  const [selectedColor, setSelectedColor] = useState<string>('#1810c2');
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const [categoriesOpenForm, setCategoriesOpenForm] = useState<boolean>(false);
  const [minStockForm, setMinStockForm] = useState<boolean>(false);

  const [businessForm, setBusinessForm] = useState<boolean>(false);

  const [defaultFormValues, setDefaultFormValues] = useState(
    formSchemaDefaultValues,
  );

  const eventHandler = new SettingsEventHandler({ setSelectedColor });

  return (
    <SettingsContext.Provider
      value={{
        setCategoriesOpenForm,
        setCategoryId,
        setMinStockForm,
        setDefaultFormValues,
        setBusinessForm,
        defaultFormValues,
        categoryId,
        categoriesOpenForm,
        minStockForm,
        eventHandler,
        businessForm,
        settings,
        selectedColor,
      }}
    >
      {props.children}
      <CategoriesForm />
      <MinimunStockForm />
      <BusinessNameForm />
    </SettingsContext.Provider>
  );
}

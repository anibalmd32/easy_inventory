import { Setting, Category } from '@/definitions';

interface EventHandler {
  onChangeName: (name: string) => Promise<void>;
  onUploadLog: (logoData: any) => Promise<void>;
  onMarkTemplateAsFavorite: (templateId: number) => Promise<void>;
  onAddCategory: (category: Category) => Promise<void>;
  onUpdateCategory: (
    category: Partial<Category>,
    categoryId: number
  ) => Promise<void>;
  onDeleteCategory: (categoryId: number) => Promise<void>;
}

interface Deps {}

export default class SettingsEventHandler implements EventHandler {
  constructor(private readonly deps: Deps) {}

  onAddCategory = async (category: Category): Promise<void> => {};
  onChangeName = async (name: string): Promise<void> => {};
  onDeleteCategory = async (categoryId: number): Promise<void> => {};
  onMarkTemplateAsFavorite = async (templateId: number): Promise<void> => {};
  onUpdateCategory = async (
    category: Partial<Category>,
    categoryId: number
  ): Promise<void> => {};
  onUploadLog = async (logoData: any): Promise<void> => {};
}

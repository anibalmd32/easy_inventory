import { Category } from '@/definitions';
import { ComboboxItem } from '@/components/shared/Combobox';

export default function comboboxCategoryMapper(
  categories: Category[]
): ComboboxItem[] {
  return categories.map((category) => ({
    label: category.name,
    value: category.id,
  }));
}

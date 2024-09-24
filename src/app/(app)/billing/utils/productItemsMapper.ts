import { ComboboxItem } from '@/components/shared/Combobox';
import { Product } from '@/definitions';

export function productItemsMapper(products: Product[]): ComboboxItem[] {
  return products.map((product) => ({
    label: product.name,
    value: String(product.id),
  }));
}

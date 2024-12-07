import { ComboboxItem } from '@/components/shared/Combobox';
import { Product } from '@/definitions';

export function productItemsMapper(products: Product[]): ComboboxItem[] {
  return products.map((product) => {
    const disabled = product.quantity <= 0;
    return {
      label: `${product.name} (${disabled ? 'Agotado' : ''})`,
      value: String(product.id),
      disabled,
    };
  });
}

import { ComboboxItem } from "@/components/shared/Combobox";
import { Product } from "@/definitions/entities";

export function productItemsMapper(products: Product[]): ComboboxItem[] {
	return products.map((product) => ({
		label: product.name,
		value: String(product.id),
	}));
}
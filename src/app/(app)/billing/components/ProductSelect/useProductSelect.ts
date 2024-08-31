'use client'

import React from 'react'
import { useBilling } from '../../context/useBilling'
import { ComboboxItem } from '@/components/shared/Combobox'
import { productItemsMapper } from '../../utils/productItemsMapper'

export function useProductSelect() {
	const [productItems, setProductItems] = React.useState<ComboboxItem[]>([])
	const { products, selectProductOperations } = useBilling()

	React.useEffect(() => {
		setProductItems(productItemsMapper(products))
	}, [products])

	return {
		productItems,
		handleProductSelect: selectProductOperations.onSelectProduct,
	}
}

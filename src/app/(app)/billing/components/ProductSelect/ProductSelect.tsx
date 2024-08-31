'use client'

import { Combobox } from '@/components/shared/Combobox'
import { useProductSelect } from './useProductSelect'

export function ProductSelect() {
	const { productItems, handleProductSelect } = useProductSelect()
	
	return (
		<div>
			<Combobox
				items={productItems}
				placeholder='Seleccione un producto'
				onSelectItem={(item) => {
					handleProductSelect(Number(item.value))
				}}
			/>
		</div>
	)
}

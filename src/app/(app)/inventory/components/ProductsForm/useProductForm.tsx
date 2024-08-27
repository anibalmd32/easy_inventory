import * as React from "react"
import { useForm } from "react-hook-form"
import useInventory from "../../context/useInventory"
import { formSchema } from "./schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { productsMock } from "../ProductsTable/productsMock"

const categories = productsMock.map(product => ({
	value: product.category.id,
	label: product.category.name,
}))

export function useProductForm() {
	const [open, setOpen] = React.useState(false)
	const [value, setValue] = React.useState("")

	const { productsOperations, defaultFormValues, setOpenForm, producId } = useInventory()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: defaultFormValues,
	})

	React.useEffect(() => {
		form.setValue('name', defaultFormValues.name)
		form.setValue('price', defaultFormValues.price)
		form.setValue('quantity', defaultFormValues.quantity)
		form.setValue('category', defaultFormValues.category)
		setValue(defaultFormValues.category ?? "")
	}, [defaultFormValues, form])

	const onSubmit = async(values: z.infer<typeof formSchema>) => {
		let categoryToAssign = undefined

		if (values.category !== null) {
			categoryToAssign = categories.find(category => category.value === Number(values.category))
		}

		if (producId !== null) {
			await productsOperations.update({
				id: producId,
				name: values.name,
				price: values.price,
				quantity: parseInt(values.quantity),
				category: categoryToAssign ? {
					id: categoryToAssign.value,
					name: categoryToAssign.label,
				} : undefined,
				createdAt: new Date().toDateString(),
				updatedAt: new Date().toDateString(),
				categoryId: categoryToAssign ? categoryToAssign.value : undefined,
			})
		} else {
			await productsOperations.add({
				name: values.name,
				price: values.price,
				quantity: parseInt(values.quantity),
				category: categoryToAssign ? {
					id: categoryToAssign.value,
					name: categoryToAssign.label,
				} : undefined,
				createdAt: new Date().toDateString(),
				id: 0,
				updatedAt: new Date().toDateString(),
				categoryId: categoryToAssign ? categoryToAssign.value : undefined,
			})
		}

		setOpenForm(false)
		form.reset()
	}

	return {
		onSubmit,
		categories,
		open,
		setOpen,
		form,
		value,
		setValue,
	}
}

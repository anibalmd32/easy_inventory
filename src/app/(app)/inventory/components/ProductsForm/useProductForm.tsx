'use client'
import * as React from "react"
import { useForm } from "react-hook-form"
import { useInventory } from "../../hooks/useInventory"
import { formSchema } from "./schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import comboboxCategoryMapper from "@/lib/mappers/comboboxCategoryMapper"

export function useProductForm() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  const {
    productsOperations,
    categories,
    defaultFormValues,
    setDefaultValues,
    setOpenForm,
    productId,
    setProductId,
  } = useInventory()

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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let categoryToAssign = undefined

    if (values.category !== null) {
      categoryToAssign = categories.find(category => category.id === Number(values.category))
    }

    if (productId !== null) {
      await productsOperations.update({
        id: productId,
        name: values.name,
        price: values.price,
        quantity: parseInt(values.quantity),
        category: categoryToAssign ? categoryToAssign : null,
        createdAt: new Date(),
        updatedAt: new Date(),
        categoryId: categoryToAssign ? categoryToAssign.id : null,
      })
    } else {
      await productsOperations.add({
        name: values.name,
        price: values.price,
        quantity: parseInt(values.quantity),
        category: categoryToAssign ? categoryToAssign : null,
        createdAt: new Date(),
        id: 0,
        updatedAt: new Date(),
        categoryId: categoryToAssign ? categoryToAssign.id : null,
      })
    }

    setOpenForm(false)
    form.reset()
  }

  return {
    onSubmit,
    categories: comboboxCategoryMapper(categories),
    open,
    setOpen,
    form,
    value,
    setValue,
    setProductId,
    setDefaultValues,
    setOpenForm,
  }
}

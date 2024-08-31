"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
	dni: z.string().min(2).max(50),
	name: z.string().min(2).max(50),
	phone: z.string().min(2).max(50),
})

export function useCustomerForm() {
	const form = useForm<z.infer<typeof formSchema>>({
	resolver: zodResolver(formSchema),
		defaultValues: {
			dni: "",
			name: "",
			phone: "",
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values)
	}

	return {
		form,
		onSubmit,
	}
}
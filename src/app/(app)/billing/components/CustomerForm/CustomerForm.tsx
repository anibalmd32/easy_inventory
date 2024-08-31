'use client'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useCustomerForm } from './useCustomerForm'

export function CustomerForm() {
	const { form, onSubmit } = useCustomerForm()

	return (
		<Card className="bg-gray-950 p-4 text-gray-200 w-full">
			<CardHeader>
				<CardTitle>Datos del client</CardTitle>
				<CardDescription>Rellene los datos del cliente para completar la facturacion</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
						<div className="flex gap-2 justify-between items-center">
							<FormField
								control={form.control}
								name="dni"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Cedula</FormLabel>
										<FormControl>
											<Input {...field} className="bg-gray-900 text-gray-200" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button className="bg-gray-800 mt-8 hover:bg-gray-800/20 transition-all duration-300 text-gray-200">
								Verificar
							</Button>
						</div>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nombre</FormLabel>
									<FormControl>
										<Input {...field} className="bg-gray-900 text-gray-200" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Teléfono</FormLabel>
									<FormControl>
										<Input {...field} className="bg-gray-900 text-gray-200" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}

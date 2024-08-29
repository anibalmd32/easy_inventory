'use client'
import * as React from "react"
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import useInventory from "../../context/useInventory"
import { useProductForm } from "./useProductForm"

export function ProductsForm() {
	const { form, value, setValue, categories, onSubmit, open, setOpen } = useProductForm()
	const { openForm, setOpenForm } = useInventory()

	return (
		<Sheet open={openForm} onOpenChange={() => {
			setOpenForm(!openForm)
			form.reset()
			setValue("")
		}}>
			<SheetTrigger asChild>
				<Button
					onClick={() => setOpenForm(true)}
					className="bg-gray-950 hover:bg-gray-800 text-gray-200 hover:text-gray-200 transition-all duration-300"
				>
					Agregar
				</Button>
			</SheetTrigger>
			<SheetContent className="bg-gray-950 text-gray-200">
				<SheetHeader>
					<SheetTitle className="text-gray-200">
						Agregar Producto
					</SheetTitle>
					<SheetDescription className="text-gray-200">
						Agrega un nuevo producto al inventario.
					</SheetDescription>
				</SheetHeader>

				<div className="mt-6">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nombre</FormLabel>
										<FormControl>
											<Input
												className="bg-gray-900 text-gray-200"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="price"
								render={({ field }) => (
									<FormItem>
									<FormLabel>Precio</FormLabel>
									<FormControl>
										<Input
											type="number"
											className="bg-gray-900 text-gray-200"
											{...field}
										/>
									</FormControl>
									<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="quantity"
								render={({ field }) => (
									<FormItem>
									<FormLabel>Cantidad</FormLabel>
									<FormControl>
										<Input
											type="number"
											className="bg-gray-900 text-gray-200"
											{...field}
										/>
									</FormControl>
									<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="category"
								render={({ field }) => (
									<FormItem>
									<FormLabel>Categoria</FormLabel>
									<FormControl>
										<Popover open={open} onOpenChange={setOpen}>
											<PopoverTrigger asChild>
												<Button
													variant="outline"
													role="combobox"
													aria-expanded={open}
													className="justify-between w-full bg-gray-900 text-gray-200"
												>
													{value
														? categories.find((category) => String(category.value) === value)?.label
														: "Seleccione una categoria..."}
													<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-full p-0 bg-gray-900 text-gray-200">
												<Command className="bg-gray-900 text-gray-200">
													<CommandInput
														placeholder="Buscar categoria..."
														className="bg-gray-900 text-gray-200"
													/>
													<CommandList className="bg-gray-900 text-gray-200">
														<CommandEmpty>Categoria no encontrada.</CommandEmpty>
														<CommandGroup className="max-h-40 overflow-y-auto">
															{categories.map((category) => (
																<CommandItem
																	className="bg-gray-900 text-gray-200 cursor-pointer"
																	key={category.value}
																	value={String(category.value)}
																	onSelect={(currentValue) => {
																		setValue(currentValue === value ? "" : currentValue)
																		setOpen(false)
																		field.onChange(currentValue === value ? null : currentValue)
																	}}
																>
																<Check
																	className={cn(
																		"mr-2 h-4 w-4",
																		value === String(category.value)
																			? "opacity-100"
																			: "opacity-0"
																	)}
																/>
																{category.label}
																</CommandItem>
															))}
														</CommandGroup>
													</CommandList>
												</Command>
											</PopoverContent>
										</Popover>
									</FormControl>
									<FormMessage />
									</FormItem>
								)}
							/>
							
							<Button type="submit" className="bg-gray-900 hover:bg-gray-800 text-gray-200 hover:text-gray-200 transition-all duration-300 w-full">Agregar</Button>
						</form>
					</Form>
				</div>
			</SheetContent>
		</Sheet>
	)
}

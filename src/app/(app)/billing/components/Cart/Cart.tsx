'use client'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	TableFooter
} from "@/components/ui/table"

import { useBilling } from "../../context/useBilling"

export function Cart() {
	const { cartState } = useBilling()

	return (
		<Card className="bg-gray-950 p-4 text-gray-200 w-full">
			<CardHeader>
				<CardTitle>Resumen de compra</CardTitle>
				<CardDescription>Lista de los productos a facturar</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-gray-900/20">
							<TableHead>Producto</TableHead>
							<TableHead>Precio</TableHead>
							<TableHead>Cantidad</TableHead>
							<TableHead className="text-right">Total</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{cartState.products && cartState.products.map((item) => (
							<TableRow key={item.id} className="hover:bg-gray-800/20">
								<TableCell>{item.name}</TableCell>
								<TableCell>{item.price}</TableCell>
								<TableCell>{item.quantity}</TableCell>
								<TableCell className="text-right">${Number(item.price) * Number(item.quantity)}</TableCell>
							</TableRow>
						))}
					</TableBody>
					<TableFooter className="bg-gray-900">
						<TableRow className="hover:bg-gray-800/20">
							<TableCell colSpan={3}>Total</TableCell>
							<TableCell className="text-right">${cartState.total}</TableCell>
						</TableRow>
					</TableFooter>
				</Table>
			</CardContent>
		</Card>
	)
}

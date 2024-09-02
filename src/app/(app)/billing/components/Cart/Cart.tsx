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

import { useBilling } from "../../hooks/useBilling"

export function Cart() {
	const { selectProductOperations, cart } = useBilling()

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
						{cart.items && cart.items.map((item, i) => (
							<TableRow key={i} className="hover:bg-gray-800/20">
								<TableCell>{item.name}</TableCell>
								<TableCell>{item.price}</TableCell>
								<TableCell>{item.amount}</TableCell>
								<TableCell className="text-right">
									${item.amount * Number(item.price)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
					<TableFooter className="bg-gray-900">
						<TableRow className="hover:bg-gray-800/20">
							<TableCell colSpan={3}>Total</TableCell>
							<TableCell className="text-right">${cart.total}</TableCell>
						</TableRow>
					</TableFooter>
				</Table>
			</CardContent>
		</Card>
	)
}

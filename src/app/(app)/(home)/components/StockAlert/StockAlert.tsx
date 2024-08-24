"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { alertStockMock } from "./alertStockMock";

export function StockAlert() {
  return (
    <Card className="bg-gray-900 text-gray-200 flex-1">
      <CardHeader>
        <CardTitle>Alerta de inventario</CardTitle>
        <CardDescription>Lista de productos que debes comprar para abastecer tu inventario</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
		{alertStockMock.map((product) => (
			<div key={product.id} className="flex flex-row justify-between gap-4 bg-gray-950 p-4 rounded-lg hover:bg-gray-800 transition-all duration-300">
				<div className="flex flex-col gap-2">
					<p className="text-lg font-bold">{product.name}</p>
					<p className="text-sm">${product.price}</p>
				</div>
				<div className="flex flex-col gap-2">
					<p className="text-lg font-bold">{product.quantity}</p>
					<p className="text-sm">Unidades</p>
				</div>
			</div>
		))}
      </CardContent>
    </Card>
  );
}
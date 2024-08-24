"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Siren } from "lucide-react"

import { alertStockMock } from "./alertStockMock";

export function StockAlert() {
  return (
    <Card className="bg-gray-900 text-gray-200 flex-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Siren className="w-8 h-8" />
          Alerta de inventario
        </CardTitle>
        <CardDescription>Lista de productos que debes comprar</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {alertStockMock.map((product) => (
          <div key={product.id} className="flex flex-row justify-between gap-4 bg-gray-950 p-4 rounded-lg hover:bg-gray-800 transition-all duration-300">
            <div className="flex flex-col gap-2">
              <p className="text-xl font-bold">{product.name}</p>
              <p className="text-sm">${product.price}</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-bold">Unidades</p>
              <p className="text-sm text-red-500">{product.quantity}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
  }
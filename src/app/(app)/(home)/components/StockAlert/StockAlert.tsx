"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Siren, ArrowRight } from "lucide-react"

import { alertStockMock } from "./alertStockMock";

export function StockAlert() {
  return (
    <Card className="bg-gray-900 text-gray-200 flex-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Siren className="w-8 h-8 text-red-500" />
            Alerta de inventario
          </div>

          <div>
            <div className="rounded-md hover:bg-gray-600 p-2 cursor-pointer transition-all duration-300">
              <ArrowRight className="w-8 h-8" />
            </div>
          </div>
        </CardTitle>
        <CardDescription>Lista de productos que debes comprar</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {alertStockMock.map((product) => (
          <div key={product.id} className="flex flex-col justify-between gap-2 bg-gray-950 p-4 rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer">
            <div className="flex justify-between w-full">
              <p className="font-bold">{product.name}</p>
              <p className="font-bold">Unidades</p>
            </div>
            <div className="flex justify-between w-full">
              <p className="text-sm">${product.price}</p>
              <p className="text-sm text-red-500">{product.quantity}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
  }
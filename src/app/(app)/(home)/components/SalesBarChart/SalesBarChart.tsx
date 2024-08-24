"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { WeeklySalesBarChart } from "./WeeklySalesBarChart"

export function SalesBarChart() {
  return (
    <Card className="bg-gray-900 text-gray-200">
      <CardHeader>
        <CardTitle>Facturacion semanal</CardTitle>
        <CardDescription>Estadisticas de facturas por semana</CardDescription>
      </CardHeader>
      <CardContent>
        <WeeklySalesBarChart />
      </CardContent>
    </Card>
  )
}

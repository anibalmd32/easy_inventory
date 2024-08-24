"use client"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const weeklyInvoicesData = [
  { day: "Lunes", paid: 186, canceled: 80 },
  { day: "Martes", paid: 305, canceled: 200 },
  { day: "Miercoles", paid: 237, canceled: 120 },
  { day: "Jueves", paid: 73, canceled: 190 },
  { day: "Viernes", paid: 209, canceled: 130 },
  { day: "Sabado", paid: 214, canceled: 140 },
]

const chartConfig = {
  paid: {
    label: "Pagadas",
    color: "hsl(var(--chart-2))",
  },
  canceled: {
    label: "Canceladas",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function WeekBarChar() {
  return (
    <Card className="bg-gray-900 text-gray-200">
      <CardHeader>
        <CardTitle>Facturas de la ultima semana</CardTitle>
        <CardDescription>Graficos comparativo de las facturas pagadas y canceladas la ultima semana</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={weeklyInvoicesData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent className="bg-gray-900" indicator="dashed" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="paid" fill="var(--color-paid)" radius={4} />
            <Bar dataKey="canceled" fill="var(--color-canceled)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

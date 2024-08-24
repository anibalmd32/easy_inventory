"use client"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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

const chartData = [
  { month: "Enero", paid: 186, canceled: 80 },
  { month: "Febrero", paid: 305, canceled: 200 },
  { month: "Marzo", paid: 237, canceled: 120 },
  { month: "Abril", paid: 73, canceled: 190 },
  { month: "Mayo", paid: 209, canceled: 130 },
  { month: "Junio", paid: 214, canceled: 140 },
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

export function MonthAreaChart() {
  return (
    <Card className="bg-gray-900 text-gray-200">
      <CardHeader>
        <CardTitle>Facturas de los ultimos meses</CardTitle>
        <CardDescription>
          Graficos comparativo de las facturas pagadas y canceladas de los ultimos 6 meses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent className="bg-gray-900" indicator="dot" />}
            />
            
            <Area
              dataKey="canceled"
              type="natural"
              fill="var(--color-canceled)"
              fillOpacity={0.8}
              stroke="var(--color-canceled)"
              stackId="a"
            />
            <Area
              dataKey="paid"
              type="natural"
              fill="var(--color-paid)"
              fillOpacity={0.8}
              stroke="var(--color-paid)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

"use client"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"
import { weeklyInvoicesData } from './chartData'
import {barChartConfig} from './chartConfig'

export function WeeklySalesBarChart() {
	return (
    <ChartContainer config={barChartConfig} className="h-[300px] w-full">
      <BarChart accessibilityLayer data={weeklyInvoicesData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="payed" fill="var(--color-payed)" radius={4} />
        <Bar dataKey="canceled" fill="var(--color-canceled)" radius={4} />
        <Bar dataKey="pending" fill="var(--color-pending)" radius={4} />
      </BarChart>
    </ChartContainer>
	)
}

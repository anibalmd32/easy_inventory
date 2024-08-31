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
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart"
import { monthlyChartData } from './charts.data'
import { chartConfig } from './chartConfig'
import { CHART_FOR } from '@/definitions'

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
						data={monthlyChartData}
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
							dataKey={CHART_FOR.CANCELED}
							type="natural"
							fill="var(--color-canceled)"
							fillOpacity={0.8}
							stroke="var(--color-canceled)"
							stackId="a"
						/>
						<Area
							dataKey={CHART_FOR.PAID}
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

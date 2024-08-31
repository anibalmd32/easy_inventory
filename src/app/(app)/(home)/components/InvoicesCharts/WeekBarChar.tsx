"use client"
import * as Reacharts from "recharts"
import * as ShadCard from '@/components/ui/card'
import * as ShadChart from '@/components/ui/chart'
import { chartConfig } from "./chartConfig"
import { CHART_FOR } from "@/definitions"
import { useHome } from "@/app/(app)/(home)/hooks/useHome"

export function WeekBarChar() {
	const { weeklyChartData } = useHome()

	return (
		<ShadCard.Card className="bg-gray-900 text-gray-200">
			<ShadCard.CardHeader>
				<ShadCard.CardTitle>
					Facturas de la ultima semana
				</ShadCard.CardTitle>
				<ShadCard.CardDescription>
					Graficos comparativo de las facturas pagadas y canceladas la ultima semana
				</ShadCard.CardDescription>
			</ShadCard.CardHeader>
			<ShadCard.CardContent>
				<ShadChart.ChartContainer config={chartConfig}>
					<Reacharts.BarChart accessibilityLayer data={weeklyChartData}>
						<Reacharts.CartesianGrid vertical={false} />
						<Reacharts.XAxis
							dataKey="day"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={(value) => value.slice(0, 3)}
						/>
						<ShadChart.ChartTooltip
							cursor={false}
							content={<ShadChart.ChartTooltipContent className="bg-gray-900" indicator="dashed" />}
						/>
						<ShadChart.ChartLegend content={<ShadChart.ChartLegendContent />} />
						<Reacharts.Bar dataKey={CHART_FOR.PAID} fill="var(--color-paid)" radius={4} />
						<Reacharts.Bar dataKey={CHART_FOR.CANCELED} fill="var(--color-canceled)" radius={4} />
					</Reacharts.BarChart>
				</ShadChart.ChartContainer>
			</ShadCard.CardContent>
		</ShadCard.Card>
	)
}

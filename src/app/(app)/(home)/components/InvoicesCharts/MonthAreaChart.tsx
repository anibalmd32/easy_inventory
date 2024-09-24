'use client';
import * as Reacharts from 'recharts';
import * as ShadCard from '@/components/ui/card';
import * as ShadChart from '@/components/ui/chart';
import { chartConfig } from './chartConfig';
import { CHART_FOR } from '@/definitions';
import { useHome } from '@/app/(app)/(home)/hooks/useHome';

export function MonthAreaChart() {
  const { monthlyChartData } = useHome();

  return (
    <ShadCard.Card className="bg-gray-900 text-gray-200">
      <ShadCard.CardHeader>
        <ShadCard.CardTitle>Facturas de los últimos meses</ShadCard.CardTitle>
        <ShadCard.CardDescription>
          Gráficos comparativo de las facturas pagadas y canceladas de los
          últimos 6 meses
        </ShadCard.CardDescription>
      </ShadCard.CardHeader>
      <ShadCard.CardContent>
        <ShadChart.ChartContainer config={chartConfig}>
          <Reacharts.AreaChart
            accessibilityLayer
            data={monthlyChartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <Reacharts.CartesianGrid vertical={false} />
            <Reacharts.XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ShadChart.ChartTooltip
              cursor={false}
              content={
                <ShadChart.ChartTooltipContent
                  className="bg-gray-900"
                  indicator="dot"
                />
              }
            />

            <Reacharts.Area
              dataKey={CHART_FOR.CANCELED}
              type="natural"
              fill="var(--color-canceled)"
              fillOpacity={0.8}
              stroke="var(--color-canceled)"
              stackId="a"
            />
            <Reacharts.Area
              dataKey={CHART_FOR.PAID}
              type="natural"
              fill="var(--color-paid)"
              fillOpacity={0.8}
              stroke="var(--color-paid)"
              stackId="a"
            />
            <ShadChart.ChartLegend content={<ShadChart.ChartLegendContent />} />
          </Reacharts.AreaChart>
        </ShadChart.ChartContainer>
      </ShadCard.CardContent>
    </ShadCard.Card>
  );
}

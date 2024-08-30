import { ChartConfig } from "@/components/ui/chart";
import { CHART_FOR } from '@/definitions'

export const chartConfig = {
  [CHART_FOR.PAID]: {
    label: "Pagadas",
    color: "hsl(var(--chart-2))",
  },
  [CHART_FOR.CANCELED]: {
    label: "Canceladas",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

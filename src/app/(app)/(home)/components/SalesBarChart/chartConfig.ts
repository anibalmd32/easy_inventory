import { ChartConfig } from "@/components/ui/chart"

const chartConfig = {
  payed: {
    label: "Pagadas",
    color: "#2563eb",
  },
  canceled: {
    label: "Canceladas",
    color: "#ef4444",
  },
  pending: {
    label: "Pendientes",
    color: "#f59e0b",
  },
} satisfies ChartConfig

export default chartConfig

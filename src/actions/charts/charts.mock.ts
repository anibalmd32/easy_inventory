import { CHART_FOR, MonthlyChartItem, MONTHS, DAYS, WeeklyChartItem } from "@/definitions";

export const monthlyChartData: MonthlyChartItem[] = [
	{ month: MONTHS.ENERO, [CHART_FOR.PAID]: 186, [CHART_FOR.CANCELED]: 80 },
	{ month: MONTHS.FEBRERO, [CHART_FOR.PAID]: 305, [CHART_FOR.CANCELED]: 200 },
	{ month: MONTHS.MARZO, [CHART_FOR.PAID]: 237, [CHART_FOR.CANCELED]: 120 },
	{ month: MONTHS.ABRIL, [CHART_FOR.PAID]: 73, [CHART_FOR.CANCELED]: 190 },
	{ month: MONTHS.MAYO, [CHART_FOR.PAID]: 209, [CHART_FOR.CANCELED]: 130 },
	{ month: MONTHS.JUNIO, [CHART_FOR.PAID]: 214, [CHART_FOR.CANCELED]: 140 },
]

export const weeklyChartData: WeeklyChartItem[] = [
	{ day: DAYS.LUNES, [CHART_FOR.PAID]: 186, [CHART_FOR.CANCELED]: 80 },
	{ day: DAYS.MARTES, [CHART_FOR.PAID]: 305, [CHART_FOR.CANCELED]: 200 },
	{ day: DAYS.MIERCOLES, [CHART_FOR.PAID]: 237, [CHART_FOR.CANCELED]: 120 },
	{ day: DAYS.JUEVES, [CHART_FOR.PAID]: 73, [CHART_FOR.CANCELED]: 190 },
	{ day: DAYS.VIERNES, [CHART_FOR.PAID]: 209, [CHART_FOR.CANCELED]: 130 },
	{ day: DAYS.SABADO, [CHART_FOR.PAID]: 214, [CHART_FOR.CANCELED]: 140 },
]
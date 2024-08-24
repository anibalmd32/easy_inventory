'use client'

import { MonthAreaChart } from './MonthAreaChart'
import { WeekBarChar } from './WeekBarChar'

export function InvoicesCharts({ message }: { message: any }) {
	console.log("Resultado de la consulta sql:", message)
	return (
		<div className="grid gap-4 grid-cols-1 md:grid-cols-2 md:gap-8">
			<WeekBarChar />
			<MonthAreaChart />
		</div>
	);
}

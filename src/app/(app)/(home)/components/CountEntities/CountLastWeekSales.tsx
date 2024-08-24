import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import NumberTicker from "@/components/magicui/number-ticker";
import { DollarSign, TrendingUp } from 'lucide-react'

export function CountLastWeekSales() {
	return (
		<Card className="bg-gray-900 text-gray-200">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">
					Ventas la ultima semana
				</CardTitle>
				<DollarSign className="h-4 w-4 text-muted" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">
					$<NumberTicker className="text-gray-100" value={314} />
				</div>
				<p className="text-xs text-muted flex items-center gap-2 font-medium leading-none">
					+20.1% desde el ultimo mes <TrendingUp className="h-4 w-4" />
				</p>
			</CardContent>
		</Card>
	);
}

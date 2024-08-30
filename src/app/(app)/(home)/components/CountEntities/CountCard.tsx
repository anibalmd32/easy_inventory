import { EntityCountItem, TRENDING } from "@/definitions"
import { TrendingDown, TrendingUp } from 'lucide-react'
import NumberTicker from "@/components/magicui/number-ticker";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"

interface CountCardProps {
	item: EntityCountItem;
}

export const CountCard = ({ item }: CountCardProps) => {
	const { icon: Icon, percentage, title, totalCount, isCash } = item;

	return (
		<Card className="bg-gray-900 text-gray-200">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">
					{title}
				</CardTitle>
				<Icon className="h-4 w-4 text-muted" />
			</CardHeader>
			<CardContent className="space-y-2">
				<div className="text-2xl font-bold">
					{isCash && '$'}<NumberTicker className="text-gray-100" value={totalCount} />
				</div>
				<p
					className="text-xs text-muted flex items-center gap-2 font-medium leading-none"
					title="+20.1% desde el ultimo mes"
				>
					{percentage.tendency === TRENDING.UP ? '+' : '-'}
					{percentage.rate}%
					{
						percentage.tendency === TRENDING.UP
							? <TrendingUp className="h-4 w-4" />
							: <TrendingDown className="h-4 w-4" />
					}
				</p>
			</CardContent>
		</Card>
	)
}

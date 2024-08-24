import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import NumberTicker from "@/components/magicui/number-ticker";
import { TrendingUp } from "lucide-react"

export function TotalWeek() {
	return (
		<Card className="flex flex-col bg-gray-900 text-gray-200 flex-2 h-full">
			<CardHeader className="items-center pb-0">
				<CardTitle>Total de esta semana</CardTitle>
				<CardDescription>Enero 2024</CardDescription>
			</CardHeader>
			<CardContent>
				 <p className="whitespace-pre-wrap text-5xl font-medium tracking-tighte text-center">
					$<NumberTicker className="text-gray-100" value={100} />
				</p>
			</CardContent>
			<CardFooter className="flex-col gap-2 text-sm">
				<div className="flex items-center gap-2 font-medium leading-none">
					Aumento del 2,1% esta semana <TrendingUp className="h-4 w-4" />
				</div>
			</CardFooter>
		</Card>
	)
}

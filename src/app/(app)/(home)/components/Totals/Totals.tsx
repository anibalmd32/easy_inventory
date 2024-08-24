import { TotalMont } from "./TotalMont"
import { TotalWeek } from "./TotalWeek"

export function Totals() {
	return (
		<div className="flex flex-col gap-4 justify-between">
			<TotalMont />
			<TotalWeek />
		</div>
	)
}

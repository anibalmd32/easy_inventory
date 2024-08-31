import { CountCard } from './CountCard'
import { entityCountData } from './counts.data'

export function CountEntites() {
	return (
		<div className="grid gap-4 grid-cols-2 md:grid-cols-3 md:gap-8 lg:grid-cols-5">
			{entityCountData.map(item => <CountCard key={item.title} item={item} />)}
		</div>
	)
}

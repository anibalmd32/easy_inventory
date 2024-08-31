/** PROVIDERS */
import { HomeProvider } from './HomeProvider'

/** SERVER ACTIONS */
import { ChartsServer } from '@/actions/charts/ChartsServer'
import { CountsServer } from '@/actions/counts/CountsServer'

/** COMPONENTS */
import { InvoicesCharts } from './components/InvoicesCharts'
import { CountEntites } from './components/CountEntities'

export default async function Home() {
	const chartsServer = new ChartsServer()
	const countsServer = new CountsServer()

	const entityCountData = await countsServer.getEntityCountData()
	const monthlyChartData = await chartsServer.getMonthlyChartData()
	const weeklyChartData = await chartsServer.getWeeklyChartData()
  
	return (
		<HomeProvider initialData={{
			entityCountData,
			monthlyChartData,
			weeklyChartData
		}}>
			<div className="flex flex-col md:flex-col-reverse gap-4">
				<InvoicesCharts />
				<CountEntites />
			</div>
		</HomeProvider>
	);
}

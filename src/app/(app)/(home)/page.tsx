/** PROVIDERS */
import { HomeProvider } from './HomeProvider';

/** SERVER ACTIONS */
import {
  getMonthlyChartData,
  getWeeklyChartData,
} from '@/actions/charts/ChartsServer';
import { getEntityCountData } from '@/actions/counts/CountsServer';

/** COMPONENTS */
import { InvoicesCharts } from './components/InvoicesCharts';
import { CountEntities } from './components/CountEntities';

export default async function Home() {
  const entityCountData = await getEntityCountData();
  const monthlyChartData = await getMonthlyChartData();
  const weeklyChartData = await getWeeklyChartData();

  return (
    <HomeProvider
      initialData={{
        entityCountData,
        monthlyChartData,
        weeklyChartData,
      }}
    >
      <div className="flex flex-col md:flex-col-reverse gap-4">
        <InvoicesCharts />
        <CountEntities />
      </div>
    </HomeProvider>
  );
}

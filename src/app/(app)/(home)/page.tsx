/** PROVIDERS */
import { HomeProvider } from './HomeProvider';

/** COMPONENTS */
import { InvoicesCharts } from './components/InvoicesCharts';
import { CountEntities } from './components/CountEntities';

/** SERVER ACTIONS */
import {
  getSalesMonthStats,
  getCustomerStats,
  getPaidInvoicesStats,
  getProductsSoldStats,
  getSalesWeekStats,
  getWeeklyChartData,
  getMonthlyChartData,
} from '@/core/frameworks/server-actions/dashboard.actions';

export const revalidate = 0;

export default async function Home() {
  const monthlyChartData = await getMonthlyChartData();
  const weeklyChartData = await getWeeklyChartData();
  const monthlySalesStats = await getSalesMonthStats();
  const paidInvoicesStats = await getPaidInvoicesStats();
  const registeredCustomersStats = await getCustomerStats();
  const soldProductsStats = await getProductsSoldStats();
  const weeklySalesStats = await getSalesWeekStats();

  return (
    <HomeProvider
      initialData={{
        monthlySalesStats,
        paidInvoicesStats,
        registeredCustomersStats,
        weeklySalesStats,
        soldProductsStats,
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

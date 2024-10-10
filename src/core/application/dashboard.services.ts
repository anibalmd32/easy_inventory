import { TRENDING } from '@/definitions';
import { monthIntervals, weekIntervals, getRate, getTendency } from '@/lib/utils';
import DashboardRepository from '../infrastructure/dashboard.repository';

export interface Stats {
  rate: number;
  tendency: TRENDING;
  totalCount: number;
}

export default class DashboardService {
  constructor(private readonly repository: DashboardRepository) {}

  async monthlySales(): Promise<Stats> {
    const lastMonthSales = await this.repository.getTotalSalesByInterval({
      start: monthIntervals().lastMonthStart,
      end: monthIntervals().lastMonthEnd,
    });

    
    const currentMonthSales = await this.repository.getTotalSalesByInterval({
      start: monthIntervals().currentMonthStart,
      end: monthIntervals().today,
    });

    const rate = getRate({
      lastCount: lastMonthSales,
      currentCount: currentMonthSales,
    });

    const tendency = getTendency({
      lastCount: lastMonthSales,
      currentCount: currentMonthSales,
    });
    
    return {
      rate,
      tendency,
      totalCount: currentMonthSales
    };
  }

  async weeklySales(): Promise<Stats> {
    const lastWeekSales = await this.repository.getTotalSalesByInterval({
      start: weekIntervals().lastWeekStart,
      end: weekIntervals().lastWeekEnd,
    });

    const currentWeekSales = await this.repository.getTotalSalesByInterval({
      start: weekIntervals().currentWeekStart,
      end: weekIntervals().today,
    });

    const rate = getRate({
      lastCount: lastWeekSales,
      currentCount: currentWeekSales,
    });

    const tendency = getTendency({
      lastCount: lastWeekSales,
      currentCount: currentWeekSales,
    });

    return {
      rate,
      tendency,
      totalCount: currentWeekSales,
    };
  }

  async countCustomers(): Promise<Stats> {
    const totalCustomersRegistered = await this.repository.countCustomers({});

    const totalCustomersRegisteredInLastMonth = await this.repository.countCustomers({
      start: monthIntervals().lastMonthStart,
      end: monthIntervals().lastMonthEnd,
    });

    const totalCustomersRegisteredInCurrentMonth = await this.repository.countCustomers({
      start: monthIntervals().currentMonthStart,
      end: monthIntervals().today,
    });

    const rate = getRate({
      lastCount: totalCustomersRegisteredInLastMonth,
      currentCount: totalCustomersRegisteredInCurrentMonth
    });

    const tendency = getTendency({
      lastCount: totalCustomersRegisteredInLastMonth,
      currentCount: totalCustomersRegisteredInCurrentMonth
    });

    return {
      rate,
      tendency,
      totalCount: totalCustomersRegistered
    };
  }

  async countPaidInvoices(): Promise<Stats> {
    const totalPaidInvoices = await this.repository.countPaidInvoices({});
    
    const totalPaidInvoicesInLastMonth = await this.repository.countPaidInvoices({
      start: monthIntervals().lastMonthStart,
      end: monthIntervals().lastMonthEnd,
    });

    const totalPaidInvoicesInCurrentMonth = await this.repository.countPaidInvoices({
      start: monthIntervals().currentMonthStart,
      end: monthIntervals().today,
    });

    const rate = getRate({
      lastCount: totalPaidInvoicesInLastMonth,
      currentCount: totalPaidInvoicesInCurrentMonth,
    });

    const tendency = getTendency({
      lastCount: totalPaidInvoicesInLastMonth,
      currentCount: totalPaidInvoicesInCurrentMonth,
    });

    return {
      rate,
      tendency,
      totalCount: totalPaidInvoices,
    };
  }

  async countSoldProducts(): Promise<Stats> {
    const totalSoldProductsInLastMonth = await this.repository.countSoldProducts({
      start: monthIntervals().lastMonthStart,
      end: monthIntervals().lastMonthEnd,
    });

    const totalSoldProductsInCurrentMonth = await this.repository.countSoldProducts({
      start: monthIntervals().currentMonthStart,
      end: monthIntervals().today,
    });

    const rate = getRate({
      lastCount: totalSoldProductsInLastMonth,
      currentCount: totalSoldProductsInCurrentMonth,
    });

    const tendency = getTendency({
      lastCount: totalSoldProductsInLastMonth,
      currentCount: totalSoldProductsInCurrentMonth,
    });

    return {
      rate,
      tendency,
      totalCount: totalSoldProductsInCurrentMonth
    };
  }
}

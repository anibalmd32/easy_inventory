import React from 'react';
import {
  EntityCountItem,
  MonthlyChartItem,
  SaleReport,
  WeeklyChartItem,
} from '@/definitions';
import { Stats } from '@/core/application/dashboard.services';

/** Page Context */
export interface HomeCtx {
  entityCountData: EntityCountItem[];
  monthlyChartData: MonthlyChartItem[];
  weeklyChartData: WeeklyChartItem[];
  salesReport: SaleReport;
  setSalesReport: React.Dispatch<React.SetStateAction<SaleReport>>;
  openReportsModal: boolean;
  setOpenReportsModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ProviderProps {
  children: React.ReactNode;
  initialData: {
    monthlySalesStats: Stats;
    weeklySalesStats: Stats;
    paidInvoicesStats: Stats;
    registeredCustomersStats: Stats;
    soldProductsStats: Stats;
    monthlyChartData: MonthlyChartItem[];
    weeklyChartData: WeeklyChartItem[];
  };
}

/** Page Components */

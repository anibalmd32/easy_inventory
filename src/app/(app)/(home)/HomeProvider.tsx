'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { HomeCtx, ProviderProps } from './definitions';
import { EntityCountItem, SaleReport } from '@/definitions';
import {
  Receipt,
  DollarSign,
  Users,
  Calculator,
  ShoppingCart,
} from 'lucide-react';

export const HomeContext = createContext<HomeCtx>({} as HomeCtx);

export function HomeProvider({ children, initialData }: ProviderProps) {
  const [salesReport, setSalesReport] = useState<SaleReport>({
    totalPaidInvoices: 0,
    totalUSD: '0',
    totalBS: '',
    items: [],
    end: new Date(),
    start: new Date(),
  });
  const [openReportsModal, setOpenReportsModal] = useState(false);

  const {
    monthlyChartData,
    monthlySalesStats,
    paidInvoicesStats,
    registeredCustomersStats,
    soldProductsStats,
    weeklyChartData,
    weeklySalesStats,
  } = initialData;

  const entityCountData: EntityCountItem[] = [
    {
      title: 'Ventas del último mes',
      icon: Receipt,
      percentage: {
        rate: String(monthlySalesStats.rate),
        tendency: monthlySalesStats.tendency,
      },
      totalCount: monthlySalesStats.totalCount,
      isCash: true,
    },
    {
      title: 'Ventas la última semana',
      icon: DollarSign,
      percentage: {
        rate: String(weeklySalesStats.rate),
        tendency: monthlySalesStats.tendency,
      },
      totalCount: monthlySalesStats.totalCount,
      isCash: true,
    },
    {
      title: 'Total de clientes',
      icon: Users,
      percentage: {
        rate: String(registeredCustomersStats.rate),
        tendency: registeredCustomersStats.tendency,
      },
      totalCount: registeredCustomersStats.totalCount,
    },
    {
      title: 'Facturas Pagadas',
      icon: Calculator,
      percentage: {
        rate: String(paidInvoicesStats.rate),
        tendency: paidInvoicesStats.tendency,
      },
      totalCount: paidInvoicesStats.totalCount,
    },
    {
      title: 'Productos vendidos',
      icon: ShoppingCart,
      percentage: {
        rate: String(soldProductsStats.rate),
        tendency: soldProductsStats.tendency,
      },
      totalCount: soldProductsStats.totalCount,
    },
  ];

  return (
    <HomeContext.Provider
      value={{
        entityCountData,
        monthlyChartData: monthlyChartData,
        weeklyChartData: weeklyChartData,
        salesReport,
        setSalesReport,
        openReportsModal,
        setOpenReportsModal,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
}

export const useHome = () => useContext(HomeContext);

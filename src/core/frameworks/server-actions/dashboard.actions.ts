'use sever';
import DashboardRepository from '@/core/infrastructure/dashboard.repository';
import DashboardService from '@/core/application/dashboard.services';
import { Stats } from '@/core/application/dashboard.services';
import { TRENDING } from '@/definitions';

const services = new DashboardService(new DashboardRepository());

export const getSalesMonthStats = async (): Promise<Stats> => {
  try {
    return await services.monthlySales();
  } catch (error) {
    console.log(error);
    return {
      rate: 0,
      tendency: TRENDING.DOWN,
      totalCount: 0
    };
  }
};

export const getSalesWeekStats = async (): Promise<Stats> => {
  try {
    return await services.weeklySales();
  } catch (error) {
    console.log(error);
    return {
      rate: 0,
      tendency: TRENDING.DOWN,
      totalCount: 0
    };
  }
};

export const getPaidInvoicesStats = async (): Promise<Stats> => {
  try {
    return await services.countPaidInvoices();
  } catch (error) {
    console.log(error);
    return {
      rate: 0,
      tendency: TRENDING.DOWN,
      totalCount: 0
    };
  }
};

export const getCustomerStats = async (): Promise<Stats> => {
  try {
    return await services.countCustomers();
  } catch (error) {
    console.log(error);
    return {
      rate: 0,
      tendency: TRENDING.DOWN,
      totalCount: 0
    };
  }
};

export const getProductsSoldStats = async (): Promise<Stats> => {
  try {
    return await services.countSoldProducts();
  } catch (error) {
    console.log(error);
    return {
      rate: 0,
      tendency: TRENDING.DOWN,
      totalCount: 0
    };
  }
};

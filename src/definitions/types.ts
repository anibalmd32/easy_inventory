import { Product } from './data';
import { CHART_FOR, TRENDING, FETCH_STATUS, MONTHS, DAYS } from './enums';

export type ReducerAction<TData, TAction> = {
  type: TAction;
  payload: {
    data: TData;
  };
};

export type LoadingData = {
  state: FETCH_STATUS;
  message: string;
};

export type EntityCountItem = {
  title: string;
  icon: any;
  totalCount: number;
  percentage: {
    rate: string;
    tendency: TRENDING;
  };
  isCash?: boolean;
};

export type MonthlyChartItem = {
  month: MONTHS;
  [CHART_FOR.PAID]: number;
  [CHART_FOR.CANCELED]: number;
};

export type WeeklyChartItem = {
  day: DAYS;
  [CHART_FOR.PAID]: number;
  [CHART_FOR.CANCELED]: number;
};

export interface CartItem extends Product {
  amount: number;
}

export type Cart = {
  items: CartItem[];
  total: number;
  customerName: string;
};

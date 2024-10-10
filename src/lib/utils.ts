import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LoadingData, FETCH_STATUS, TRENDING } from '@/definitions';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function generateCartId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export const loaderInitialState: LoadingData = {
  state: FETCH_STATUS.LOADING,
  message: 'Cargando datos...',
};

export function monthIntervals() {
  const lastMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);;
  const lastMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth(), 0);
  
  const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const today = new Date();

  return {
    currentMonthStart,
    today,
    lastMonthStart,
    lastMonthEnd,
  };
}

export function weekIntervals() {
  const today = new Date();
  const weekDay = today.getDay();

  const lastWeekStart = new Date(today);
  lastWeekStart.setDate(today.getDate() - weekDay - 7);

  const lastWeekEnd = new Date(lastWeekStart);
  lastWeekEnd.setDate(lastWeekStart.getDate() + 6);

  const currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() - weekDay);

  return {
    lastWeekStart,
    lastWeekEnd,
    currentWeekStart,
    today
  };
}

export function getRate({ lastCount, currentCount }: { lastCount: number, currentCount: number }): number {
  let rate = 0;

    if (lastCount > currentCount) {
      rate = ((currentCount - lastCount) / lastCount) * 100;
    }

    return rate;
}

export function getTendency({ lastCount, currentCount }: { lastCount: number, currentCount: number }): TRENDING {
  return currentCount > lastCount ? TRENDING.UP : TRENDING.DOWN;
}

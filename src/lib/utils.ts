import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  LoadingData,
  FETCH_STATUS,
  TRENDING,
  MONTHS,
  DAYS
} from '@/definitions';
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  subYears,
  setMonth,
  getMonth,
  startOfWeek,
  subWeeks,
  addDays,
  endOfWeek,
  format
} from 'date-fns';
import { es } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return format(date, 'EEEE, dd \'de\' MMMM \'de\' yyyy', { locale: es });
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
  const today = new Date();

  const lastMonthStart = startOfMonth(subMonths(today, 1));
  const lastMonthEnd = endOfMonth(subMonths(today, 1));

  const currentMonthStart = startOfMonth(today);

  return {
    currentMonthStart,
    today,
    lastMonthStart,
    lastMonthEnd,
  };
}


export function specificMonthIntervals(monthNumber: number) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();

  const adjustedDate = monthNumber - 1 > currentMonth ? subYears(currentDate, 1) : currentDate;

  const specificMonthDate = setMonth(adjustedDate, monthNumber - 1);

  const monthStart = startOfMonth(specificMonthDate);
  const monthEnd = endOfMonth(specificMonthDate);

  return {
    monthStart,
    monthEnd,
  };
}


export function getLastSixMonths(): { num: number, month: MONTHS }[] {
  const today = new Date();
  const monthsArray = [
    MONTHS.JANUARY,
    MONTHS.FEBRUARY,
    MONTHS.MARCH,
    MONTHS.APRIL,
    MONTHS.MAY, 
    MONTHS.JUNE,
    MONTHS.JULY,
    MONTHS.AUGUST,
    MONTHS.SEPTEMBER,
    MONTHS.OCTOBER, 
    MONTHS.NOVEMBER,
    MONTHS.DECEMBER,
  ];

  const lastSixMonths: { num: number, month: MONTHS }[] = [];

  for (let i = 1; i <= 6; i++) {
    const date = subMonths(today, i);
    const monthIndex = getMonth(date);
    lastSixMonths.push({
      num: monthIndex + 1,
      month: monthsArray[monthIndex],
    });
  }

  return lastSixMonths;
}

export function getLastWeekDays(): { day: DAYS, date: Date }[] {
  const currentDate = new Date();

  const lastMonday = startOfWeek(subWeeks(currentDate, 1), { weekStartsOn: 1 });

  const daysArray = [
    DAYS.MONDAY,
    DAYS.TUESDAY,
    DAYS.WEDNESDAY,
    DAYS.THURSDAY,
    DAYS.FRIDAY,
    DAYS.SATURDAY,
    DAYS.SUNDAY,
  ];

  const lastWeekDays: { day: DAYS, date: Date }[] = [];

  for (let i = 0; i < 7; i++) {
    const dayDate = addDays(lastMonday, i);
    lastWeekDays.push({
      day: daysArray[i],
      date: dayDate,
    });
  }

  return lastWeekDays;
}

export function weekIntervals() {
  const today = new Date();

  // Inicio y fin de la semana pasada
  const lastWeekStart = startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 }); // Semana comienza en lunes
  const lastWeekEnd = endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });

  // Inicio de la semana actual
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 });

  return {
    lastWeekStart,
    lastWeekEnd,
    currentWeekStart,
    today
  };
}

export function getRate({
  lastCount,
  currentCount
}: {
  lastCount: number,
  currentCount: number
}): number {
  if (lastCount === 0) {
    return currentCount > 0 ? 100 : 0;
  }

  const rate = Math.abs(((currentCount - lastCount) / lastCount) * 100);

  return Math.round(rate);
}


export function getTendency({
  lastCount,
  currentCount
}: {
  lastCount: number,
  currentCount: number
}): TRENDING {
  return currentCount > lastCount ? TRENDING.UP : TRENDING.DOWN;
}

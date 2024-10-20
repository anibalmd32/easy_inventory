import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LoadingData, FETCH_STATUS, TRENDING, MONTHS, DAYS } from '@/definitions';

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

export function specificMonthIntervals(monthNumber: number) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const adjustedMonth = monthNumber - 1;
  const year = adjustedMonth > currentMonth ? currentYear - 1 : currentYear;

  const monthStart = new Date(year, adjustedMonth, 1);
  const monthEnd = new Date(year, adjustedMonth + 1, 0);

  return {
    monthStart,
    monthEnd,
  };
}

export function getLastSixMonths(): { num: number, month: MONTHS }[] {
  const currentMonth = new Date().getMonth(); // 0 = enero, 11 = diciembre
  const lastSixMonths: { num: number, month: MONTHS }[] = [];

  const monthsArray = [
    MONTHS.ENERO, MONTHS.FEBRERO, MONTHS.MARZO, MONTHS.ABRIL, MONTHS.MAYO, 
    MONTHS.JUNIO, MONTHS.JULIO, MONTHS.AGOSTO, MONTHS.SEPTIEMBRE, MONTHS.OBTUBRE, 
    MONTHS.NOMVIEMBRE, MONTHS.DICIEMBRE
  ];

  for (let i = 1; i <= 6; i++) {
    let month = currentMonth - i;
    if (month < 0) {
      month += 12;
    }
    lastSixMonths.push({
      num: month + 1,
      month: monthsArray[month]
    });
  }

  return lastSixMonths;
}

export function getLastWeekDays(): { day: DAYS, date: Date }[] {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();

  const daysArray = [
      DAYS.DOMINGO,
      DAYS.LUNES,
      DAYS.MARTES,
      DAYS.MIERCOLES,
      DAYS.JUEVES,
      DAYS.VIERNES,
      DAYS.SABADO,
  ];

  const adjustedCurrentDay = currentDay === 0 ? 7 : currentDay;

  const lastMonday = new Date(currentDate);
  lastMonday.setDate(currentDate.getDate() - adjustedCurrentDay - 7);

  const lastWeekDays: { day: DAYS, date: Date }[] = [];

  for (let i = 0; i < 7; i++) {
      const dayDate = new Date(lastMonday);
      dayDate.setDate(lastMonday.getDate() + i);
      lastWeekDays.push({
          day: daysArray[(i + 1) % 7],
          date: dayDate
      });
  }

  return lastWeekDays;
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

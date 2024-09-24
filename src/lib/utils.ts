import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LoadingData, FETCH_STATUS } from '@/definitions';

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

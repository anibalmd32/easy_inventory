import { Category } from '@/definitions';

// STATES
export type CategoryState = {
  categories: Category[];
  loading: boolean;
  error: string | null;
};

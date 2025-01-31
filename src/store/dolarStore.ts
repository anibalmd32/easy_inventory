import { create } from 'zustand';

type Store = {
  price: number | null;
  getDolarPrice: () => Promise<void>;
};

export const useDolarStore = create<Store>((set, get) => ({
  price: null,
  getDolarPrice: async () => {
    const res = await fetch('https://pydolarve.org/api/v1/dollar?page=bcv');
    const data = await res.json();
    const { price } = data.monitors['usd'];

    set((state) => ({
      ...state,
      price,
    }));
  },
}));

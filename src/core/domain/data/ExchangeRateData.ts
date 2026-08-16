import type { ExchangeRateEntity } from "../entities/ExchangeRateEntity";

export type ExchangeRateData = ExchangeRateEntity & {
  id: number;
  created_at: string;
};

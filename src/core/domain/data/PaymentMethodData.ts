import type { PaymentMethodEntity } from "../entities/PaymentMethodEntity";

export type PaymentMethodData = PaymentMethodEntity & {
  id: number;
};

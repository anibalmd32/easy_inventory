import * as v from "valibot";
import { DebtLimitSchema, PaymentTermSchema } from "../schemas/DebtSchemas";

export const CreditEnabledDto = v.object({
  credit_enabled: v.boolean(),
});

/** Plazo y límite se guardan juntos: son las dos caras de la misma decisión. */
export const DebtTermsDto = v.object({
  default_term_days: PaymentTermSchema,
  customer_debt_limit: DebtLimitSchema,
});

export type CreditEnabledInput = v.InferInput<typeof CreditEnabledDto>;
export type DebtTermsInput = v.InferInput<typeof DebtTermsDto>;
export type DebtTermsOutput = v.InferOutput<typeof DebtTermsDto>;

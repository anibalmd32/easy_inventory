import { queryOptions } from "@tanstack/react-query";
import { posSettingsService } from "../../infrastructure/container";

export const posSettingsKeys = {
  all: [
    "pos-settings",
  ] as const,
  paymentMethods: [
    "pos-settings",
    "payment-methods",
  ] as const,
  currentRate: [
    "pos-settings",
    "current-rate",
  ] as const,
  rateHistory: [
    "pos-settings",
    "rate-history",
  ] as const,
};

export const paymentMethodsQueryOptions = queryOptions({
  queryKey: posSettingsKeys.paymentMethods,
  queryFn: () => posSettingsService.listPaymentMethods(),
});

export const currentRateQueryOptions = queryOptions({
  queryKey: posSettingsKeys.currentRate,
  queryFn: () => posSettingsService.getCurrentRate(),
});

export const rateHistoryQueryOptions = queryOptions({
  queryKey: posSettingsKeys.rateHistory,
  queryFn: () => posSettingsService.getRateHistory(),
});

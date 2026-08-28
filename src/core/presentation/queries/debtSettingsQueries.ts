import { queryOptions } from "@tanstack/react-query";
import { debtSettingsService } from "../../infrastructure/container";

export const debtSettingsKeys = {
  all: [
    "debt-settings",
  ] as const,
  settings: [
    "debt-settings",
    "settings",
  ] as const,
};

export const debtSettingQueryOptions = queryOptions({
  queryKey: debtSettingsKeys.settings,
  queryFn: () => debtSettingsService.getSettings(),
});

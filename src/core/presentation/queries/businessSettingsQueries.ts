import { queryOptions } from "@tanstack/react-query";
import { businessSettingsService } from "../../infrastructure/container";

export const businessSettingsKeys = {
  all: [
    "business-settings",
  ] as const,
  settings: [
    "business-settings",
    "settings",
  ] as const,
};

export const businessSettingQueryOptions = queryOptions({
  queryKey: businessSettingsKeys.settings,
  queryFn: () => businessSettingsService.getSettings(),
});

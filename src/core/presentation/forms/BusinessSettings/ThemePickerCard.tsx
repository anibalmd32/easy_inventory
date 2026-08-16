import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { MdCheck, MdPalette } from "react-icons/md";
import { DAISY_THEMES } from "../../../domain/helpers/daisyThemes";
import { businessSettingsService } from "../../../infrastructure/container";
import type { BusinessThemeInput } from "../../../infrastructure/dtos/BusinessSettingsDtos";
import { FormAlert } from "../../components/FormAlert";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import {
  businessSettingQueryOptions,
  businessSettingsKeys,
} from "../../queries/businessSettingsQueries";

/**
 * Galería de temas de daisyUI. Cada opción es una vista previa real: el
 * `data-theme` del propio botón hace que sus colores se resuelvan con ese
 * tema aunque no esté activo en la app.
 */
export const ThemePickerCard = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const resolveErrorMessage = useErrorMessage();
  const { data, isPending } = useQuery(businessSettingQueryOptions);

  const save = useMutation({
    mutationFn: (values: BusinessThemeInput) =>
      businessSettingsService.updateTheme(values),
    // El tema se aplica al vuelo para que la elección se sienta inmediata y
    // se revierte si la escritura falla; el efecto del RootLayout lo volverá
    // a aplicar con el valor que quedó en la base de datos.
    onMutate: ({ theme }) => {
      document.documentElement.dataset.theme = theme;
    },
    onError: () => {
      if (data) {
        document.documentElement.dataset.theme = data.theme;
      }
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: businessSettingsKeys.settings,
      }),
  });

  const errorMessage = resolveErrorMessage(save.error);
  const currentTheme = data?.theme;

  return (
    <section className="card bg-base-100 shadow-sm">
      <div className="card-body gap-4 p-4 sm:p-6">
        <header className="flex items-start gap-3">
          <MdPalette className="mt-1 shrink-0 opacity-60" size={22} />
          <div className="min-w-0">
            <h2 className="font-semibold">
              {t("pages.settings.business.theme.title")}
            </h2>
            <p className="text-sm opacity-70">
              {t("pages.settings.business.theme.description")}
            </p>
          </div>
        </header>

        {errorMessage ? <FormAlert message={errorMessage} /> : null}

        {isPending || !currentTheme ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {Array.from(
              {
                length: 6,
              },
              (_, index) => (
                <div className="skeleton h-24 w-full" key={index} />
              ),
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {DAISY_THEMES.map((theme) => {
              const isActive = theme === currentTheme;

              return (
                <button
                  className={`relative flex flex-col gap-1.5 rounded-box border p-3 text-left transition-colors ${
                    isActive
                      ? "border-primary"
                      : "border-base-300 hover:border-base-content/40"
                  }`}
                  data-theme={theme}
                  disabled={save.isPending}
                  key={theme}
                  onClick={() =>
                    save.mutate({
                      theme,
                    })
                  }
                  type="button"
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium capitalize">
                      {theme}
                    </span>
                    {isActive ? (
                      <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-primary">
                        <MdCheck size={14} />
                        {t("pages.settings.business.theme.activeBadge")}
                      </span>
                    ) : null}
                  </span>

                  <span className="flex gap-1">
                    <span className="size-3 rounded-full bg-primary" />
                    <span className="size-3 rounded-full bg-secondary" />
                    <span className="size-3 rounded-full bg-accent" />
                    <span className="size-3 rounded-full bg-neutral" />
                  </span>

                  <span className="text-xs opacity-70">
                    {t("pages.settings.business.theme.sample")}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

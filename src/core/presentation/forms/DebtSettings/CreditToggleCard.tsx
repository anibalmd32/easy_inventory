import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { MdHandshake } from "react-icons/md";
import { debtSettingsService } from "../../../infrastructure/container";
import { FormAlert } from "../../components/FormAlert";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import {
  debtSettingQueryOptions,
  debtSettingsKeys,
} from "../../queries/debtSettingsQueries";

/**
 * Interruptor maestro: ¿este negocio vende a crédito?
 *
 * Va primero y aparte porque manda sobre todo lo demás: si está apagado, el
 * plazo y el límite no significan nada, y la pantalla lo refleja.
 */
export const CreditToggleCard = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const resolveErrorMessage = useErrorMessage();
  const { data, isPending } = useQuery(debtSettingQueryOptions);

  const save = useMutation({
    mutationFn: (enabled: boolean) =>
      debtSettingsService.setCreditEnabled({
        credit_enabled: enabled,
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: debtSettingsKeys.settings,
      }),
  });

  const errorMessage = resolveErrorMessage(save.error);
  const isEnabled = data?.credit_enabled ?? false;

  return (
    <section className="card bg-base-100 shadow-sm">
      <div className="card-body gap-3 p-4 sm:p-6">
        <label className="flex cursor-pointer items-center gap-3">
          <MdHandshake className="shrink-0 opacity-60" size={28} />
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">
              {t("pages.settings.debts.credit.title")}
            </span>
            <span className="block text-sm opacity-70">
              {t("pages.settings.debts.credit.description")}
            </span>
          </span>
          <input
            checked={isEnabled}
            className="toggle toggle-primary"
            disabled={isPending || save.isPending}
            onChange={(event) => save.mutate(event.target.checked)}
            type="checkbox"
          />
        </label>

        {errorMessage ? <FormAlert message={errorMessage} /> : null}
      </div>
    </section>
  );
};

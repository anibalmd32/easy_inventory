import { revalidateLogic, useStore } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { formatRate } from "../../../../utils/formatRate";
import { posSettingsService } from "../../../infrastructure/container";
import {
  ExchangeRateDto,
  type ExchangeRateInput,
} from "../../../infrastructure/dtos/PosSettingsDtos";
import { FormAlert } from "../../components/FormAlert";
import { useAppForm } from "../../hooks/create-form-hook";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import { posSettingsKeys } from "../../queries/posSettingsQueries";

interface RateFormProps {
  onDone: () => void;
}

export const RateForm = ({ onDone }: RateFormProps) => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const resolveErrorMessage = useErrorMessage();

  const save = useMutation({
    mutationFn: (values: ExchangeRateInput) =>
      posSettingsService.setRate(values),
    onSuccess: async () => {
      // El valor nuevo afecta tanto a la tasa vigente como al historial.
      await queryClient.invalidateQueries({
        queryKey: posSettingsKeys.currentRate,
      });
      await queryClient.invalidateQueries({
        queryKey: posSettingsKeys.rateHistory,
      });
      onDone();
    },
  });

  const form = useAppForm({
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: ExchangeRateDto,
    },
    defaultValues: {
      rate: "",
    } satisfies ExchangeRateInput,
    onSubmit: async ({ value }) => {
      await save.mutateAsync(value).catch(() => {});
    },
  });

  const errorMessage = resolveErrorMessage(save.error);

  // Preview en vivo, como en las unidades de medida: el usuario ve el
  // resultado antes de guardarlo.
  const rateValue = useStore(form.store, (state) => state.values.rate);
  const parsedRate = Number(rateValue);
  const previewRate =
    Number.isFinite(parsedRate) && parsedRate > 0
      ? formatRate(parsedRate, i18n.language)
      : "—";

  return (
    <form
      className="flex w-full flex-col gap-1"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      {errorMessage ? <FormAlert message={errorMessage} /> : null}

      <form.AppField
        children={(field) => (
          <field.TextInput
            inputMode="decimal"
            label={t("pages.settings.pos.exchangeRate.rateLabel")}
            min={0.000001}
            placeholder={t("pages.settings.pos.exchangeRate.ratePlaceholder")}
            step="any"
            type="number"
          />
        )}
        name="rate"
      />

      <p className="mt-1 flex items-center gap-2 text-sm opacity-70">
        {t("pages.settings.pos.exchangeRate.preview")}
        <span className="badge badge-neutral badge-sm font-mono">
          1 $ = {previewRate} Bs
        </span>
      </p>

      <form.AppForm>
        <form.SubmitBtn
          isLoading={save.isPending}
          label={t("buttons.save.label")}
        />
      </form.AppForm>
    </form>
  );
};

import { revalidateLogic } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type { PaymentMethodData } from "../../../domain/data/PaymentMethodData";
import { posSettingsService } from "../../../infrastructure/container";
import {
  PaymentMethodDto,
  type PaymentMethodInput,
} from "../../../infrastructure/dtos/PosSettingsDtos";
import { FormAlert } from "../../components/FormAlert";
import { useAppForm } from "../../hooks/create-form-hook";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import { posSettingsKeys } from "../../queries/posSettingsQueries";

interface PaymentMethodFormProps {
  /** `null` al crear; el método existente al editar. */
  item: PaymentMethodData | null;
  onDone: () => void;
}

export const PaymentMethodForm = ({ item, onDone }: PaymentMethodFormProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const resolveErrorMessage = useErrorMessage();

  const save = useMutation({
    mutationFn: (values: PaymentMethodInput) =>
      item
        ? posSettingsService.updatePaymentMethod(item.id, values)
        : posSettingsService.createPaymentMethod(values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: posSettingsKeys.paymentMethods,
      });
      onDone();
    },
  });

  const form = useAppForm({
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: PaymentMethodDto,
    },
    defaultValues: {
      name: item?.name ?? "",
    } satisfies PaymentMethodInput,
    onSubmit: async ({ value }) => {
      await save.mutateAsync(value).catch(() => {});
    },
  });

  const errorMessage = resolveErrorMessage(save.error);

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
            autoCapitalize="sentences"
            label={t("pages.settings.pos.paymentMethods.nameLabel")}
            placeholder={t("pages.settings.pos.paymentMethods.namePlaceholder")}
          />
        )}
        name="name"
      />

      <form.AppForm>
        <form.SubmitBtn
          isLoading={save.isPending}
          label={t("buttons.save.label")}
        />
      </form.AppForm>
    </form>
  );
};

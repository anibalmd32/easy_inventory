import { revalidateLogic } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { MdBadge, MdCheck } from "react-icons/md";
import { businessSettingsService } from "../../../infrastructure/container";
import {
  BusinessInfoDto,
  type BusinessInfoInput,
} from "../../../infrastructure/dtos/BusinessSettingsDtos";
import { FormAlert } from "../../components/FormAlert";
import { useAppForm } from "../../hooks/create-form-hook";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import {
  businessSettingQueryOptions,
  businessSettingsKeys,
} from "../../queries/businessSettingsQueries";

const InfoForm = ({ initial }: { initial: BusinessInfoInput }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const resolveErrorMessage = useErrorMessage();

  const save = useMutation({
    mutationFn: (values: BusinessInfoInput) =>
      businessSettingsService.updateInfo(values),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: businessSettingsKeys.settings,
      }),
  });

  const form = useAppForm({
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: BusinessInfoDto,
    },
    defaultValues: initial,
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
            autoCapitalize="none"
            label={t("pages.settings.business.info.taxIdLabel")}
            placeholder={t("pages.settings.business.info.taxIdPlaceholder")}
          />
        )}
        name="tax_id"
      />
      <form.AppField
        children={(field) => (
          <field.TextInput
            autoCapitalize="sentences"
            label={t("pages.settings.business.info.addressLabel")}
            placeholder={t("pages.settings.business.info.addressPlaceholder")}
          />
        )}
        name="address"
      />
      <form.AppField
        children={(field) => (
          <field.TextInput
            inputMode="numeric"
            label={t("pages.settings.business.info.phoneLabel")}
            placeholder={t("pages.settings.business.info.phonePlaceholder")}
          />
        )}
        name="phone"
      />

      <div className="mt-2 flex items-center gap-3">
        <form.Subscribe selector={(state) => state.canSubmit}>
          {(canSubmit) => (
            <button
              className="btn btn-primary btn-sm"
              disabled={!canSubmit || save.isPending}
              type="submit"
            >
              {save.isPending ? (
                <span className="loading loading-spinner loading-sm" />
              ) : null}
              {t("buttons.save.label")}
            </button>
          )}
        </form.Subscribe>

        {save.isSuccess && !save.isPending ? (
          <span className="flex items-center gap-1 text-sm text-success">
            <MdCheck size={16} />
            {t("pages.settings.inventory.lowQuantity.saved")}
          </span>
        ) : null}
      </div>
    </form>
  );
};

/**
 * Datos fiscales y de contacto. Todos opcionales: un negocio pequeño puede
 * facturar sin RIF, y obligarle a rellenarlos solo estorbaría.
 */
export const BusinessInfoCard = () => {
  const { t } = useTranslation();
  const { data, isPending } = useQuery(businessSettingQueryOptions);

  return (
    <section className="card bg-base-100 shadow-sm">
      <div className="card-body gap-4 p-4 sm:p-6">
        <header className="flex items-start gap-3">
          <MdBadge className="mt-1 shrink-0 opacity-60" size={22} />
          <div className="min-w-0">
            <h2 className="font-semibold">
              {t("pages.settings.business.info.title")}
            </h2>
            <p className="text-sm opacity-70">
              {t("pages.settings.business.info.description")}
            </p>
          </div>
        </header>

        {/* El formulario se monta con los valores ya cargados: así no hay que
            reiniciarlo cuando llega la consulta. */}
        {isPending || !data ? (
          <div className="flex flex-col gap-2">
            <div className="skeleton h-12 w-full" />
            <div className="skeleton h-12 w-full" />
          </div>
        ) : (
          <InfoForm
            initial={{
              tax_id: data.tax_id,
              address: data.address,
              phone: data.phone,
            }}
          />
        )}
      </div>
    </section>
  );
};

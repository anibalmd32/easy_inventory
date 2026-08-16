import { revalidateLogic } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { MdCheck, MdOutlineStore } from "react-icons/md";
import { businessSettingsService } from "../../../infrastructure/container";
import {
  BusinessNameDto,
  type BusinessNameInput,
} from "../../../infrastructure/dtos/BusinessSettingsDtos";
import { FormAlert } from "../../components/FormAlert";
import { useAppForm } from "../../hooks/create-form-hook";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import {
  businessSettingQueryOptions,
  businessSettingsKeys,
} from "../../queries/businessSettingsQueries";

const NameForm = ({ initialValue }: { initialValue: string }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const resolveErrorMessage = useErrorMessage();

  const save = useMutation({
    mutationFn: (values: BusinessNameInput) =>
      businessSettingsService.updateName(values),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: businessSettingsKeys.settings,
      }),
  });

  const form = useAppForm({
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: BusinessNameDto,
    },
    defaultValues: {
      name: initialValue,
    } satisfies BusinessNameInput,
    onSubmit: async ({ value }) => {
      await save.mutateAsync(value).catch(() => {});
    },
  });

  const errorMessage = resolveErrorMessage(save.error);

  return (
    <form
      className="flex flex-col gap-3"
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
            autoCapitalize="words"
            label={t("pages.settings.business.name.label")}
            placeholder={t("pages.settings.business.name.placeholder")}
          />
        )}
        name="name"
      />

      <div className="flex items-center gap-3">
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
            {t("pages.settings.business.name.saved")}
          </span>
        ) : null}
      </div>
    </form>
  );
};

export const BusinessNameCard = () => {
  const { t } = useTranslation();
  const { data, isPending } = useQuery(businessSettingQueryOptions);

  return (
    <section className="card bg-base-100 shadow-sm">
      <div className="card-body gap-4 p-4 sm:p-6">
        <header className="flex items-start gap-3">
          <MdOutlineStore className="mt-1 shrink-0 opacity-60" size={22} />
          <div className="min-w-0">
            <h2 className="font-semibold">
              {t("pages.settings.business.name.title")}
            </h2>
            <p className="text-sm opacity-70">
              {t("pages.settings.business.name.description")}
            </p>
          </div>
        </header>

        {/* El formulario se monta con el valor ya cargado: así no hay que
            reiniciarlo cuando llega la consulta. */}
        {isPending || !data ? (
          <div className="skeleton h-12 w-full" />
        ) : (
          <NameForm initialValue={data.name} />
        )}
      </div>
    </section>
  );
};

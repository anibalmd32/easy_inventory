import { revalidateLogic, useStore } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { MdCheck, MdReceiptLong } from "react-icons/md";
import { posSettingsService } from "../../../infrastructure/container";
import {
  InvoiceSettingsDto,
  type InvoiceSettingsInput,
} from "../../../infrastructure/dtos/PosSettingsDtos";
import { FormAlert } from "../../components/FormAlert";
import { useAppForm } from "../../hooks/create-form-hook";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import {
  posSettingQueryOptions,
  posSettingsKeys,
} from "../../queries/posSettingsQueries";

const InvoiceForm = ({ initial }: { initial: InvoiceSettingsInput }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const resolveErrorMessage = useErrorMessage();

  const save = useMutation({
    mutationFn: (values: InvoiceSettingsInput) =>
      posSettingsService.setInvoiceSettings(values),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: posSettingsKeys.settings,
      }),
  });

  const form = useAppForm({
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: InvoiceSettingsDto,
    },
    defaultValues: initial,
    onSubmit: async ({ value }) => {
      await save.mutateAsync(value).catch(() => {});
    },
  });

  // Se le enseña el número que va a salir en la próxima factura en vez de
  // pedirle que junte mentalmente el prefijo con el correlativo.
  const prefix = useStore(form.store, (state) => state.values.invoice_prefix);
  const nextNumber = useStore(
    form.store,
    (state) => state.values.invoice_next_number,
  );
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

      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <form.AppField
          children={(field) => (
            <field.TextInput
              autoCapitalize="none"
              label={t("pages.settings.pos.invoice.prefixLabel")}
              placeholder={t("pages.settings.pos.invoice.prefixPlaceholder")}
            />
          )}
          name="invoice_prefix"
        />
        <form.AppField
          children={(field) => (
            <field.TextInput
              inputMode="numeric"
              label={t("pages.settings.pos.invoice.nextNumberLabel")}
              min={1}
              type="number"
            />
          )}
          name="invoice_next_number"
        />
      </div>

      <p className="flex flex-wrap items-center gap-2 text-sm opacity-70">
        {t("pages.settings.pos.invoice.preview")}
        <span className="badge badge-neutral badge-sm font-mono">
          {`${prefix.trim()}${nextNumber || "1"}`}
        </span>
      </p>

      <div className="divider my-1" />

      <form.AppField
        children={(field) => (
          <field.CheckboxInput
            hint={t("pages.settings.pos.invoice.showBusinessInfoHint")}
            label={t("pages.settings.pos.invoice.showBusinessInfoLabel")}
          />
        )}
        name="invoice_show_business_info"
      />
      <form.AppField
        children={(field) => (
          <field.TextInput
            autoCapitalize="sentences"
            label={t("pages.settings.pos.invoice.footerLabel")}
            placeholder={t("pages.settings.pos.invoice.footerPlaceholder")}
          />
        )}
        name="invoice_footer_note"
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

/** Numeración de las facturas y qué datos se imprimen en ellas. */
export const InvoiceCard = () => {
  const { t } = useTranslation();
  const { data, isPending } = useQuery(posSettingQueryOptions);

  return (
    <section className="card bg-base-100 shadow-sm">
      <div className="card-body gap-4 p-4 sm:p-6">
        <header className="flex items-start gap-3">
          <MdReceiptLong className="mt-1 shrink-0 opacity-60" size={22} />
          <div className="min-w-0">
            <h2 className="font-semibold">
              {t("pages.settings.pos.invoice.title")}
            </h2>
            <p className="text-sm opacity-70">
              {t("pages.settings.pos.invoice.description")}
            </p>
          </div>
        </header>

        {isPending || !data ? (
          <div className="flex flex-col gap-2">
            <div className="skeleton h-12 w-full" />
            <div className="skeleton h-12 w-full" />
          </div>
        ) : (
          <InvoiceForm
            initial={{
              invoice_prefix: data.invoice_prefix,
              invoice_next_number: String(data.invoice_next_number),
              invoice_show_business_info: data.invoice_show_business_info,
              invoice_footer_note: data.invoice_footer_note,
            }}
          />
        )}
      </div>
    </section>
  );
};

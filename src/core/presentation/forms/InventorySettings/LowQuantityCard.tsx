import { revalidateLogic } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { MdCheck, MdNotificationsNone } from "react-icons/md";
import { inventorySettingsService } from "../../../infrastructure/container";
import {
  LowQuantityDto,
  type LowQuantityInput,
} from "../../../infrastructure/dtos/InventorySettingsDtos";
import { FormAlert } from "../../components/FormAlert";
import { useAppForm } from "../../hooks/create-form-hook";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import {
  inventorySettingQueryOptions,
  inventorySettingsKeys,
} from "../../queries/inventorySettingsQueries";

/**
 * El ajuste se redacta como una frase ("Avísame cuando queden 5 o menos") en
 * lugar de como un campo con etiqueta. Para quien lleva una tienda, el número
 * solo tiene sentido dentro de la frase que lo explica.
 */
const ThresholdForm = ({ initialValue }: { initialValue: number }) => {
  const { t } = useTranslation();
  // Namespace aparte: `useTranslation("validations")` es lo que lo carga. Con
  // `t("validations:clave")` a secas el backend no lo pide y saldría la clave.
  const { t: tValidation } = useTranslation("validations");
  const queryClient = useQueryClient();
  const resolveErrorMessage = useErrorMessage();

  const save = useMutation({
    mutationFn: (values: LowQuantityInput) =>
      inventorySettingsService.updateLowQuantity(values),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: inventorySettingsKeys.lowQuantity,
      }),
  });

  const form = useAppForm({
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: LowQuantityDto,
    },
    defaultValues: {
      low_quantity_threshold: String(initialValue),
    } satisfies LowQuantityInput,
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

      <form.Field name="low_quantity_threshold">
        {(field) => (
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span>
                {t("pages.settings.inventory.lowQuantity.sentenceStart")}
              </span>
              <input
                aria-label={t("pages.settings.inventory.lowQuantity.title")}
                className={
                  field.state.meta.isValid
                    ? "input w-20 text-center"
                    : "input input-error w-20 text-center"
                }
                inputMode="numeric"
                max={9999}
                min={0}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                type="number"
                value={field.state.value}
              />
              <span>
                {t("pages.settings.inventory.lowQuantity.sentenceEnd")}
              </span>
            </div>
            {!field.state.meta.isValid
              ? field.state.meta.errors.map((error, index) =>
                  error?.message ? (
                    <em className="text-error text-sm" key={index} role="alert">
                      {tValidation(String(error.message))}
                    </em>
                  ) : null,
                )
              : null}
          </div>
        )}
      </form.Field>

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
            {t("pages.settings.inventory.lowQuantity.saved")}
          </span>
        ) : null}
      </div>
    </form>
  );
};

export const LowQuantityCard = () => {
  const { t } = useTranslation();
  const { data, isPending } = useQuery(inventorySettingQueryOptions);

  return (
    <section className="card bg-base-100 shadow-sm">
      <div className="card-body gap-4 p-4 sm:p-6">
        <header className="flex items-start gap-3">
          <MdNotificationsNone className="mt-1 shrink-0 opacity-60" size={22} />
          <div className="min-w-0">
            <h2 className="font-semibold">
              {t("pages.settings.inventory.lowQuantity.title")}
            </h2>
            <p className="text-sm opacity-70">
              {t("pages.settings.inventory.lowQuantity.description")}
            </p>
          </div>
        </header>

        {/* El formulario se monta con el valor ya cargado: así no hay que
            reiniciarlo cuando llega la consulta. */}
        {isPending || !data ? (
          <div className="skeleton h-12 w-full" />
        ) : (
          <ThresholdForm initialValue={data.low_quantity_threshold} />
        )}
      </div>
    </section>
  );
};

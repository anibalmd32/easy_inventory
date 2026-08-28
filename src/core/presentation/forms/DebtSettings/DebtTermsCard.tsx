import { revalidateLogic, useStore } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { MdCheck, MdSchedule } from "react-icons/md";
import { debtSettingsService } from "../../../infrastructure/container";
import {
  DebtTermsDto,
  type DebtTermsInput,
} from "../../../infrastructure/dtos/DebtSettingsDtos";
import { FormAlert } from "../../components/FormAlert";
import { PriceDisplay } from "../../components/PriceDisplay";
import { useAppForm } from "../../hooks/create-form-hook";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import {
  debtSettingQueryOptions,
  debtSettingsKeys,
} from "../../queries/debtSettingsQueries";

/** Convierte lo escrito en el campo a número, aceptando coma decimal. */
const toAmount = (value: string): number => {
  const parsed = Number(value.replace(",", "."));

  return Number.isFinite(parsed) ? parsed : 0;
};

const TermsForm = ({ initial }: { initial: DebtTermsInput }) => {
  const { t } = useTranslation();
  const { t: tValidation } = useTranslation("validations");
  const queryClient = useQueryClient();
  const resolveErrorMessage = useErrorMessage();

  const save = useMutation({
    mutationFn: (values: DebtTermsInput) =>
      debtSettingsService.setTerms(values),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: debtSettingsKeys.settings,
      }),
  });

  const form = useAppForm({
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: DebtTermsDto,
    },
    defaultValues: initial,
    onSubmit: async ({ value }) => {
      await save.mutateAsync(value).catch(() => {});
    },
  });

  const limit = useStore(
    form.store,
    (state) => state.values.customer_debt_limit,
  );
  const limitAmount = toAmount(limit);
  const errorMessage = resolveErrorMessage(save.error);

  return (
    <form
      className="flex flex-col gap-4"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      {errorMessage ? <FormAlert message={errorMessage} /> : null}

      {/* Igual que el aviso de inventario: el ajuste se lee como una frase,
          porque el número solo significa algo dentro de ella. */}
      <form.Field name="default_term_days">
        {(field) => (
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span>{t("pages.settings.debts.terms.sentenceStart")}</span>
              <input
                aria-label={t("pages.settings.debts.terms.termLabel")}
                className={
                  field.state.meta.isValid
                    ? "input w-20 text-center"
                    : "input input-error w-20 text-center"
                }
                inputMode="numeric"
                max={365}
                min={0}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                type="number"
                value={field.state.value}
              />
              <span>{t("pages.settings.debts.terms.sentenceEnd")}</span>
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

      <div className="divider my-0" />

      <form.AppField
        children={(field) => (
          <field.TextInput
            inputMode="numeric"
            label={t("pages.settings.debts.terms.limitLabel")}
            placeholder="0"
          />
        )}
        name="customer_debt_limit"
      />

      {/* 0 no es "cero de límite", es "sin límite": conviene decirlo en vez de
          dejar que el usuario lo adivine. */}
      {limitAmount === 0 ? (
        <p className="text-sm opacity-70">
          {t("pages.settings.debts.terms.noLimit")}
        </p>
      ) : (
        <p className="flex flex-wrap items-center gap-2 text-sm opacity-70">
          {t("pages.settings.debts.terms.limitPreview")}
          <PriceDisplay amountUsd={limitAmount} />
        </p>
      )}

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

/**
 * Plazo de pago y límite de deuda por cliente.
 *
 * Los dos van en la misma tarjeta porque son las dos caras de la misma
 * decisión: cuánto y por cuánto tiempo confías en un cliente.
 */
export const DebtTermsCard = () => {
  const { t } = useTranslation();
  const { data, isPending } = useQuery(debtSettingQueryOptions);
  const creditEnabled = data?.credit_enabled ?? false;

  return (
    <section
      className={
        creditEnabled
          ? "card bg-base-100 shadow-sm"
          : "card bg-base-100 shadow-sm opacity-60"
      }
    >
      <div className="card-body gap-4 p-4 sm:p-6">
        <header className="flex items-start gap-3">
          <MdSchedule className="mt-1 shrink-0 opacity-60" size={22} />
          <div className="min-w-0">
            <h2 className="font-semibold">
              {t("pages.settings.debts.terms.title")}
            </h2>
            <p className="text-sm opacity-70">
              {t("pages.settings.debts.terms.description")}
            </p>
          </div>
        </header>

        {isPending || !data ? (
          <div className="flex flex-col gap-2">
            <div className="skeleton h-12 w-full" />
            <div className="skeleton h-12 w-full" />
          </div>
        ) : creditEnabled ? (
          <TermsForm
            initial={{
              default_term_days: String(data.default_term_days),
              customer_debt_limit: String(data.customer_debt_limit),
            }}
          />
        ) : (
          // Se explica por qué está apagado en vez de dejar campos muertos.
          <p className="rounded-box border border-base-300 border-dashed p-4 text-center text-sm">
            {t("pages.settings.debts.terms.creditDisabled")}
          </p>
        )}
      </div>
    </section>
  );
};

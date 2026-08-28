import { revalidateLogic } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { MdAlternateEmail, MdCheck } from "react-icons/md";
import { PROFILE_ERROR_MESSAGES } from "../../../domain/enums/profileErrorMessages";
import { ProfileError } from "../../../domain/errors/ProfileError";
import { profileService } from "../../../infrastructure/container";
import {
  UpdateEmailDto,
  type UpdateEmailInput,
} from "../../../infrastructure/dtos/ProfileDtos";
import { FormAlert } from "../../components/FormAlert";
import { useAppForm } from "../../hooks/create-form-hook";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import { useUserStore } from "../../stores/useUserStore";

/** Correo con el que se inicia sesión. */
export const ProfileEmailCard = () => {
  const { t } = useTranslation();
  const resolveErrorMessage = useErrorMessage();
  const userData = useUserStore((state) => state.userData);
  const updateSessionEmail = useUserStore((state) => state.updateSessionEmail);

  const save = useMutation({
    mutationFn: async (values: UpdateEmailInput) => {
      if (!userData) {
        throw new ProfileError(PROFILE_ERROR_MESSAGES.not_found);
      }

      const saved = await profileService.updateEmail(userData.id, values);

      // La sesión y, si estaban apuntando a este correo, el correo recordado
      // y el del desbloqueo biométrico se mueven con él.
      updateSessionEmail(saved.email);
    },
  });

  const form = useAppForm({
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: UpdateEmailDto,
    },
    defaultValues: {
      email: userData?.email ?? "",
    } satisfies UpdateEmailInput,
    onSubmit: async ({ value }) => {
      await save.mutateAsync(value).catch(() => {});
    },
  });

  if (!userData) {
    return null;
  }

  const errorMessage = resolveErrorMessage(save.error);

  return (
    <section className="card bg-base-100 shadow-sm">
      <div className="card-body gap-4 p-4 sm:p-6">
        <header className="flex items-start gap-3">
          <MdAlternateEmail className="mt-1 shrink-0 opacity-60" size={22} />
          <div className="min-w-0">
            <h2 className="font-semibold">{t("pages.profile.email.title")}</h2>
            <p className="text-sm opacity-70">
              {t("pages.profile.email.description")}
            </p>
          </div>
        </header>

        {errorMessage ? <FormAlert message={errorMessage} /> : null}

        <form
          className="flex flex-col gap-1"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.AppField
            children={(field) => (
              <field.TextInput
                autoCapitalize="none"
                autoComplete="username"
                inputMode="email"
                label={t("inputs.email.label")}
                placeholder={t("inputs.email.placeholder")}
                type="email"
              />
            )}
            name="email"
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
      </div>
    </section>
  );
};

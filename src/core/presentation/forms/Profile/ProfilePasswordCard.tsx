import { revalidateLogic } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { MdCheck, MdLockOutline } from "react-icons/md";
import { PROFILE_ERROR_MESSAGES } from "../../../domain/enums/profileErrorMessages";
import { ProfileError } from "../../../domain/errors/ProfileError";
import { profileService } from "../../../infrastructure/container";
import {
  ChangePasswordDto,
  type ChangePasswordInput,
} from "../../../infrastructure/dtos/ProfileDtos";
import { FormAlert } from "../../components/FormAlert";
import { useAppForm } from "../../hooks/create-form-hook";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import { useUserStore } from "../../stores/useUserStore";

const EMPTY_FORM: ChangePasswordInput = {
  current_password: "",
  password: "",
  confirm_password: "",
};

/** Cambio de contraseña, confirmando antes la actual. */
export const ProfilePasswordCard = () => {
  const { t } = useTranslation();
  const resolveErrorMessage = useErrorMessage();
  const userId = useUserStore((state) => state.userData?.id);

  const save = useMutation({
    mutationFn: async (values: ChangePasswordInput) => {
      if (userId === undefined) {
        throw new ProfileError(PROFILE_ERROR_MESSAGES.not_found);
      }

      await profileService.changePassword(userId, values);
    },
  });

  const form = useAppForm({
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: ChangePasswordDto,
    },
    defaultValues: EMPTY_FORM,
    onSubmit: async ({ value, formApi }) => {
      await save
        .mutateAsync(value)
        // Los campos se vacían solo si el cambio salió bien: dejar la
        // contraseña escrita tras un fallo permite corregir sin reescribirla.
        .then(() => formApi.reset(EMPTY_FORM))
        .catch(() => {});
    },
  });

  const errorMessage = resolveErrorMessage(save.error);

  return (
    <section className="card bg-base-100 shadow-sm">
      <div className="card-body gap-4 p-4 sm:p-6">
        <header className="flex items-start gap-3">
          <MdLockOutline className="mt-1 shrink-0 opacity-60" size={22} />
          <div className="min-w-0">
            <h2 className="font-semibold">
              {t("pages.profile.password.title")}
            </h2>
            <p className="text-sm opacity-70">
              {t("pages.profile.password.description")}
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
                autoComplete="current-password"
                label={t("pages.profile.password.currentLabel")}
                type="password"
              />
            )}
            name="current_password"
          />

          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <form.AppField
              children={(field) => (
                <field.TextInput
                  autoComplete="new-password"
                  label={t("inputs.newPassword.label")}
                  type="password"
                />
              )}
              name="password"
            />
            <form.AppField
              children={(field) => (
                <field.TextInput
                  autoComplete="new-password"
                  label={t("inputs.confirmPassword.label")}
                  type="password"
                />
              )}
              name="confirm_password"
            />
          </div>

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
                  {t("pages.profile.password.action")}
                </button>
              )}
            </form.Subscribe>

            {save.isSuccess && !save.isPending ? (
              <span className="flex items-center gap-1 text-sm text-success">
                <MdCheck size={16} />
                {t("pages.profile.password.changed")}
              </span>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );
};

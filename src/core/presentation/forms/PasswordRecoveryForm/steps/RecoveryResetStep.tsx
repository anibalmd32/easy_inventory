import { revalidateLogic } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { passwordRecoveryService } from "../../../../infrastructure/container";
import {
  ResetPasswordDto,
  type ResetPasswordInput,
} from "../../../../infrastructure/dtos/PasswordRecoveryDtos";
import { FormAlert } from "../../../components/FormAlert";
import { useAppForm } from "../../../hooks/create-form-hook";
import { useAuthErrorMessage } from "../../../hooks/useAuthErrorMessage";

interface RecoveryResetStepProps {
  userId: number;
  /** Se reenvía para que el servicio revalide en el momento de guardar. */
  answer: string;
  onDone: () => void;
}

export const RecoveryResetStep = ({
  userId,
  answer,
  onDone,
}: RecoveryResetStepProps) => {
  const { t } = useTranslation();
  const resolveErrorMessage = useAuthErrorMessage();

  const mutation = useMutation({
    mutationFn: (values: ResetPasswordInput) =>
      passwordRecoveryService.resetPassword(userId, answer, values),
    onSuccess: () => onDone(),
  });

  const form = useAppForm({
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: ResetPasswordDto,
    },
    defaultValues: {
      password: "",
      confirm_password: "",
    } satisfies ResetPasswordInput,
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value).catch(() => {});
    },
  });

  const errorMessage = resolveErrorMessage(mutation.error);

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
      <p className="mb-2 text-sm opacity-70">
        {t("pages.auth.recover.resetHint")}
      </p>

      {errorMessage ? <FormAlert message={errorMessage} /> : null}

      <form.AppField
        children={(field) => (
          <field.TextInput
            autoComplete="new-password"
            label={t("inputs.newPassword.label")}
            placeholder={t("inputs.newPassword.placeholder")}
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
            placeholder={t("inputs.confirmPassword.placeholder")}
            type="password"
          />
        )}
        name="confirm_password"
      />

      <form.AppForm>
        <form.SubmitBtn
          isLoading={mutation.isPending}
          label={t("buttons.savePassword.label")}
        />
      </form.AppForm>
    </form>
  );
};

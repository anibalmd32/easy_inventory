import { revalidateLogic } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { passwordRecoveryService } from "../../../../infrastructure/container";
import {
  RecoveryEmailDto,
  type RecoveryEmailInput,
} from "../../../../infrastructure/dtos/PasswordRecoveryDtos";
import { FormAlert } from "../../../components/FormAlert";
import { useAppForm } from "../../../hooks/create-form-hook";
import { useAuthErrorMessage } from "../../../hooks/useAuthErrorMessage";

export interface FoundAccount {
  email: string;
  userId: number;
  questionKey: string;
}

interface RecoveryEmailStepProps {
  onFound: (account: FoundAccount) => void;
}

export const RecoveryEmailStep = ({ onFound }: RecoveryEmailStepProps) => {
  const { t } = useTranslation();
  const resolveErrorMessage = useAuthErrorMessage();

  const mutation = useMutation({
    mutationFn: (values: RecoveryEmailInput) =>
      passwordRecoveryService.findQuestion(values),
    onSuccess: (record) => onFound(record),
  });

  const form = useAppForm({
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: RecoveryEmailDto,
    },
    defaultValues: {
      email: "",
    } satisfies RecoveryEmailInput,
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
        {t("pages.auth.recover.emailHint")}
      </p>

      {errorMessage ? <FormAlert message={errorMessage} /> : null}

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

      <form.AppForm>
        <form.SubmitBtn
          isLoading={mutation.isPending}
          label={t("buttons.continue.label")}
        />
      </form.AppForm>
    </form>
  );
};

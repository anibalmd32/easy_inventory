import { revalidateLogic } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MAX_SECURITY_ANSWER_ATTEMPTS } from "../../../../domain/enums/authPolicy";
import { passwordRecoveryService } from "../../../../infrastructure/container";
import {
  RecoveryAnswerDto,
  type RecoveryAnswerInput,
} from "../../../../infrastructure/dtos/PasswordRecoveryDtos";
import { FormAlert } from "../../../components/FormAlert";
import { useAppForm } from "../../../hooks/create-form-hook";
import { useAuthErrorMessage } from "../../../hooks/useAuthErrorMessage";

interface RecoveryAnswerStepProps {
  userId: number;
  questionKey: string;
  onVerified: (answer: string) => void;
}

export const RecoveryAnswerStep = ({
  userId,
  questionKey,
  onVerified,
}: RecoveryAnswerStepProps) => {
  const { t } = useTranslation();
  const resolveErrorMessage = useAuthErrorMessage();
  const [wrongAttempts, setWrongAttempts] = useState(0);

  const isBlocked = wrongAttempts >= MAX_SECURITY_ANSWER_ATTEMPTS;

  const mutation = useMutation({
    mutationFn: (values: RecoveryAnswerInput) =>
      passwordRecoveryService
        .verifyAnswer(userId, values)
        .then(() => values.answer),
    onSuccess: (answer) => onVerified(answer),
    onError: () => setWrongAttempts((previous) => previous + 1),
  });

  const form = useAppForm({
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: RecoveryAnswerDto,
    },
    defaultValues: {
      answer: "",
    } satisfies RecoveryAnswerInput,
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value).catch(() => {});
    },
  });

  const errorMessage = resolveErrorMessage(mutation.error);
  const remaining = MAX_SECURITY_ANSWER_ATTEMPTS - wrongAttempts;

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
      <div className="mb-2 rounded-box bg-base-200 p-3">
        <p className="text-xs uppercase opacity-60">
          {t("inputs.securityQuestion.label")}
        </p>
        <p className="font-medium">{t(`securityQuestions.${questionKey}`)}</p>
      </div>

      {isBlocked ? (
        <FormAlert message={t("pages.auth.recover.tooManyAttempts")} />
      ) : (
        <>
          {errorMessage ? <FormAlert message={errorMessage} /> : null}
          {wrongAttempts > 0 ? (
            <p className="text-xs text-warning">
              {t("pages.auth.recover.remainingAttempts", {
                count: remaining,
              })}
            </p>
          ) : null}

          <form.AppField
            children={(field) => (
              <field.TextInput
                autoCapitalize="none"
                label={t("inputs.securityAnswer.label")}
                placeholder={t("inputs.securityAnswer.placeholder")}
              />
            )}
            name="answer"
          />

          <p className="text-xs opacity-60">
            {t("pages.auth.recover.answerHint")}
          </p>

          <form.AppForm>
            <form.SubmitBtn
              isLoading={mutation.isPending}
              label={t("buttons.verify.label")}
            />
          </form.AppForm>
        </>
      )}
    </form>
  );
};

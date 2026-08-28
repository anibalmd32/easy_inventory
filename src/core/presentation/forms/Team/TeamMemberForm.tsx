import { revalidateLogic } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { teamService } from "../../../infrastructure/container";
import {
  ASSIGNABLE_ROLES,
  CreateTeamUserDto,
  type CreateTeamUserInput,
} from "../../../infrastructure/dtos/TeamDtos";
import { FormAlert } from "../../components/FormAlert";
import type { SelectOption } from "../../components/SelectInput";
import { useAppForm } from "../../hooks/create-form-hook";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import { securityQuestionsQueryOptions } from "../../queries/authQueries";
import { teamKeys } from "../../queries/teamQueries";
import { useUserStore } from "../../stores/useUserStore";

interface TeamMemberFormProps {
  onDone: () => void;
}

/** Alta de un integrante del equipo. */
export const TeamMemberForm = ({ onDone }: TeamMemberFormProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const resolveErrorMessage = useErrorMessage();
  const language = useUserStore((state) => state.language);
  const { data: questions, isPending: areQuestionsLoading } = useQuery(
    securityQuestionsQueryOptions,
  );

  const roleOptions = useMemo<SelectOption[]>(
    () =>
      ASSIGNABLE_ROLES.map((role) => ({
        value: role,
        label: t(`roles.${role}`),
      })),
    [
      t,
    ],
  );

  const questionOptions = useMemo<SelectOption[]>(
    () =>
      (questions ?? []).map((question) => ({
        value: String(question.id),
        label: t(`securityQuestions.${question.question_key}`),
      })),
    [
      questions,
      t,
    ],
  );

  const save = useMutation({
    mutationFn: (values: CreateTeamUserInput) =>
      teamService.createMember(values, language),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: teamKeys.all,
      });
      onDone();
    },
  });

  // Anotado en vez de `satisfies`: con `satisfies`, TypeScript estrecha
  // `role` al literal del primer elemento y deja de aceptar los otros dos.
  const defaultValues: CreateTeamUserInput = {
    name: "",
    last_name: "",
    email: "",
    password: "",
    role: ASSIGNABLE_ROLES[0],
    security_question_id: "",
    security_answer: "",
  };

  const form = useAppForm({
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: CreateTeamUserDto,
    },
    defaultValues,
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

      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <form.AppField
          children={(field) => (
            <field.TextInput
              autoCapitalize="sentences"
              label={t("inputs.name.label")}
              placeholder={t("inputs.name.placeholder")}
            />
          )}
          name="name"
        />
        <form.AppField
          children={(field) => (
            <field.TextInput
              autoCapitalize="sentences"
              label={t("inputs.lastName.label")}
              placeholder={t("inputs.lastName.placeholder")}
            />
          )}
          name="last_name"
        />
      </div>

      <form.AppField
        children={(field) => (
          <field.TextInput
            autoCapitalize="none"
            inputMode="email"
            label={t("inputs.email.label")}
            placeholder={t("inputs.email.placeholder")}
            type="email"
          />
        )}
        name="email"
      />
      <form.AppField
        children={(field) => (
          <field.TextInput
            autoComplete="new-password"
            label={t("inputs.password.label")}
            placeholder={t("inputs.password.placeholder")}
            type="password"
          />
        )}
        name="password"
      />
      <form.AppField
        children={(field) => (
          <field.SelectInput
            label={t("pages.settings.team.members.roleLabel")}
            options={roleOptions}
          />
        )}
        name="role"
      />

      <div className="divider my-1 text-xs opacity-70">
        {t("pages.auth.setup.recoverySection")}
      </div>
      <p className="mb-1 text-xs opacity-70">
        {t("pages.settings.team.members.recoveryHint")}
      </p>

      <form.AppField
        children={(field) => (
          <field.SelectInput
            disabled={areQuestionsLoading}
            label={t("inputs.securityQuestion.label")}
            options={questionOptions}
            placeholder={t("inputs.securityQuestion.placeholder")}
          />
        )}
        name="security_question_id"
      />
      <form.AppField
        children={(field) => (
          <field.TextInput
            autoCapitalize="none"
            label={t("inputs.securityAnswer.label")}
            placeholder={t("inputs.securityAnswer.placeholder")}
          />
        )}
        name="security_answer"
      />

      <form.AppForm>
        <form.SubmitBtn
          isLoading={save.isPending}
          label={t("buttons.save.label")}
        />
      </form.AppForm>
    </form>
  );
};

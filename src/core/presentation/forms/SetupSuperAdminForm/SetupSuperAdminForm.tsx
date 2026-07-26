import { useTranslation } from "react-i18next";
import { FormAlert } from "../../components/FormAlert";
import { useSetupSuperAdminForm } from "./useSetupSuperAdminForm";

export const SetupSuperAdminForm = () => {
  const {
    form,
    questionOptions,
    areQuestionsLoading,
    errorMessage,
    isSubmitting,
  } = useSetupSuperAdminForm();
  const { t } = useTranslation();

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
              autoComplete="given-name"
              label={t("inputs.name.label")}
              placeholder={t("inputs.name.placeholder")}
            />
          )}
          name="name"
        />
        <form.AppField
          children={(field) => (
            <field.TextInput
              autoComplete="family-name"
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
            autoComplete="username"
            inputMode="email"
            label={t("inputs.email.label")}
            placeholder={t("inputs.email.placeholder")}
            type="email"
          />
        )}
        name="email"
      />

      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
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
            <field.TextInput
              autoComplete="new-password"
              label={t("inputs.confirmPassword.label")}
              placeholder={t("inputs.confirmPassword.placeholder")}
              type="password"
            />
          )}
          name="confirm_password"
        />
      </div>

      <div className="divider my-1 text-xs opacity-70">
        {t("pages.auth.setup.recoverySection")}
      </div>
      <p className="mb-1 text-xs opacity-70">
        {t("pages.auth.setup.recoveryHint")}
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
            label={t("inputs.securityAnswer.label")}
            placeholder={t("inputs.securityAnswer.placeholder")}
          />
        )}
        name="security_answer"
      />

      <form.AppForm>
        <form.SubmitBtn
          isLoading={isSubmitting}
          label={t("buttons.createSuperAdmin.label")}
        />
      </form.AppForm>
    </form>
  );
};

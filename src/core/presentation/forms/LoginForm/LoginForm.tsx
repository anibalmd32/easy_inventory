import { useTranslation } from "react-i18next";
import { useLoginForm } from "./useLoginForm";

export const LoginForm = () => {
  const { form } = useLoginForm();
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-xs card">
      <form
        className="flex justify-center items-center flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.AppField
          children={(field) => (
            <field.TextInput label={t("inputs.email.label")} type="email" />
          )}
          name="email"
        />
        <form.AppField
          children={(field) => (
            <field.TextInput
              label={t("inputs.password.label")}
              type="password"
            />
          )}
          name="password"
        />

        <form.AppForm>
          <form.SubmitBtn label={t("buttons.submit.label")} />
        </form.AppForm>
      </form>
    </div>
  );
};

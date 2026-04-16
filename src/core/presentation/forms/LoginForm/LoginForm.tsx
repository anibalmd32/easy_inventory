import { useTranslation } from "react-i18next";
import { useLoginForm } from "./useLoginForm";

export const LoginForm = () => {
  const { form, loginMutation } = useLoginForm();
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

        {loginMutation.isError && (
          <div className="alert alert-error w-full mt-2">
            <span>{loginMutation.error?.message ?? t("common.error")}</span>
          </div>
        )}

        <form.AppForm>
          <form.SubmitBtn
            label={
              loginMutation.isPending
                ? t("common.loading")
                : t("buttons.login.label")
            }
          />
        </form.AppForm>
      </form>
    </div>
  );
};

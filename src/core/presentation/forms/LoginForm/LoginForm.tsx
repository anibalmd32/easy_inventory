import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { FormAlert } from "../../components/FormAlert";
import { useLoginForm } from "./useLoginForm";

export const LoginForm = () => {
  const { form, errorMessage, isSubmitting, canRecoverPassword } =
    useLoginForm();
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
      <form.AppField
        children={(field) => (
          <field.TextInput
            autoComplete="current-password"
            label={t("inputs.password.label")}
            placeholder={t("inputs.password.placeholder")}
            type="password"
          />
        )}
        name="password"
      />
      <form.AppField
        children={(field) => (
          <field.CheckboxInput
            hint={t("inputs.remember.hint")}
            label={t("inputs.remember.label")}
          />
        )}
        name="remember"
      />

      <form.AppForm>
        <form.SubmitBtn
          isLoading={isSubmitting}
          label={t("buttons.login.label")}
        />
      </form.AppForm>

      {/* Solo aparece tras varios intentos fallidos: quien recuerda su
          contraseña no necesita ver la puerta de atrás. */}
      {canRecoverPassword ? (
        <Link
          className="link link-primary mt-3 self-center text-sm"
          to="/auth/recover"
        >
          {t("pages.auth.login.forgotPassword")}
        </Link>
      ) : null}
    </form>
  );
};

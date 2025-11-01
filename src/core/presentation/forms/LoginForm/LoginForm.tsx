import { useLoginForm } from "./useLoginForm";

export const LoginForm = () => {
  const { form } = useLoginForm();

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
          children={(field) => <field.TextInput label="Email" type="email" />}
          name="email"
        />
        <form.AppField
          children={(field) => (
            <field.TextInput label="Password" type="password" />
          )}
          name="password"
        />

        <form.AppForm>
          <form.SubmitBtn label="submit" />
        </form.AppForm>
      </form>
    </div>
  );
};

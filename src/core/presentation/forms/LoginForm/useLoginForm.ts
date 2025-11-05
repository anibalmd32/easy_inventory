import { useAppForm } from "../../hooks/create-form-hook";
import { useAuth } from "../../hooks/useAuth";
// import { loginFormSchema } from "./loginFormSchema";

export const useLoginForm = () => {
  const { login } = useAuth();

  const form = useAppForm({
    validators: {
      // onSubmit: loginFormSchema,
    },
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: () => {
      login();
    },
  });

  return {
    form,
  };
};

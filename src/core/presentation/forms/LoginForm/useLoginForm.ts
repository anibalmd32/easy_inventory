import { useAppForm } from "../../hooks/create-form-hook";
import { useLoginMutation } from "../../hooks/useLoginMutation";
// import { loginFormSchema } from "./loginFormSchema";

export const useLoginForm = () => {
  const loginMutation = useLoginMutation();

  const form = useAppForm({
    validators: {
      // onSubmit: loginFormSchema,
    },
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: ({ value }) => {
      loginMutation.mutate(value);
    },
  });

  return {
    form,
    loginMutation,
  };
};

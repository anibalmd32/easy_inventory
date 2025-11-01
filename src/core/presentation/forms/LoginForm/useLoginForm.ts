import { useAppForm } from "../../hooks/create-form-hook";
import { loginFormSchema } from "./loginFormSchema";

export const useLoginForm = () => {
  const form = useAppForm({
    validators: {
      onSubmit: loginFormSchema,
    },
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: ({ value }) => {
      console.log("Form Submitted with values:", value);
    },
  });

  return {
    form,
  };
};

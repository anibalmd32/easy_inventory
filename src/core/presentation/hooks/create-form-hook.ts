import { createFormHook } from "@tanstack/react-form";
import { SubmitBtn } from "../components/SubmitBtn";
import { TextInput } from "../components/TextInput";
import { fieldContext, formContext } from "./form-context";

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextInput,
  },
  formComponents: {
    SubmitBtn,
  },
  formContext,
  fieldContext,
});

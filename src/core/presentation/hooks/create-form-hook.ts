import { createFormHook } from "@tanstack/react-form";
import { CheckboxInput } from "../components/CheckboxInput";
import { SelectInput } from "../components/SelectInput";
import { SubmitBtn } from "../components/SubmitBtn";
import { TextInput } from "../components/TextInput";
import { fieldContext, formContext } from "./form-context";

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    CheckboxInput,
    SelectInput,
    TextInput,
  },
  formComponents: {
    SubmitBtn,
  },
  formContext,
  fieldContext,
});

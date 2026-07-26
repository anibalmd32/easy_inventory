import { revalidateLogic } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { setupSuperAdminService } from "../../../infrastructure/container";
import {
  SetupSuperAdminDto,
  type SetupSuperAdminInput,
} from "../../../infrastructure/dtos/SetupSuperAdminDto";
import type { SelectOption } from "../../components/SelectInput";
import { useAppForm } from "../../hooks/create-form-hook";
import { useAuth } from "../../hooks/useAuth";
import { useAuthErrorMessage } from "../../hooks/useAuthErrorMessage";
import {
  authKeys,
  securityQuestionsQueryOptions,
} from "../../queries/authQueries";
import { useUserStore } from "../../stores/useUserStore";

export const useSetupSuperAdminForm = () => {
  const { t } = useTranslation();
  // El store, no `i18n.language`: el detector puede entregar "es-VE" y en la
  // BD queremos guardar el código corto que maneja el selector de idioma.
  const language = useUserStore((state) => state.language);
  const { startSession } = useAuth();
  const queryClient = useQueryClient();
  const resolveErrorMessage = useAuthErrorMessage();

  const { data: questions, isPending: areQuestionsLoading } = useQuery(
    securityQuestionsQueryOptions,
  );

  const questionOptions = useMemo<SelectOption[]>(
    () =>
      (questions ?? []).map((question) => ({
        value: String(question.id),
        label: t(`securityQuestions.${question.question_key}`),
      })),
    [
      questions,
      t,
    ],
  );

  const mutation = useMutation({
    mutationFn: (values: SetupSuperAdminInput) =>
      // La cuenta nace con el idioma que el usuario ya tiene en pantalla.
      setupSuperAdminService.execute(values, language),
    onSuccess: (user) => {
      // El guard de `/auth/setup` lee esta query; sin actualizarla el
      // usuario rebotaría de vuelta al setup al cerrar sesión.
      queryClient.setQueryData(authKeys.superAdminExists, true);
      return startSession(user, true);
    },
  });

  const form = useAppForm({
    // Con un validador a nivel de formulario, un `onBlur` pintaría los siete
    // campos en rojo al salir del primero. Así solo se valida tras el primer
    // envío y luego se revalida en vivo.
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: SetupSuperAdminDto,
    },
    defaultValues: {
      name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
      security_question_id: "",
      security_answer: "",
    } satisfies SetupSuperAdminInput,
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value).catch(() => {});
    },
  });

  return {
    form,
    questionOptions,
    areQuestionsLoading,
    errorMessage: resolveErrorMessage(mutation.error),
    isSubmitting: mutation.isPending,
  };
};

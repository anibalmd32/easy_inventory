import { revalidateLogic } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { FAILED_LOGINS_BEFORE_RECOVERY } from "../../../domain/enums/authPolicy";
import { loginService } from "../../../infrastructure/container";
import {
  LoginDto,
  type LoginInput,
} from "../../../infrastructure/dtos/LoginDto";
import { useAppForm } from "../../hooks/create-form-hook";
import { useAuth } from "../../hooks/useAuth";
import { useAuthErrorMessage } from "../../hooks/useAuthErrorMessage";
import { useUserStore } from "../../stores/useUserStore";

export const useLoginForm = () => {
  const { startSession } = useAuth();
  const resolveErrorMessage = useAuthErrorMessage();
  const rememberedEmail = useUserStore((state) => state.rememberedEmail);
  const failedLoginAttempts = useUserStore(
    (state) => state.failedLoginAttempts,
  );
  const registerFailedLogin = useUserStore(
    (state) => state.registerFailedLogin,
  );

  const mutation = useMutation({
    mutationFn: (values: LoginInput) => loginService.execute(values),
    onSuccess: (user, values) => startSession(user, values.remember),
    // `setSession` pone el contador en cero, así que solo hay que sumarlo aquí.
    onError: () => registerFailedLogin(),
  });

  const form = useAppForm({
    // No se marca nada en rojo hasta el primer intento de envío; a partir de
    // ahí sí se revalida en vivo mientras el usuario corrige.
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: LoginDto,
    },
    defaultValues: {
      email: rememberedEmail ?? "",
      password: "",
      // Si ya veníamos recordando el email, la casilla arranca marcada.
      remember: rememberedEmail !== null,
    } satisfies LoginInput,
    onSubmit: async ({ value }) => {
      // El fallo queda en `mutation.error` y se pinta como alerta; se atrapa
      // aquí para que no escale como promesa sin manejar.
      await mutation.mutateAsync(value).catch(() => {});
    },
  });

  return {
    form,
    errorMessage: resolveErrorMessage(mutation.error),
    isSubmitting: mutation.isPending,
    canRecoverPassword: failedLoginAttempts >= FAILED_LOGINS_BEFORE_RECOVERY,
  };
};

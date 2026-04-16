import { useMutation } from "@tanstack/react-query";
import { type LoginInput, loginUser } from "../../infrastructure/api/authApi";
import { useAuth } from "./useAuth";

export function useLoginMutation() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (data: LoginInput) => loginUser(data),
    onSuccess: () => {
      login();
    },
  });
}

import { useRouter } from "@tanstack/react-router";
import { useUserStore } from "../stores/useUserStore";

export const useAuth = () => {
  const setAuthenticated = useUserStore((state) => state.setAuthenticated);
  const router = useRouter();

  const navigateToRoot = () =>
    router.navigate({
      to: ".",
    });

  const logout = () => {
    useUserStore.persist.clearStorage();
    setAuthenticated(false);
    navigateToRoot();
  };

  const login = () => {
    setAuthenticated(true);
    navigateToRoot();
  };

  return {
    logout,
    login,
  };
};

import { useQuery } from "@tanstack/react-query";
import { biometricAvailabilityQueryOptions } from "../queries/biometricQueries";

/**
 * En escritorio el plugin no existe, así que esto siempre resuelve a
 * `isAvailable: false` y toda la interfaz biométrica se oculta sola.
 */
export const useBiometricAvailability = () => {
  const { data } = useQuery(biometricAvailabilityQueryOptions);

  return {
    isAvailable: data?.isAvailable ?? false,
  };
};

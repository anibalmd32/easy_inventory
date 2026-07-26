import { queryOptions } from "@tanstack/react-query";
import { biometricService } from "../../infrastructure/container";

export const biometricKeys = {
  availability: [
    "biometric",
    "availability",
  ] as const,
};

/**
 * Si el dispositivo puede pedir huella o rostro.
 *
 * No cambia mientras la app está abierta salvo que el usuario registre una
 * huella nueva desde los ajustes del sistema, así que se cachea de por vida y
 * no se reintenta: en escritorio siempre va a fallar.
 */
export const biometricAvailabilityQueryOptions = queryOptions({
  queryKey: biometricKeys.availability,
  queryFn: () => biometricService.getAvailability(),
  staleTime: Number.POSITIVE_INFINITY,
  retry: false,
});

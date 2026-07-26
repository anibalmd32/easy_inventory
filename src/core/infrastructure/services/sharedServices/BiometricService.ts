import {
  authenticate,
  BiometryType,
  checkStatus,
} from "@tauri-apps/plugin-biometric";

export type BiometricAvailability = {
  isAvailable: boolean;
  biometryType: BiometryType;
};

export type BiometricAuthResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      cancelledByUser: boolean;
    };

/**
 * El plugin señala la cancelación con un código (`userCancel`, `systemCancel`,
 * `ERROR_CANCELED`), pero la forma exacta con la que llega ese código al lado
 * JS depende de la capa nativa. Se busca el marcador dentro del error
 * serializado para que funcione tanto si llega como cadena suelta como si
 * viene dentro de un objeto.
 */
const CANCELLATION_MARKERS = [
  "usercancel",
  "systemcancel",
  "canceled",
  "cancelled",
];

const describeError = (error: unknown): string => {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  try {
    return JSON.stringify(error) ?? "";
  } catch {
    return String(error);
  }
};

const isCancellation = (error: unknown): boolean => {
  const description = describeError(error).toLowerCase();

  return CANCELLATION_MARKERS.some((marker) => description.includes(marker));
};

/**
 * Envoltorio del plugin biométrico de Tauri.
 *
 * El plugin solo se compila en móvil, así que en escritorio el `invoke` falla
 * porque el comando no existe. Aquí eso se traduce a "no disponible" en vez de
 * propagarse: el resto de la app no tiene por qué saber en qué plataforma
 * corre.
 */
export class BiometricService {
  async getAvailability(): Promise<BiometricAvailability> {
    try {
      const status = await checkStatus();

      return {
        isAvailable: status.isAvailable,
        biometryType: status.biometryType,
      };
    } catch {
      return {
        isAvailable: false,
        biometryType: BiometryType.None,
      };
    }
  }

  async authenticate(
    reason: string,
    options: {
      title: string;
      subtitle?: string;
      cancelTitle: string;
    },
  ): Promise<BiometricAuthResult> {
    try {
      await authenticate(reason, {
        title: options.title,
        subtitle: options.subtitle,
        cancelTitle: options.cancelTitle,
        // La app ya tiene su propio acceso por contraseña; dejar caer al PIN
        // del dispositivo solo añadiría una vía que no controlamos.
        allowDeviceCredential: false,
      });

      return {
        ok: true,
      };
    } catch (error) {
      if (!isCancellation(error)) {
        console.error(error);
      }

      return {
        ok: false,
        cancelledByUser: isCancellation(error),
      };
    }
  }
}

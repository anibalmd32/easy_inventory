import {
  cancel,
  checkPermissions,
  Format,
  requestPermissions,
  scan,
} from "@tauri-apps/plugin-barcode-scanner";

export type ScanResult =
  | {
      ok: true;
      code: string;
    }
  | {
      ok: false;
      /** El usuario cerró la cámara o no dio permiso: no es un fallo. */
      cancelled: boolean;
    };

/**
 * Formatos que trae la mercancía de una bodega. Los códigos de barras de
 * producto son EAN/UPC; el QR entra porque algunos proveedores ya lo usan y
 * no cuesta nada aceptarlo.
 */
const PRODUCT_FORMATS = [
  Format.EAN13,
  Format.EAN8,
  Format.UPC_A,
  Format.UPC_E,
  Format.Code128,
  Format.Code39,
  Format.QRCode,
];

/**
 * Envoltorio del escáner de códigos de Tauri.
 *
 * El plugin solo se compila en móvil, igual que el biométrico: en escritorio
 * el `invoke` falla porque el comando no existe, y aquí eso se traduce a "no
 * disponible" en vez de propagarse.
 */
export class BarcodeScannerService {
  async isAvailable(): Promise<boolean> {
    try {
      await checkPermissions();
      return true;
    } catch {
      return false;
    }
  }

  async scanProductCode(): Promise<ScanResult> {
    try {
      const permission = await checkPermissions();

      if (permission !== "granted") {
        const requested = await requestPermissions();

        if (requested !== "granted") {
          return {
            ok: false,
            cancelled: true,
          };
        }
      }

      // `windowed: false`: la cámara ocupa toda la pantalla. Con la vista
      // transparente habría que dejar hueco en el layout, y el formulario
      // está encima de un diálogo.
      const result = await scan({
        windowed: false,
        formats: PRODUCT_FORMATS,
      });

      const code = result.content.trim();

      if (code.length === 0) {
        return {
          ok: false,
          cancelled: true,
        };
      }

      return {
        ok: true,
        code,
      };
    } catch (error) {
      console.error(error);

      // Si algo quedó a medias, la cámara no puede quedarse abierta encima
      // de la app.
      await cancel().catch(() => {});

      return {
        ok: false,
        cancelled: true,
      };
    }
  }
}

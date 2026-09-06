import { shareFile } from "@choochmeque/tauri-plugin-sharekit-api";
import { appCacheDir, join } from "@tauri-apps/api/path";
import { save } from "@tauri-apps/plugin-dialog";
import { BaseDirectory, mkdir, writeFile } from "@tauri-apps/plugin-fs";

export type DeliveryResult = {
  /** `false` cuando el usuario cerró la hoja de compartir o el diálogo. */
  done: boolean;
};

/** Subcarpeta de la caché donde se dejan los archivos listos para compartir. */
const SHARED_FOLDER = "compartidos";

/**
 * Entrega un archivo generado por la app: compartirlo con otra aplicación o
 * guardarlo donde el usuario elija.
 *
 * Compartir es lo natural en el móvil (WhatsApp, Telegram, Drive) y necesita
 * que el archivo exista antes en disco: se escribe en la caché de la app, que
 * es la única carpeta a la que siempre se puede escribir sin pedir permisos
 * de almacenamiento, y desde ahí se pasa a la hoja de compartir del sistema.
 */
export class FileDeliveryService {
  /**
   * Abre la hoja de compartir del sistema con el archivo.
   *
   * El plugin solo existe en móvil; en escritorio lanza porque el comando no
   * está registrado, y quien llama debe caer entonces en `saveAs`.
   */
  async share(
    fileName: string,
    contents: Uint8Array,
    mimeType: string,
    title: string,
  ): Promise<DeliveryResult> {
    const path = await this.writeToCache(fileName, contents);

    // `file://` + ruta absoluta: en Android queda `file:///data/...`, que es
    // lo que espera el plugin para pasársela al FileProvider.
    await shareFile(`file://${path}`, {
      mimeType,
      title,
    });

    return {
      done: true,
    };
  }

  /**
   * Diálogo "Guardar como". En Android abre el selector del sistema y
   * devuelve una URI de contenido; en escritorio, una ruta normal.
   */
  async saveAs(
    fileName: string,
    contents: Uint8Array,
    extension: string,
    filterName: string,
  ): Promise<DeliveryResult> {
    const target = await save({
      defaultPath: fileName,
      filters: [
        {
          name: filterName,
          extensions: [
            extension,
          ],
        },
      ],
    });

    if (!target) {
      return {
        done: false,
      };
    }

    await writeFile(target, contents);

    return {
      done: true,
    };
  }

  private async writeToCache(
    fileName: string,
    contents: Uint8Array,
  ): Promise<string> {
    // La carpeta puede no existir todavía: `writeFile` crea el archivo, no el
    // directorio que lo contiene.
    await mkdir(SHARED_FOLDER, {
      baseDir: BaseDirectory.AppCache,
      recursive: true,
    });

    const relativePath = `${SHARED_FOLDER}/${fileName}`;

    await writeFile(relativePath, contents, {
      baseDir: BaseDirectory.AppCache,
    });

    return join(await appCacheDir(), relativePath);
  }
}

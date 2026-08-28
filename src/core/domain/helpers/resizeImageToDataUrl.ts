/**
 * Lado máximo del avatar ya reducido. Se muestra a 40–64 px, así que 256
 * sobra incluso en pantallas de alta densidad.
 */
const MAX_DIMENSION = 256;

/** Calidad del JPEG resultante. 0.85 es indistinguible a este tamaño. */
const QUALITY = 0.85;

/**
 * Reduce una imagen y la devuelve como data URL.
 *
 * Reducirla no es cosmético: el avatar viaja dentro de `userData`, que el
 * store persiste en `localStorage`. Una foto de móvil sin tocar ocupa varios
 * MB y en base64 crece un tercio más, así que reventaría la cuota de
 * `localStorage` y la sesión dejaría de guardarse sin avisar. Ya reducida,
 * ronda las decenas de KB.
 *
 * Sale en JPEG: pierde la transparencia, que en un avatar recortado en
 * círculo no se nota, y pesa bastante menos que un PNG.
 */
export const resizeImageToDataUrl = async (file: File): Promise<string> => {
  const bitmap = await createImageBitmap(file);

  try {
    const scale = Math.min(
      1,
      MAX_DIMENSION / Math.max(bitmap.width, bitmap.height),
    );
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("No se pudo preparar el lienzo para redimensionar");
    }

    context.drawImage(bitmap, 0, 0, width, height);

    return canvas.toDataURL("image/jpeg", QUALITY);
  } finally {
    bitmap.close();
  }
};

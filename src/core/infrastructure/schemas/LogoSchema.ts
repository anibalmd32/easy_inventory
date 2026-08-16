import * as v from "valibot";
import { LOGO_VALIDATION_ERROR_MESSAGES } from "../../domain/enums/validationErrorMessages";
import { MIME_TYPES } from "../../domain/helpers/mimeTypes";

/**
 * El logo entra como archivo antes de convertirse en data URL; los límites
 * son los mismos que los del avatar de perfil.
 */
export const LogoFileSchema = v.pipe(
  v.file(),
  v.maxSize(1024 * 1024 * 10, LOGO_VALIDATION_ERROR_MESSAGES.max_size),
  v.mimeType(
    [
      MIME_TYPES.JPEG,
      MIME_TYPES.PNG,
    ],
    LOGO_VALIDATION_ERROR_MESSAGES.invalid_mime_type,
  ),
);

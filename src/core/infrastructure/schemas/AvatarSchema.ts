import * as v from "valibot";
import { AVATAR_VALIDATION_ERROR_MESSAGES } from "../../domain/enums/validationErrorMessages";
import { MIME_TYPES } from "../../domain/helpers/mimeTypes";

export const AvatarSchema = v.pipe(
  v.file(),
  v.maxSize(1024 * 1024 * 10, AVATAR_VALIDATION_ERROR_MESSAGES.max_size),
  v.mimeType(
    [
      MIME_TYPES.JPEG,
      MIME_TYPES.PNG,
    ],
    AVATAR_VALIDATION_ERROR_MESSAGES.invalid_mime_type,
  ),
);

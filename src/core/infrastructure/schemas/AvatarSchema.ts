import * as v from "valibot";

export const AvatarSchema = v.pipe(
  v.file(),
  v.maxSize(1024 * 1024 * 10, "Please select a file smaller than 10 MB."),
  v.mimeType(
    [
      "image/jpeg",
      "image/png",
    ],
    "Please select a JPEG or PNG file.",
  ),
);

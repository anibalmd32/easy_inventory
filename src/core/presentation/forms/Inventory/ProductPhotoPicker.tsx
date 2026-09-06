import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdImage, MdOutlineInventory2 } from "react-icons/md";
import * as v from "valibot";
import { resizeImageToDataUrl } from "../../../domain/helpers/resizeImageToDataUrl";
import { ProductPhotoFileSchema } from "../../../infrastructure/schemas/ProductSchemas";

interface ProductPhotoPickerProps {
  value: string | null;
  onChange: (photo: string | null) => void;
}

/**
 * Foto del producto.
 *
 * Se reduce antes de guardarla, como el avatar: la foto viaja dentro de la
 * fila del producto y el listado carga varias a la vez, así que una imagen de
 * cámara sin tocar (varios MB, y un tercio más en base64) haría lento algo que
 * se usa todos los días.
 */
export const ProductPhotoPicker = ({
  value,
  onChange,
}: ProductPhotoPickerProps) => {
  const { t } = useTranslation();
  const { t: tValidation } = useTranslation("validations");
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isWorking, setIsWorking] = useState(false);

  const handleFile = async (file: File) => {
    setError(null);

    const result = v.safeParse(ProductPhotoFileSchema, file);

    if (!result.success) {
      const issue = result.issues[0];
      setError(
        issue ? tValidation(issue.message) : t("errors.auth.unexpected"),
      );
      return;
    }

    setIsWorking(true);

    try {
      onChange(await resizeImageToDataUrl(file));
    } catch {
      setError(t("errors.auth.unexpected"));
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <fieldset className="fieldset w-full">
      <legend className="fieldset-legend">
        {t("pages.inventory.form.photoLabel")}
      </legend>

      <div className="flex items-center gap-3">
        {value ? (
          <img
            alt={t("pages.inventory.form.photoLabel")}
            className="h-20 w-20 rounded-box bg-base-200 object-cover"
            src={value}
          />
        ) : (
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-box border border-base-300 border-dashed">
            <MdOutlineInventory2 className="opacity-40" size={28} />
          </div>
        )}

        <div className="flex min-w-0 flex-col gap-2">
          <input
            accept="image/jpeg,image/png"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                void handleFile(file);
              }

              // Se limpia para poder volver a elegir el mismo archivo.
              e.target.value = "";
            }}
            ref={inputRef}
            type="file"
          />

          <div className="flex flex-wrap gap-2">
            <button
              className="btn btn-sm"
              disabled={isWorking}
              onClick={() => inputRef.current?.click()}
              type="button"
            >
              {isWorking ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <MdImage size={18} />
              )}
              {value
                ? t("pages.inventory.form.photoChange")
                : t("pages.inventory.form.photoAdd")}
            </button>

            {value ? (
              <button
                className="btn btn-ghost btn-sm"
                disabled={isWorking}
                onClick={() => onChange(null)}
                type="button"
              >
                {t("pages.inventory.form.photoRemove")}
              </button>
            ) : null}
          </div>

          <p className="text-xs opacity-60">
            {t("pages.inventory.form.photoHint")}
          </p>
        </div>
      </div>

      {error ? (
        <em className="text-error" role="alert">
          {error}
        </em>
      ) : null}
    </fieldset>
  );
};

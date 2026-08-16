import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdImage, MdOutlineStore, MdUpload } from "react-icons/md";
import * as v from "valibot";
import { businessSettingsService } from "../../../infrastructure/container";
import { LogoFileSchema } from "../../../infrastructure/schemas/LogoSchema";
import { FormAlert } from "../../components/FormAlert";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import {
  businessSettingQueryOptions,
  businessSettingsKeys,
} from "../../queries/businessSettingsQueries";

/**
 * El logo se sube con un `<input type="file">` del WebView (funciona igual en
 * Android), se valida como archivo y se guarda como data URL: no hace falta
 * tocar el sistema de archivos ni plugins nuevos.
 */
export const BusinessLogoCard = () => {
  const { t } = useTranslation();
  const { t: tValidation } = useTranslation("validations");
  const queryClient = useQueryClient();
  const resolveErrorMessage = useErrorMessage();
  const { data, isPending } = useQuery(businessSettingQueryOptions);
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const save = useMutation({
    mutationFn: (logo: string | null) =>
      businessSettingsService.updateLogo({
        logo,
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: businessSettingsKeys.settings,
      }),
  });

  const handleFile = (file: File) => {
    setFileError(null);

    const result = v.safeParse(LogoFileSchema, file);

    if (!result.success) {
      const issue = result.issues[0];
      setFileError(
        issue ? tValidation(issue.message) : t("errors.auth.unexpected"),
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        save.mutate(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const errorMessage = fileError ?? resolveErrorMessage(save.error);
  const isBusy = isPending || save.isPending;

  return (
    <section className="card bg-base-100 shadow-sm">
      <div className="card-body gap-4 p-4 sm:p-6">
        <header className="flex items-start gap-3">
          <MdImage className="mt-1 shrink-0 opacity-60" size={22} />
          <div className="min-w-0">
            <h2 className="font-semibold">
              {t("pages.settings.business.logo.title")}
            </h2>
            <p className="text-sm opacity-70">
              {t("pages.settings.business.logo.description")}
            </p>
          </div>
        </header>

        {errorMessage ? <FormAlert message={errorMessage} /> : null}

        <div className="flex flex-wrap items-center gap-4">
          {data?.logo ? (
            <img
              alt={t("pages.settings.business.logo.title")}
              className="h-24 w-24 rounded-box bg-base-200 object-contain p-2"
              src={data.logo}
            />
          ) : (
            <div className="grid h-24 w-24 shrink-0 place-items-center rounded-box border border-base-300 border-dashed">
              <MdOutlineStore className="opacity-40" size={32} />
            </div>
          )}

          <div className="flex min-w-0 flex-col gap-2">
            <input
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  handleFile(file);
                }

                // Se limpia para poder volver a elegir el mismo archivo.
                e.target.value = "";
              }}
              ref={inputRef}
              type="file"
            />

            <div className="flex flex-wrap gap-2">
              <button
                className="btn btn-primary btn-sm"
                disabled={isBusy}
                onClick={() => inputRef.current?.click()}
                type="button"
              >
                {isBusy ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <MdUpload size={18} />
                )}
                {data?.logo
                  ? t("pages.settings.business.logo.change")
                  : t("pages.settings.business.logo.upload")}
              </button>

              {data?.logo ? (
                <button
                  className="btn btn-ghost btn-sm"
                  disabled={isBusy}
                  onClick={() => save.mutate(null)}
                  type="button"
                >
                  {t("pages.settings.business.logo.remove")}
                </button>
              ) : null}
            </div>

            <p className="text-sm opacity-70">
              {t("pages.settings.business.logo.hint")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

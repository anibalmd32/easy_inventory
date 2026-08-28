import { revalidateLogic } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdCheck, MdPerson, MdUpload } from "react-icons/md";
import * as v from "valibot";
import { PROFILE_ERROR_MESSAGES } from "../../../domain/enums/profileErrorMessages";
import { ProfileError } from "../../../domain/errors/ProfileError";
import { resizeImageToDataUrl } from "../../../domain/helpers/resizeImageToDataUrl";
import { profileService } from "../../../infrastructure/container";
import {
  UpdateProfileDto,
  type UpdateProfileInput,
} from "../../../infrastructure/dtos/ProfileDtos";
import { AvatarSchema } from "../../../infrastructure/schemas/AvatarSchema";
import { FormAlert } from "../../components/FormAlert";
import { UserAvatar } from "../../components/UserAvatar";
import { useAppForm } from "../../hooks/create-form-hook";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import { useUserStore } from "../../stores/useUserStore";

/** Nombre, apellido y foto de la propia cuenta. */
export const ProfileIdentityCard = () => {
  const { t } = useTranslation();
  const { t: tValidation } = useTranslation("validations");
  const resolveErrorMessage = useErrorMessage();
  const userData = useUserStore((state) => state.userData);
  const updateSessionProfile = useUserStore(
    (state) => state.updateSessionProfile,
  );
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const save = useMutation({
    mutationFn: async (input: {
      values: UpdateProfileInput;
      avatarUrl?: string | null;
    }) => {
      if (!userData) {
        throw new ProfileError(PROFILE_ERROR_MESSAGES.not_found);
      }

      const saved = await profileService.updateProfile(
        userData.id,
        input.values,
        input.avatarUrl,
      );

      updateSessionProfile({
        ...saved,
        avatar_url: input.avatarUrl,
      });
    },
  });

  const form = useAppForm({
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: UpdateProfileDto,
    },
    defaultValues: {
      name: userData?.profile.name ?? "",
      last_name: userData?.profile.last_name ?? "",
    } satisfies UpdateProfileInput,
    onSubmit: async ({ value }) => {
      await save
        .mutateAsync({
          values: value,
        })
        .catch(() => {});
    },
  });

  if (!userData) {
    return null;
  }

  const displayName =
    `${userData.profile.name} ${userData.profile.last_name}`.trim();

  const handleFile = async (file: File) => {
    setFileError(null);

    const result = v.safeParse(AvatarSchema, file);

    if (!result.success) {
      const issue = result.issues[0];
      setFileError(
        issue ? tValidation(issue.message) : t("errors.profile.image_failed"),
      );

      return;
    }

    try {
      // Se reduce antes de guardar: el avatar viaja dentro de la sesión, que
      // se persiste en localStorage, y la cuota de ahí es pequeña.
      const dataUrl = await resizeImageToDataUrl(file);

      await save
        .mutateAsync({
          values: {
            name: userData.profile.name,
            last_name: userData.profile.last_name,
          },
          avatarUrl: dataUrl,
        })
        .catch(() => {});
    } catch {
      setFileError(t("errors.profile.image_failed"));
    }
  };

  const errorMessage = fileError ?? resolveErrorMessage(save.error);

  return (
    <section className="card bg-base-100 shadow-sm">
      <div className="card-body gap-4 p-4 sm:p-6">
        <header className="flex items-start gap-3">
          <MdPerson className="mt-1 shrink-0 opacity-60" size={22} />
          <div className="min-w-0">
            <h2 className="font-semibold">
              {t("pages.profile.identity.title")}
            </h2>
            <p className="text-sm opacity-70">
              {t("pages.profile.identity.description")}
            </p>
          </div>
        </header>

        {errorMessage ? <FormAlert message={errorMessage} /> : null}

        <div className="flex flex-wrap items-center gap-4">
          <UserAvatar
            avatarUrl={userData.profile.avatar_url}
            name={displayName}
            sizeClassName="w-20"
          />
          <div className="flex flex-col gap-2">
            <input
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];

                if (file) {
                  void handleFile(file);
                }

                // Se limpia para poder volver a elegir el mismo archivo.
                event.target.value = "";
              }}
              ref={inputRef}
              type="file"
            />
            <div className="flex flex-wrap gap-2">
              <button
                className="btn btn-sm"
                disabled={save.isPending}
                onClick={() => inputRef.current?.click()}
                type="button"
              >
                <MdUpload size={18} />
                {userData.profile.avatar_url
                  ? t("pages.profile.identity.changePhoto")
                  : t("pages.profile.identity.addPhoto")}
              </button>
              {userData.profile.avatar_url ? (
                <button
                  className="btn btn-ghost btn-sm"
                  disabled={save.isPending}
                  onClick={() =>
                    save.mutate({
                      values: {
                        name: userData.profile.name,
                        last_name: userData.profile.last_name,
                      },
                      avatarUrl: null,
                    })
                  }
                  type="button"
                >
                  {t("pages.profile.identity.removePhoto")}
                </button>
              ) : null}
            </div>
            <p className="text-xs opacity-60">
              {t("pages.profile.identity.photoHint")}
            </p>
          </div>
        </div>

        <form
          className="flex flex-col gap-1"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <form.AppField
              children={(field) => (
                <field.TextInput
                  autoCapitalize="sentences"
                  label={t("inputs.name.label")}
                  placeholder={t("inputs.name.placeholder")}
                />
              )}
              name="name"
            />
            <form.AppField
              children={(field) => (
                <field.TextInput
                  autoCapitalize="sentences"
                  label={t("inputs.lastName.label")}
                  placeholder={t("inputs.lastName.placeholder")}
                />
              )}
              name="last_name"
            />
          </div>

          <div className="mt-2 flex items-center gap-3">
            <form.Subscribe selector={(state) => state.canSubmit}>
              {(canSubmit) => (
                <button
                  className="btn btn-primary btn-sm"
                  disabled={!canSubmit || save.isPending}
                  type="submit"
                >
                  {save.isPending ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : null}
                  {t("buttons.save.label")}
                </button>
              )}
            </form.Subscribe>

            {save.isSuccess && !save.isPending ? (
              <span className="flex items-center gap-1 text-sm text-success">
                <MdCheck size={16} />
                {t("pages.settings.inventory.lowQuantity.saved")}
              </span>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );
};

import { revalidateLogic, useStore } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type { MeasurementUnitData } from "../../../domain/data/MeasurementUnitData";
import { inventorySettingsService } from "../../../infrastructure/container";
import {
  MeasurementUnitDto,
  type MeasurementUnitInput,
} from "../../../infrastructure/dtos/InventorySettingsDtos";
import { FormAlert } from "../../components/FormAlert";
import { useAppForm } from "../../hooks/create-form-hook";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import { inventorySettingsKeys } from "../../queries/inventorySettingsQueries";

interface UnitFormProps {
  item: MeasurementUnitData | null;
  onDone: () => void;
}

export const UnitForm = ({ item, onDone }: UnitFormProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const resolveErrorMessage = useErrorMessage();

  const save = useMutation({
    mutationFn: (values: MeasurementUnitInput) =>
      item
        ? inventorySettingsService.updateUnit(item.id, values)
        : inventorySettingsService.createUnit(values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: inventorySettingsKeys.units,
      });
      onDone();
    },
  });

  const form = useAppForm({
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: MeasurementUnitDto,
    },
    defaultValues: {
      name: item?.name ?? "",
      abbreviation: item?.abbreviation ?? "",
    } satisfies MeasurementUnitInput,
    onSubmit: async ({ value }) => {
      await save.mutateAsync(value).catch(() => {});
    },
  });

  // La abreviatura es lo que el usuario va a leer junto a cada cifra, así que
  // se le enseña el resultado en vez de pedirle que se lo imagine.
  const abbreviation = useStore(
    form.store,
    (state) => state.values.abbreviation,
  );
  const errorMessage = resolveErrorMessage(save.error);

  return (
    <form
      className="flex w-full flex-col gap-1"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      {errorMessage ? <FormAlert message={errorMessage} /> : null}

      <form.AppField
        children={(field) => (
          <field.TextInput
            autoCapitalize="sentences"
            label={t("pages.settings.inventory.units.nameLabel")}
            placeholder={t("pages.settings.inventory.units.namePlaceholder")}
          />
        )}
        name="name"
      />
      <form.AppField
        children={(field) => (
          <field.TextInput
            autoCapitalize="none"
            label={t("pages.settings.inventory.units.abbreviationLabel")}
            placeholder={t(
              "pages.settings.inventory.units.abbreviationPlaceholder",
            )}
          />
        )}
        name="abbreviation"
      />

      <p className="mt-1 flex items-center gap-2 text-sm opacity-70">
        {t("pages.settings.inventory.units.preview")}
        <span className="badge badge-neutral badge-sm font-mono">
          2 {abbreviation.trim() || "—"}
        </span>
      </p>

      <form.AppForm>
        <form.SubmitBtn
          isLoading={save.isPending}
          label={t("buttons.save.label")}
        />
      </form.AppForm>
    </form>
  );
};

import { revalidateLogic } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type { ProductCategoryData } from "../../../domain/data/ProductCategoryData";
import { inventorySettingsService } from "../../../infrastructure/container";
import {
  ProductCategoryDto,
  type ProductCategoryInput,
} from "../../../infrastructure/dtos/InventorySettingsDtos";
import { FormAlert } from "../../components/FormAlert";
import { useAppForm } from "../../hooks/create-form-hook";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import { inventorySettingsKeys } from "../../queries/inventorySettingsQueries";

interface CategoryFormProps {
  /** `null` al crear; la categoría existente al editar. */
  item: ProductCategoryData | null;
  onDone: () => void;
}

export const CategoryForm = ({ item, onDone }: CategoryFormProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const resolveErrorMessage = useErrorMessage();

  const save = useMutation({
    mutationFn: (values: ProductCategoryInput) =>
      item
        ? inventorySettingsService.updateCategory(item.id, values)
        : inventorySettingsService.createCategory(values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: inventorySettingsKeys.categories,
      });
      onDone();
    },
  });

  const form = useAppForm({
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: ProductCategoryDto,
    },
    defaultValues: {
      name: item?.name ?? "",
      description: item?.description ?? "",
    } satisfies ProductCategoryInput,
    onSubmit: async ({ value }) => {
      await save.mutateAsync(value).catch(() => {});
    },
  });

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
            label={t("pages.settings.inventory.categories.nameLabel")}
            placeholder={t(
              "pages.settings.inventory.categories.namePlaceholder",
            )}
          />
        )}
        name="name"
      />
      <form.AppField
        children={(field) => (
          <field.TextInput
            autoCapitalize="sentences"
            label={t("pages.settings.inventory.categories.descriptionLabel")}
            placeholder={t(
              "pages.settings.inventory.categories.descriptionPlaceholder",
            )}
          />
        )}
        name="description"
      />

      <form.AppForm>
        <form.SubmitBtn
          isLoading={save.isPending}
          label={t("buttons.save.label")}
        />
      </form.AppForm>
    </form>
  );
};

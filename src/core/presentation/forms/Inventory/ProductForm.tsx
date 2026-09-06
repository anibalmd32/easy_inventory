import { revalidateLogic } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type { ProductData } from "../../../domain/data/ProductData";
import { inventoryService } from "../../../infrastructure/container";
import {
  ProductDto,
  type ProductInput,
} from "../../../infrastructure/dtos/ProductDtos";
import { FormAlert } from "../../components/FormAlert";
import { ScanCodeButton } from "../../components/Inventory/ScanCodeButton";
import { useAppForm } from "../../hooks/create-form-hook";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import { inventoryKeys } from "../../queries/inventoryQueries";
import {
  measurementUnitsQueryOptions,
  productCategoriesQueryOptions,
} from "../../queries/inventorySettingsQueries";
import { ProductPhotoPicker } from "./ProductPhotoPicker";

interface ProductFormProps {
  item: ProductData | null;
  onDone: () => void;
}

/** Los `<input>` entregan cadenas; el DTO es quien las convierte. */
const toFormValue = (value: number | null | undefined): string =>
  value === null || value === undefined ? "" : String(value);

export const ProductForm = ({ item, onDone }: ProductFormProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const resolveErrorMessage = useErrorMessage();
  const categories = useQuery(productCategoriesQueryOptions);
  const units = useQuery(measurementUnitsQueryOptions);

  const save = useMutation({
    mutationFn: (values: ProductInput) =>
      item
        ? inventoryService.updateProduct(item.id, values)
        : inventoryService.createProduct(values),
    onSuccess: async () => {
      // Se invalida la raíz: cambiar un producto afecta a la página en la que
      // está, al contador de "queda poco" y a la lista del catálogo.
      await queryClient.invalidateQueries({
        queryKey: inventoryKeys.all,
      });
      onDone();
    },
  });

  const form = useAppForm({
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: ProductDto,
    },
    defaultValues: {
      name: item?.name ?? "",
      description: item?.description ?? "",
      sku: item?.sku ?? "",
      category_id: toFormValue(item?.category_id),
      measurement_unit_id: toFormValue(item?.measurement_unit_id),
      sale_price: toFormValue(item?.sale_price),
      cost_price: toFormValue(item?.cost_price),
      quantity: toFormValue(item?.quantity),
      min_quantity: toFormValue(item?.min_quantity),
      photo: item?.photo ?? null,
    } satisfies ProductInput,
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
          <ProductPhotoPicker
            onChange={(photo) => field.handleChange(photo)}
            value={field.state.value}
          />
        )}
        name="photo"
      />

      <form.AppField
        children={(field) => (
          <field.TextInput
            autoCapitalize="sentences"
            label={t("pages.inventory.form.nameLabel")}
            placeholder={t("pages.inventory.form.namePlaceholder")}
          />
        )}
        name="name"
      />

      <div className="grid gap-1 sm:grid-cols-2">
        <form.AppField
          children={(field) => (
            <field.SelectInput
              label={t("pages.inventory.form.categoryLabel")}
              options={(categories.data ?? []).map((category) => ({
                value: String(category.id),
                label: category.name,
              }))}
              placeholder={t("pages.inventory.form.categoryNone")}
            />
          )}
          name="category_id"
        />

        <form.AppField
          children={(field) => (
            <field.SelectInput
              label={t("pages.inventory.form.unitLabel")}
              options={(units.data ?? []).map((unit) => ({
                value: String(unit.id),
                label: `${unit.name} (${unit.abbreviation})`,
              }))}
              placeholder={t("pages.inventory.form.unitPlaceholder")}
            />
          )}
          name="measurement_unit_id"
        />
      </div>

      <div className="grid gap-1 sm:grid-cols-2">
        <form.AppField
          children={(field) => (
            <field.TextInput
              inputMode="decimal"
              label={t("pages.inventory.form.salePriceLabel")}
              placeholder="0,00"
            />
          )}
          name="sale_price"
        />

        <form.AppField
          children={(field) => (
            <field.TextInput
              inputMode="decimal"
              label={t("pages.inventory.form.costPriceLabel")}
              placeholder="0,00"
            />
          )}
          name="cost_price"
        />
      </div>

      <div className="grid gap-1 sm:grid-cols-2">
        <form.AppField
          children={(field) => (
            <field.TextInput
              inputMode="decimal"
              label={t("pages.inventory.form.quantityLabel")}
              placeholder="0"
            />
          )}
          name="quantity"
        />

        <form.AppField
          children={(field) => (
            <field.TextInput
              inputMode="decimal"
              label={t("pages.inventory.form.minQuantityLabel")}
              placeholder={t("pages.inventory.form.minQuantityPlaceholder")}
            />
          )}
          name="min_quantity"
        />
      </div>

      {/* El código y su botón de escáner comparten fila: en el móvil es el
          mismo gesto, escribirlo o leerlo con la cámara. */}
      <div className="flex items-end gap-2">
        <form.AppField
          children={(field) => (
            <field.TextInput
              autoCapitalize="none"
              label={t("pages.inventory.form.skuLabel")}
              placeholder={t("pages.inventory.form.skuPlaceholder")}
            />
          )}
          name="sku"
        />
        <ScanCodeButton
          className="btn btn-outline mb-1"
          label={t("pages.inventory.form.scan")}
          onScanned={(code) => form.setFieldValue("sku", code)}
        />
      </div>

      <form.AppField
        children={(field) => (
          <field.TextInput
            autoCapitalize="sentences"
            label={t("pages.inventory.form.descriptionLabel")}
            placeholder={t("pages.inventory.form.descriptionPlaceholder")}
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

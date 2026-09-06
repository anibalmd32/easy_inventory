import { revalidateLogic } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type { CustomerData } from "../../../domain/data/CustomerData";
import { pointOfSaleService } from "../../../infrastructure/container";
import {
  CustomerDto,
  type CustomerInput,
} from "../../../infrastructure/dtos/CustomerDtos";
import { FormAlert } from "../../components/FormAlert";
import { useAppForm } from "../../hooks/create-form-hook";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import { salesKeys } from "../../queries/salesQueries";

interface CustomerFormProps {
  /** `null` al registrar uno nuevo; el cliente existente al corregirlo. */
  item: CustomerData | null;
  /** Recibe el id para poder dejarlo elegido en la venta que se está armando. */
  onDone: (customerId: number) => void;
}

/**
 * Registrar o corregir un cliente.
 *
 * Solo el nombre es obligatorio. Pedirle la cédula a todo el que compra una
 * harina sería insoportable, y la venta de mostrador ni siquiera necesita
 * cliente: esto se abre cuando alguien va a fiar o quiere su nombre en el
 * recibo.
 */
export const CustomerForm = ({ item, onDone }: CustomerFormProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const resolveErrorMessage = useErrorMessage();

  const save = useMutation({
    mutationFn: async (values: CustomerInput) => {
      if (item) {
        await pointOfSaleService.updateCustomer(item.id, values);

        return item.id;
      }

      return pointOfSaleService.createCustomer(values);
    },
    onSuccess: async (customerId) => {
      await queryClient.invalidateQueries({
        queryKey: salesKeys.all,
      });
      onDone(customerId);
    },
  });

  const form = useAppForm({
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: CustomerDto,
    },
    defaultValues: {
      name: item?.name ?? "",
      document: item?.document ?? "",
      phone: item?.phone ?? "",
      notes: item?.notes ?? "",
    } satisfies CustomerInput,
    onSubmit: async ({ value }) => {
      await save.mutateAsync(value).catch(() => {});
    },
  });

  const errorMessage = resolveErrorMessage(save.error);

  return (
    <form
      className="flex w-full flex-col gap-1"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
    >
      {errorMessage ? <FormAlert message={errorMessage} /> : null}

      <form.AppField
        children={(field) => (
          <field.TextInput
            autoCapitalize="words"
            label={t("pages.invoicing.customers.nameLabel")}
            placeholder={t("pages.invoicing.customers.namePlaceholder")}
          />
        )}
        name="name"
      />
      <form.AppField
        children={(field) => (
          <field.TextInput
            label={t("pages.invoicing.customers.documentLabel")}
            placeholder={t("pages.invoicing.customers.documentPlaceholder")}
          />
        )}
        name="document"
      />
      <form.AppField
        children={(field) => (
          <field.TextInput
            inputMode="numeric"
            label={t("pages.invoicing.customers.phoneLabel")}
            placeholder={t("pages.invoicing.customers.phonePlaceholder")}
          />
        )}
        name="phone"
      />
      <form.AppField
        children={(field) => (
          <field.TextInput
            autoCapitalize="sentences"
            label={t("pages.invoicing.customers.notesLabel")}
            placeholder={t("pages.invoicing.customers.notesPlaceholder")}
          />
        )}
        name="notes"
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

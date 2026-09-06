import { useQuery } from "@tanstack/react-query";
import { useDeferredValue, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdPersonAdd, MdPersonOutline, MdSearch } from "react-icons/md";
import type { CustomerData } from "../../../domain/data/CustomerData";
import { pointOfSaleService } from "../../../infrastructure/container";
import { CustomerForm } from "../../forms/Pos/CustomerForm";
import { customersQueryOptions } from "../../queries/salesQueries";
import { FormDialog } from "../FormDialog";
import { PriceDisplay } from "../PriceDisplay";

interface CustomerPickerDialogProps {
  open: boolean;
  onClose: () => void;
  onPick: (customer: CustomerData | null) => void;
  /** Si el cajero puede registrar clientes nuevos desde aquí. */
  canCreate: boolean;
}

/** Clientes por página. Con el buscador delante, más no hace falta. */
const PAGE_SIZE = 6;

/**
 * Elegir a quién se le vende.
 *
 * La mayoría de las ventas son anónimas, así que "Sin cliente" está arriba del
 * todo y es un solo toque: buscar a alguien es la excepción, no la norma.
 */
export const CustomerPickerDialog = ({
  open,
  onClose,
  onPick,
  canCreate,
}: CustomerPickerDialogProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const deferredSearch = useDeferredValue(search);
  const customers = useQuery({
    ...customersQueryOptions({
      search: deferredSearch,
      page: 1,
      pageSize: PAGE_SIZE,
    }),
    enabled: open,
  });

  const items = customers.data?.items ?? [];

  const pick = (customer: CustomerData | null) => {
    setSearch("");
    onPick(customer);
  };

  if (isCreating) {
    return (
      <FormDialog
        onClose={() => setIsCreating(false)}
        open={open}
        title={t("pages.invoicing.customers.createTitle")}
      >
        <CustomerForm
          item={null}
          onDone={async (customerId) => {
            setIsCreating(false);
            // Se pide por id y no se busca en la lista: la lista está filtrada
            // por lo que hubiera escrito el cajero, y el cliente recién creado
            // puede no encajar en ese filtro.
            pick(await pointOfSaleService.getCustomer(customerId));
          }}
        />
      </FormDialog>
    );
  }

  return (
    <FormDialog
      description={t("pages.invoicing.customers.pickDescription")}
      onClose={onClose}
      open={open}
      title={t("pages.invoicing.customers.pickTitle")}
    >
      <div className="flex flex-col gap-3">
        <label className="input flex w-full items-center gap-2">
          <MdSearch className="opacity-60" size={18} />
          <input
            aria-label={t("pages.invoicing.customers.searchLabel")}
            className="grow"
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("pages.invoicing.customers.searchPlaceholder")}
            type="search"
            value={search}
          />
        </label>

        <button
          className="btn btn-block justify-start"
          onClick={() => pick(null)}
          type="button"
        >
          <MdPersonOutline size={20} />
          {t("pages.invoicing.customers.anonymous")}
        </button>

        {items.length === 0 && !customers.isPending ? (
          <p className="rounded-box border border-base-300 border-dashed p-4 text-center text-sm opacity-70">
            {t("pages.invoicing.customers.empty")}
          </p>
        ) : null}

        {items.length > 0 ? (
          <ul className="list max-h-64 overflow-y-auto rounded-box bg-base-200">
            {items.map((customer) => (
              <li className="list-row items-center" key={customer.id}>
                <div className="list-col-grow min-w-0">
                  <p className="truncate font-medium">{customer.name}</p>
                  {customer.document ? (
                    <p className="truncate text-xs opacity-60">
                      {customer.document}
                    </p>
                  ) : null}
                  {customer.open_debt_usd > 0 ? (
                    <span className="flex flex-wrap items-baseline gap-1 text-warning text-xs">
                      {t("pages.invoicing.customers.owes")}
                      <PriceDisplay
                        amountUsd={customer.open_debt_usd}
                        size="sm"
                      />
                    </span>
                  ) : null}
                </div>

                <button
                  className="btn btn-primary btn-sm shrink-0"
                  onClick={() => pick(customer)}
                  type="button"
                >
                  {t("pages.invoicing.customers.choose")}
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        {canCreate ? (
          <button
            className="btn btn-outline btn-block"
            onClick={() => setIsCreating(true)}
            type="button"
          >
            <MdPersonAdd size={20} />
            {t("pages.invoicing.customers.create")}
          </button>
        ) : null}
      </div>
    </FormDialog>
  );
};

import { useQuery } from "@tanstack/react-query";
import { CURRENCY, CURRENCY_SYMBOL } from "../../domain/enums/currencies";
import {
  currentRateQueryOptions,
  posSettingQueryOptions,
} from "../queries/posSettingsQueries";

export type FormattedPrice = {
  /** Importe destacado, en la moneda elegida como principal. */
  primary: string;
  /**
   * El mismo importe en la otra moneda, para mostrar más pequeño y entre
   * paréntesis. Es `null` cuando todavía no hay tasa de cambio: en ese caso
   * no se puede convertir y es mejor no mostrar nada que mostrar algo falso.
   */
  secondary: string | null;
};

// Locale venezolano: punto para los miles y coma para los decimales.
const AMOUNT_FORMATTER = new Intl.NumberFormat("es-VE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const withSymbol = (currency: CURRENCY, amount: number): string =>
  `${CURRENCY_SYMBOL[currency]}${currency === CURRENCY.VES ? " " : ""}${AMOUNT_FORMATTER.format(amount)}`;

/**
 * Da formato a un precio según la moneda principal configurada.
 *
 * Los precios se guardan SIEMPRE en dólares (ver la migración 08): el importe
 * en bolívares se deriva de la tasa vigente, así que un cambio de tasa
 * actualiza todos los precios sin tocar el catálogo.
 */
export const usePriceFormatter = () => {
  const { data: settings } = useQuery(posSettingQueryOptions);
  const { data: rate } = useQuery(currentRateQueryOptions);

  const primaryCurrency = settings?.primary_currency ?? CURRENCY.USD;
  const bolivaresPerDollar = rate?.rate ?? null;

  const format = (amountUsd: number): FormattedPrice => {
    // Sin tasa no hay bolívares posibles: se muestra solo el dólar, que es la
    // moneda en la que el importe está realmente guardado.
    if (bolivaresPerDollar === null) {
      return {
        primary: withSymbol(CURRENCY.USD, amountUsd),
        secondary: null,
      };
    }

    const amountVes = amountUsd * bolivaresPerDollar;

    return primaryCurrency === CURRENCY.USD
      ? {
          primary: withSymbol(CURRENCY.USD, amountUsd),
          secondary: withSymbol(CURRENCY.VES, amountVes),
        }
      : {
          primary: withSymbol(CURRENCY.VES, amountVes),
          secondary: withSymbol(CURRENCY.USD, amountUsd),
        };
  };

  return {
    format,
    primaryCurrency,
    hasRate: bolivaresPerDollar !== null,
  };
};

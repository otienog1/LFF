import dataEn from "@/data/data.json";
import dataEs from "@/data/data.es.json";
import dataPt from "@/data/data.pt.json";
import type { Locale } from "@/i18n/config";
import type { Cause, DonateData } from "@/types/content";
import { CURRENCIES, type Currency } from "@/lib/payments";

export { CURRENCIES };
export type { Currency };

/** The cause that stands for the foundation's general fund; it has no page and no items. */
export const GENERAL_ID = "general";

function raw(locale: Locale): DonateData {
  const source = locale === "es" ? dataEs : locale === "pt" ? dataPt : dataEn;
  return (source as unknown as { donate: DonateData }).donate;
}

export function getDonate(locale: Locale = "en"): DonateData {
  return raw(locale);
}

/** Causes with their own page, in the order the foundation lists them. */
export function getCauses(locale: Locale = "en"): Cause[] {
  return raw(locale).causes.filter((c) => c.id !== GENERAL_ID);
}

export function getCause(slug: string, locale: Locale = "en"): Cause | undefined {
  return raw(locale).causes.find((c) => c.slug === slug);
}

export function getGeneral(locale: Locale = "en"): Cause | undefined {
  return raw(locale).causes.find((c) => c.id === GENERAL_ID);
}

/** Units of a currency per US dollar, from the data so the foundation can update them. */
function rateOf(currency: Currency, rates: Record<string, number>): number {
  const rate = rates[currency];
  return rate && rate > 0 ? rate : 1;
}

/** Currencies that can be offered: configured for a payment method, and with a rate in the data. */
export function availableCurrencies(rates: Record<string, number>): Currency[] {
  return CURRENCIES.filter((c) => c === "USD" || (rates[c] ?? 0) > 0);
}

/** A US-dollar amount in the chosen currency, to the cent. */
export function convert(amountUSD: number, currency: Currency, rates: Record<string, number>): number {
  return Math.round(amountUSD * rateOf(currency, rates) * 100) / 100;
}

/** An amount typed in the chosen currency, held in US dollars precisely enough to convert back to the same cent. */
export function toUSD(amount: number, currency: Currency, rates: Record<string, number>): number {
  return Math.round((amount / rateOf(currency, rates)) * 1e6) / 1e6;
}

/**
 * What a set of lines comes to in the chosen currency: each line's converted
 * unit amount times its quantity, summed, to the cent. Every total shown or
 * charged comes from here, so the figure on the page is the figure processed.
 */
export function lineTotal(lines: ReadonlyArray<{ amountUSD: number; qty: number }>, currency: Currency, rates: Record<string, number>): number {
  return Math.round(lines.reduce((sum, l) => sum + convert(l.amountUSD, currency, rates) * l.qty, 0) * 100) / 100;
}

/** Suggested general gifts: the foundation's list for that currency where it has one, else the US-dollar list converted. */
export function presetsFor(donate: DonateData, currency: Currency): { amount: number; amountUSD: number }[] {
  const own = donate.presets?.[currency];
  if (own && own.length > 0) {
    return own.map((amount) => ({ amount, amountUSD: currency === "USD" ? amount : toUSD(amount, currency, donate.rates) }));
  }
  return donate.presetsUSD.map((usd) => ({ amount: convert(usd, currency, donate.rates), amountUSD: usd }));
}

/** A currency amount for display in the page's language; whole amounts drop the cents. */
export function money(amount: number, currency: Currency, locale: Locale): string {
  return new Intl.NumberFormat(locale === "en" ? "en-GB" : locale, {
    style: "currency",
    currency,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

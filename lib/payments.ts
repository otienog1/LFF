/**
 * Payment configuration, read from NEXT_PUBLIC_* variables at build time
 * (see .env.example). Paystack is the foundation's processor; its account is
 * Kenyan and charges shillings, which also lets donors pay by M-Pesa and
 * Airtel Money. Only the public key lives here: the popup runs in the donor's
 * browser, because the site is a static export with no server.
 *
 * PayPal was removed at the owner's instruction on 18 September 2026; the
 * client ID the old page carried was no longer recognised by PayPal anyway.
 */
export type Currency = "USD" | "EUR" | "GBP" | "KES";
const KNOWN: readonly Currency[] = ["USD", "EUR", "GBP", "KES"];

export const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";
/** The checkout is offered once the key is set; until then the page asks donors to write to the foundation. */
export const PAYSTACK_ENABLED = PAYSTACK_PUBLIC_KEY.length > 0;

function currencyList(value: string | undefined, fallback: Currency[]): Currency[] {
  const picked = (value ?? "")
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter((s): s is Currency => (KNOWN as readonly string[]).includes(s));
  return picked.length ? picked : fallback;
}

/**
 * Currencies the foundation's Paystack account may charge, in the order they
 * are offered (the first is the default). Kenyan shillings unless
 * NEXT_PUBLIC_PAYSTACK_CURRENCIES says otherwise; a currency other than US
 * dollars also needs a rate in `donate.rates` in the data. Paystack refused US
 * dollars on the account in November 2026; once it allows them, "KES,USD"
 * offers both.
 */
export const CURRENCIES: readonly Currency[] = currencyList(process.env.NEXT_PUBLIC_PAYSTACK_CURRENCIES, ["KES"]);

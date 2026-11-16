import { describe, it, expect } from "vitest";
import dataEn from "@/data/data.json";
import dataEs from "@/data/data.es.json";
import dataPt from "@/data/data.pt.json";
import type { DonateData } from "@/types/content";
import { convert, lineTotal, presetsFor } from "./donate";

const donateOf = (data: unknown) => (data as { donate: DonateData }).donate;
const languages = { en: donateOf(dataEn), es: donateOf(dataEs), pt: donateOf(dataPt) };

/*
 * The foundation's Paystack account charges Kenyan shillings, so every gift is
 * priced in US dollars in the data and converted at the rate there. The rate
 * was chosen so that every figure on the page is a whole number of shillings.
 */
describe("donate amounts in shillings", () => {
  it("every language converts at the same shilling rate", () => {
    const rate = languages.en.rates.KES;
    expect(rate).toBeGreaterThan(0);
    expect(languages.es.rates.KES).toBe(rate);
    expect(languages.pt.rates.KES).toBe(rate);
  });

  it("every item and suggested gift comes to a whole number of shillings", () => {
    const { rates, causes } = languages.en;
    const amounts = [
      ...presetsFor(languages.en, "KES").map((p) => p.amount),
      ...causes.flatMap((c) => (c.items ?? []).map((i) => convert(i.amountUSD, "KES", rates))),
    ];
    expect(amounts.length).toBeGreaterThan(4);
    for (const amount of amounts) expect(Number.isInteger(amount), `KES ${amount}`).toBe(true);
  });

  it("totals the gift in shillings, the figure Paystack is asked to charge", () => {
    const { rates } = languages.en;
    const lines = [{ amountUSD: 25, qty: 2 }, { amountUSD: 80, qty: 1 }];
    expect(lineTotal(lines, "KES", rates)).toBe(130 * rates.KES);
  });
});

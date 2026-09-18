'use client';
import { useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/config';
import { availableCurrencies, convert, lineTotal, money } from '@/lib/donate';
import { PAYSTACK_ENABLED } from '@/lib/payments';
import { useBasket, type GiftLine } from '@/components/donate/basket';
import { PaystackCheckout, type PaystackResult } from '@/components/donate/PaystackCheckout';
import { Chapter, ChapterMark } from '@/components/home/Chapter';
import { SplitHeading } from '@/components/home/SplitHeading';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function groupByCause(lines: GiftLine[]) {
  const groups = new Map<string, { title: string; lines: GiftLine[] }>();
  for (const l of lines) {
    const g = groups.get(l.causeId) ?? { title: l.causeTitle, lines: [] };
    g.lines.push(l);
    groups.set(l.causeId, g);
  }
  return [...groups.values()];
}

interface Done extends PaystackResult { lines: GiftLine[]; total: string }

/**
 * Your gift: what has been chosen, grouped by project, with quantities that
 * can still change; the currency where more than one is offered; the total;
 * and the Paystack checkout. After payment the chapter turns into the
 * confirmation, listing what the gift supports and the payment reference,
 * and the basket is cleared.
 */
export function GiftSummary({ rates, number }: { rates: Record<string, number>; number: string }) {
  const t = useTranslations('donate');
  const locale = useLocale() as Locale;
  const { lines, currency, hydrated, setQty, remove, clear, setCurrency } = useBasket();
  const [done, setDone] = useState<Done | null>(null);

  const currencies = availableCurrencies(rates);
  const total = lineTotal(lines, currency, rates);
  const fmt = (amount: number) => money(amount, currency, locale);
  const groups = groupByCause(lines);

  const finish = (result: PaystackResult) => {
    setDone({ lines, total: fmt(total), ...result });
    clear();
  };

  return (
    <Chapter tone="inverse" id="your-gift">
      <ChapterMark number={number} label={t('yourGift')} tone="inverse" />

      {done ? (
        <div className="mt-10 lg:grid lg:grid-cols-12 lg:gap-x-8" data-confirmation>
          <div className="lg:col-span-6">
            <SplitHeading text={t('thankYouTitle')} className="display-2 text-paper" />
            <p className="body-lg mt-6 max-w-[48ch] text-paper/70">{t('thankYouBody', { email: done.email })}</p>
            <p className="m-0 mt-6 text-paper">
              <span className="block text-[11px] uppercase tracking-[0.2em] text-paper/70">{t('reference')}</span>
              <span className="mt-1 block font-mono text-lg tracking-wide" data-reference>{done.reference}</span>
            </p>
          </div>
          <div className="mt-10 lg:col-span-5 lg:col-start-8 lg:mt-0">
            <p className="eyebrow text-paper/70!">{t('thankYouFor')}</p>
            <ul className="m-0 mt-4 list-none border-t border-paper/20 p-0">
              {groupByCause(done.lines).map((g) => (
                <li key={g.title} className="border-b border-paper/20 py-4">
                  <p className="m-0 font-display text-lg text-paper">{g.title}</p>
                  <ul className="m-0 mt-1 list-none p-0 text-sm text-paper/70">
                    {g.lines.map((l) => <li key={l.key}>{l.itemId ? `${l.qty} × ${l.title}` : l.title}</li>)}
                  </ul>
                </li>
              ))}
            </ul>
            <p className="m-0 mt-4 flex items-baseline justify-between text-paper"><span className="eyebrow text-paper/70!">{t('total')}</span><span className="font-display text-2xl tabular-nums">{done.total}</span></p>
            <Button variant="ghost" className="mt-8 border-paper text-paper [--wipe:var(--color-paper)] hover:text-ink focus-visible:text-ink" onClick={() => setDone(null)}>{t('clear')}</Button>
          </div>
        </div>
      ) : !hydrated || lines.length === 0 ? (
        <p className="body-lg mt-8 max-w-[48ch] text-paper/70">{t('empty')}</p>
      ) : (
        <div className="mt-10 lg:grid lg:grid-cols-12 lg:gap-x-8">
          {/* What has been chosen */}
          <div className="lg:col-span-6">
            <p className="eyebrow text-paper/70!">{t('provides')}</p>
            <ul className="m-0 mt-4 list-none border-t border-paper/20 p-0">
              {groups.map((g) => (
                <li key={g.title} className="border-b border-paper/20 py-5">
                  <p className="m-0 font-display text-lg text-paper">{g.title}</p>
                  <ul className="m-0 mt-3 list-none space-y-3 p-0">
                    {g.lines.map((l) => (
                      <li key={l.key} className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-paper/80">
                        <span className="min-w-0 flex-1">{l.title}</span>
                        {l.itemId ? (
                          <span className="flex items-center gap-2" role="group" aria-label={`${l.title}: ${t('quantity')}`}>
                            <Button variant="ghost" size="icon-sm" className="border-paper/40 text-paper hover:bg-paper hover:text-ink" aria-label={`${t('fewer')}: ${l.title}`} onClick={() => setQty(l.key, l.qty - 1)}><Minus aria-hidden="true" /></Button>
                            <span className="min-w-[2ch] text-center tabular-nums" aria-live="polite">{l.qty}</span>
                            <Button variant="ghost" size="icon-sm" className="border-paper/40 text-paper hover:bg-paper hover:text-ink" aria-label={`${t('more')}: ${l.title}`} onClick={() => setQty(l.key, l.qty + 1)}><Plus aria-hidden="true" /></Button>
                          </span>
                        ) : null}
                        <span className="w-28 text-right font-display text-base tabular-nums text-paper">{fmt(convert(l.amountUSD, currency, rates) * l.qty)}</span>
                        <button type="button" onClick={() => remove(l.key)} aria-label={`${t('remove')}: ${l.title}`} className="text-paper/60 transition-colors hover:text-paper focus-visible:outline-offset-2"><X aria-hidden="true" className="size-4" /></button>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            <button type="button" onClick={clear} className="link-draw mt-6 text-[11px] font-medium uppercase tracking-[0.2em] text-paper/70 hover:text-paper">{t('clear')}</button>
          </div>

          {/* Currency, total, payment */}
          <div className="mt-12 lg:col-span-5 lg:col-start-8 lg:mt-0">
            {currencies.length > 1 && (
              <fieldset className="m-0 mb-8 border-0 p-0">
                <legend className="eyebrow text-paper/70!">{t('currency')}</legend>
                <div className="mt-3 flex flex-wrap gap-2" role="radiogroup">
                  {currencies.map((c) => (
                    <button
                      key={c}
                      type="button"
                      role="radio"
                      aria-checked={currency === c}
                      onClick={() => setCurrency(c)}
                      className={cn('border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-200', currency === c ? 'border-paper bg-paper text-ink' : 'border-paper/40 text-paper/80 hover:border-paper hover:text-paper')}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            <p className="m-0 flex items-baseline justify-between gap-4 border-t border-paper/20 pt-6 text-paper">
              <span className="eyebrow text-paper/70!">{t('total')}</span>
              <span className="font-display text-4xl tabular-nums" aria-live="polite" data-total>{fmt(total)}</span>
            </p>

            <div className="mt-8">
              <p className="eyebrow text-paper/70! mb-6">{t('payHeading')}</p>
              {PAYSTACK_ENABLED ? (
                <PaystackCheckout lines={lines} currency={currency} rates={rates} onSuccess={finish} />
              ) : (
                <p className="m-0 max-w-[44ch] text-sm leading-relaxed text-paper/80" data-no-method>{t('noMethod')}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </Chapter>
  );
}

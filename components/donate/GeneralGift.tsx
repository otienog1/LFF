'use client';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { Cause, DonateData } from '@/types/content';
import type { Locale } from '@/i18n/config';
import { convert, money, presetsFor, toUSD } from '@/lib/donate';
import { useBasket } from '@/components/donate/basket';
import { Chapter, ChapterMark, type ChapterTone } from '@/components/home/Chapter';
import { SplitHeading } from '@/components/home/SplitHeading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/**
 * A gift of any amount to one cause: the suggested amounts as a row of
 * choices, or a figure of the donor's own, added to the gift as a single line
 * that a second entry replaces. Amounts are shown in the donor's currency and
 * held in US dollars, like the items.
 */
export function GeneralGift({
  cause,
  donate,
  number,
  heading,
  intro,
  tone = 'deep',
}: {
  cause: Cause;
  donate: DonateData;
  number: string;
  heading: string;
  intro: string;
  tone?: ChapterTone;
}) {
  const t = useTranslations('donate');
  const locale = useLocale() as Locale;
  const { currency, add, lines } = useBasket();
  const [chosen, setChosen] = useState<{ amount: number; amountUSD: number } | null>(null);
  const [custom, setCustom] = useState('');
  const [justAdded, setJustAdded] = useState(false);

  const rates = donate.rates;
  const presets = presetsFor(donate, currency);
  const customValue = parseFloat(custom);
  const customEntry = !isNaN(customValue) && customValue > 0 ? { amount: Math.round(customValue * 100) / 100, amountUSD: toUSD(customValue, currency, rates) } : null;
  const selection = customEntry ?? chosen;
  const existing = lines.find((l) => l.key === `${cause.id}:general`);
  const inputId = `amount-${cause.id}`;

  const submit = () => {
    if (!selection) return;
    add({ causeId: cause.id, causeTitle: cause.title, title: t('generalLine'), amountUSD: selection.amountUSD, qty: 1 });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2500);
  };

  return (
    <Chapter tone={tone} id={`give-${cause.id}`}>
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-5">
          <ChapterMark number={number} label={t('orGive')} tone={tone} />
          <SplitHeading text={heading} className="display-2 mt-6 max-w-[16ch]" />
          <p className="body-lg mt-6 max-w-[44ch] text-ink-soft">{intro}</p>
        </div>

        <form
          className="mt-12 lg:col-span-6 lg:col-start-7 lg:mt-0"
          onSubmit={(e) => { e.preventDefault(); submit(); }}
          aria-describedby={`${inputId}-status`}
        >
          <fieldset className="m-0 border-0 p-0">
            <legend className="eyebrow mb-4">{t('suggested')}</legend>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {presets.map((p) => {
                const on = !customEntry && chosen?.amountUSD === p.amountUSD;
                return (
                  <button
                    key={p.amount}
                    type="button"
                    aria-pressed={on}
                    onClick={() => { setChosen(p); setCustom(''); }}
                    className={cn(
                      'border px-2 py-4 font-display text-xl tabular-nums transition-colors duration-200 focus-visible:outline-offset-2',
                      on ? 'border-green bg-green text-paper' : 'border-ink/20 text-ink hover:border-green hover:text-green',
                    )}
                  >
                    {money(p.amount, currency, locale)}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-8">
            <Label htmlFor={inputId} className="eyebrow">{t('customAmount')}</Label>
            <div className="mt-3 flex items-baseline gap-3 border-b border-ink/30 focus-within:border-green">
              <span className="text-sm text-ink-soft" aria-hidden="true">{currency}</span>
              <Input
                id={inputId}
                type="number"
                inputMode="decimal"
                min="1"
                step="1"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="0"
                className="h-12 rounded-none border-0 bg-transparent px-0 font-display text-2xl tabular-nums shadow-none focus-visible:border-0 focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button type="submit" size="lg" disabled={!selection} className="text-[13px]">
              {selection ? `${t('addAmount')}: ${money(selection.amount, currency, locale)}` : t('addAmount')}
            </Button>
            <p id={`${inputId}-status`} className="m-0 text-sm text-ink-soft" aria-live="polite">
              {justAdded ? t('added') : existing ? t('currentGeneral', { amount: money(convert(existing.amountUSD, currency, rates), currency, locale) }) : ''}
            </p>
          </div>
        </form>
      </div>
    </Chapter>
  );
}

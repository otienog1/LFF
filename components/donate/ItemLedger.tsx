'use client';
import { ArrowDown, Minus, Plus } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import type { Cause, GiftItem } from '@/types/content';
import type { Locale } from '@/i18n/config';
import { convert, lineTotal, money } from '@/lib/donate';
import { useBasket } from '@/components/donate/basket';
import { useLenis } from '@/components/layout/Layout';
import { Chapter, ChapterMark } from '@/components/home/Chapter';
import { SplitHeading } from '@/components/home/SplitHeading';
import { Reveal } from '@/components/motion/Reveal';
import { START } from '@/components/motion/presets';
import { SmartImage } from '@/components/ui/SmartImage';
import { PendingPhoto, isPending } from '@/components/shared/PendingPhoto';
import { typeset } from '@/lib/typeset';
import { cn } from '@/lib/utils';

const COLS = 'md:grid-cols-[3rem_1fr_9rem_auto] md:gap-x-6';

function Row({ cause, item, index, rates }: { cause: Cause; item: GiftItem; index: number; rates: Record<string, number> }) {
  const t = useTranslations('donate');
  const locale = useLocale() as Locale;
  const { currency, qtyOf, add, setQty } = useBasket();
  const qty = qtyOf(cause.id, item.id);
  const selected = qty > 0;
  const price = money(convert(item.amountUSD, currency, rates), currency, locale);
  const key = `${cause.id}:${item.id}`;
  const stepButton = 'flex size-11 items-center justify-center text-green transition-colors duration-200 hover:bg-green hover:text-paper focus-visible:bg-green focus-visible:text-paper focus-visible:outline-offset-2 motion-reduce:transition-none';

  return (
    <article
      data-selected={selected ? 'true' : 'false'}
      className={cn(
        'group grid grid-cols-[2.25rem_1fr_auto] items-start gap-x-4 gap-y-3 py-5',
        COLS,
        item.plaque ? 'mt-2 border-t-2 border-ink pt-7' : 'border-t border-ink/15',
      )}
    >
      <span className={cn('pt-2 font-display text-[13px] tabular-nums transition-colors duration-200', selected ? 'text-green' : 'text-ink-soft')}>
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="min-w-0">
        <h3 className={cn('m-0 font-display leading-[1.1] text-ink transition-colors duration-200 group-hover:text-green group-focus-within:text-green', item.plaque ? 'text-3xl' : 'text-2xl')}>
          {typeset(item.title)}
        </h3>
        <p className="m-0 mt-2 max-w-[46ch] text-[15px] leading-relaxed text-ink-soft">{item.description}</p>
        <p className={cn('m-0 mt-3 font-display text-xl tabular-nums md:hidden', selected ? 'text-green' : 'text-ink')}>{price}</p>
      </div>
      <span className={cn('hidden pt-1 font-display text-xl tabular-nums transition-colors duration-200 md:block md:text-right', selected ? 'text-green' : 'text-ink')}>{price}</span>
      <div className="col-start-3 row-start-1 justify-self-end md:col-start-4 md:row-start-auto">
        {selected ? (
          <div role="group" aria-label={`${item.title}: ${t('quantity')}`} className="flex items-center border border-green">
            <button type="button" className={stepButton} aria-label={`${t('fewer')}: ${item.title}`} onClick={() => setQty(key, qty - 1)}><Minus aria-hidden="true" className="size-4" /></button>
            <span className="min-w-[2.5ch] text-center font-display text-lg tabular-nums text-green" aria-live="polite">{qty}</span>
            <button type="button" className={stepButton} aria-label={`${t('more')}: ${item.title}`} onClick={() => setQty(key, qty + 1)}><Plus aria-hidden="true" className="size-4" /></button>
          </div>
        ) : (
          <button
            type="button"
            aria-label={`${t('add')}: ${item.title}, ${price}`}
            onClick={() => add({ causeId: cause.id, causeTitle: cause.title, itemId: item.id, title: item.title, amountUSD: item.amountUSD, qty: 1 })}
            className="flex size-11 items-center justify-center border border-ink/25 text-ink transition-colors duration-200 hover:border-green hover:bg-green hover:text-paper focus-visible:border-green focus-visible:outline-offset-2 motion-reduce:transition-none"
          >
            <Plus aria-hidden="true" className="size-4" />
          </button>
        )}
      </div>
    </article>
  );
}

/**
 * The things a project needs, as an itemised schedule: numbered rows on
 * hairlines, each with the item, a line on what it does, the suggested gift
 * and a way to add one or several. One photograph of the project stands
 * beside the list, held in place by position: sticky while the list scrolls
 * past (the browser does this per frame, so it never snaps) and released
 * when the list ends. A whole unit, where
 * a project has one, closes the list set apart by a heavier rule.
 */
export function ItemLedger({ cause, rates, number }: { cause: Cause; rates: Record<string, number>; number: string }) {
  const t = useTranslations('donate');
  const locale = useLocale() as Locale;
  const lenis = useLenis();
  const { lines, currency } = useBasket();
  const photo = cause.itemsImage ?? cause.image;

  if (cause.items.length === 0) return null;

  const mine = lines.filter((l) => l.causeId === cause.id && l.itemId);
  const chosen = mine.map((l) => `${l.qty} × ${l.title}`).join(', ');
  const subtotal = lineTotal(mine, currency, rates);

  /** Down to the gift. Lenis is resynced first because a native scroll may have just moved the page. */
  const review = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById('your-gift');
    if (!target) return;
    e.preventDefault();
    if (lenis) {
      const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 96;
      lenis.scrollTo(window.scrollY, { immediate: true });
      lenis.scrollTo(target.getBoundingClientRect().top + window.scrollY - margin);
    } else {
      target.scrollIntoView({ block: 'start' });
    }
  };

  return (
    <Chapter tone="light" id="sponsor">
      <ChapterMark number={number} label={t('sponsorItem')} />
      <SplitHeading text={t('sponsorHeading')} className="display-2 mt-6 max-w-[20ch]" />
      <p className="body-lg mt-6 max-w-[58ch] text-ink-soft">{t('sponsorIntro')}</p>

      <div className="mt-12 lg:mt-16 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-8">
        <div className="lg:sticky lg:top-24 lg:col-span-5">
          {isPending(photo) ? (
            <PendingPhoto image={photo} text={cause.summary} size="panel" className="aspect-4/3 lg:aspect-4/5" />
          ) : (
            <figure className="m-0">
              <div className="relative aspect-4/3 overflow-hidden bg-ink/5 lg:aspect-4/5">
                <SmartImage image={photo} sizes="(max-width: 1024px) 100vw, 40vw" />
              </div>
              <figcaption className="mt-3 text-[11px] uppercase tracking-[0.2em] text-ink-soft">{photo.alt}</figcaption>
            </figure>
          )}
        </div>

        <div className="mt-10 lg:col-span-7 lg:col-start-6 lg:mt-0">
          <div className={cn('hidden pb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft md:grid', COLS)} aria-hidden="true">
            <span>{t('colNo')}</span>
            <span>{t('colItem')}</span>
            <span className="text-right">{t('suggested')}</span>
            <span className="w-11" />
          </div>
          <ol className="m-0 list-none p-0">
            {cause.items.map((item, i) => (
              <li key={item.id}>
                <Reveal start={START.detail}>
                  <Row cause={cause} item={item} index={i} rates={rates} />
                </Reveal>
              </li>
            ))}
          </ol>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-ink pt-5" data-ledger-summary>
            <p className="m-0 text-sm text-ink-soft" aria-live="polite">
              <span className="mr-3 text-[11px] font-medium uppercase tracking-[0.2em] text-ink">{t('inYourGift')}</span>
              {mine.length > 0 ? (
                <>
                  {chosen}
                  <span className="ml-3 font-display text-base tabular-nums text-ink">{money(subtotal, currency, locale)}</span>
                </>
              ) : (
                t('nothingYet')
              )}
            </p>
            <a href="#your-gift" onClick={review} className="link-draw inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-green">
              {t('reviewGift')}
              <ArrowDown aria-hidden="true" className="size-3.5" />
            </a>
          </div>
          <p className="m-0 mt-8 max-w-[60ch] text-sm leading-relaxed text-ink-soft">{t('amountsNote')}</p>
        </div>
      </div>
    </Chapter>
  );
}

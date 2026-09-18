'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CURRENCIES, type Currency } from '@/lib/donate';

/** One line of a gift: an item with a quantity, or a general gift to a cause. Amounts are held in US dollars. */
export interface GiftLine {
  key: string;
  causeId: string;
  causeTitle: string;
  itemId?: string;
  title: string;
  amountUSD: number;
  qty: number;
}

const LINES_KEY = 'lff-gift-v1';
const CURRENCY_KEY = 'lff-gift-currency';
const CHANGE = 'lff-gift-change';
/** The first currency the account offers is the default. */
const DEFAULT_CURRENCY: Currency = CURRENCIES[0];

export const lineKey = (causeId: string, itemId?: string) => `${causeId}:${itemId ?? 'general'}`;

function loadLines(): GiftLine[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(LINES_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((l) => l && typeof l.amountUSD === 'number' && l.qty > 0) : [];
  } catch {
    return [];
  }
}
function loadCurrency(): Currency {
  try {
    const c = localStorage.getItem(CURRENCY_KEY);
    return (CURRENCIES as readonly string[]).includes(c ?? '') ? (c as Currency) : DEFAULT_CURRENCY;
  } catch {
    return DEFAULT_CURRENCY;
  }
}
function persist(lines: GiftLine[], currency: Currency) {
  try {
    localStorage.setItem(LINES_KEY, JSON.stringify(lines));
    localStorage.setItem(CURRENCY_KEY, currency);
  } catch {
    /* private mode or full storage: the gift still lives in memory for this page */
  }
  window.dispatchEvent(new Event(CHANGE));
}

/**
 * The gift being assembled, shared by every component on the page and kept
 * across the donate pages in localStorage. Items add up by quantity; a general
 * gift to a cause is one line whose amount is replaced when set again.
 */
export function useBasket() {
  const [lines, setLines] = useState<GiftLine[]>([]);
  const [currency, setCurrencyState] = useState<Currency>(DEFAULT_CURRENCY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sync = () => { setLines(loadLines()); setCurrencyState(loadCurrency()); };
    sync();
    setHydrated(true);
    window.addEventListener(CHANGE, sync);
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener(CHANGE, sync); window.removeEventListener('storage', sync); };
  }, []);

  const write = useCallback((next: GiftLine[], nextCurrency?: Currency) => {
    const c = nextCurrency ?? loadCurrency();
    setLines(next);
    setCurrencyState(c);
    persist(next, c);
  }, []);

  const add = useCallback((line: Omit<GiftLine, 'key'>) => {
    const key = lineKey(line.causeId, line.itemId);
    const current = loadLines();
    const i = current.findIndex((l) => l.key === key);
    if (i >= 0) {
      current[i] = line.itemId
        ? { ...current[i], qty: current[i].qty + line.qty }
        : { ...current[i], amountUSD: line.amountUSD, qty: 1 };
    } else {
      current.push({ ...line, key });
    }
    write(current);
  }, [write]);

  const setQty = useCallback((key: string, qty: number) => {
    write(loadLines().map((l) => (l.key === key ? { ...l, qty } : l)).filter((l) => l.qty > 0));
  }, [write]);

  const remove = useCallback((key: string) => write(loadLines().filter((l) => l.key !== key)), [write]);
  const clear = useCallback(() => write([]), [write]);
  const setCurrency = useCallback((c: Currency) => write(loadLines(), c), [write]);

  const totalUSD = useMemo(() => lines.reduce((sum, l) => sum + l.amountUSD * l.qty, 0), [lines]);
  const qtyOf = useCallback((causeId: string, itemId?: string) => lines.find((l) => l.key === lineKey(causeId, itemId))?.qty ?? 0, [lines]);

  return { lines, currency, hydrated, add, setQty, remove, clear, setCurrency, totalUSD, qtyOf };
}

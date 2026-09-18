'use client';
import { useEffect, useId, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/config';
import { lineTotal, money, type Currency } from '@/lib/donate';
import { PAYSTACK_PUBLIC_KEY } from '@/lib/payments';
import type { GiftLine } from '@/components/donate/basket';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/*
 * Paystack Inline, version 2: Paystack's own popup, loaded from Paystack when
 * this checkout first appears. The transaction is created by the popup with
 * the foundation's public key; the donor pays by card inside it;
 * onSuccess fires when Paystack has taken the payment. There is no server
 * here, so the record of truth is the transaction in the foundation's
 * Paystack dashboard, which carries the metadata below.
 */
interface PaystackTransaction { reference: string; status?: string; message?: string; trans?: string; transaction?: string; trxref?: string }
interface PaystackOptions {
  key: string;
  email: string;
  amount: number;
  currency: string;
  reference: string;
  firstName?: string;
  lastName?: string;
  metadata?: Record<string, unknown>;
  onSuccess: (transaction: PaystackTransaction) => void;
  onCancel?: () => void;
  onError?: (error: unknown) => void;
}
type PaystackPopCtor = new () => { newTransaction: (options: PaystackOptions) => void };
declare global {
  interface Window { PaystackPop?: PaystackPopCtor }
}

const SCRIPT = 'https://js.paystack.co/v2/inline.js';
let scriptLoad: Promise<void> | null = null;

function loadPaystack(): Promise<PaystackPopCtor> {
  if (window.PaystackPop) return Promise.resolve(window.PaystackPop);
  scriptLoad ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SCRIPT;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => { scriptLoad = null; reject(new Error('Paystack script failed to load')); };
    document.head.appendChild(s);
  });
  return scriptLoad.then(() => {
    if (!window.PaystackPop) throw new Error('PaystackPop missing after load');
    return window.PaystackPop;
  });
}

/** A reference the donor can quote; Paystack keeps it on the transaction. */
const newReference = () => `LFF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

/** What Paystack records about the gift: shown on the transaction in the dashboard, and kept as data for a future backend. */
export function paystackMetadata(lines: GiftLine[], locale: string) {
  const causes = [...new Set(lines.map((l) => l.causeTitle))];
  return {
    custom_fields: [
      { display_name: 'Gift for', variable_name: 'gift_for', value: causes.join(', ').slice(0, 500) },
      { display_name: 'Items', variable_name: 'items', value: lines.map((l) => `${l.qty} × ${l.title} (${l.causeTitle})`).join('; ').slice(0, 1000) },
    ],
    lines: lines.map((l) => ({ cause: l.causeId, item: l.itemId ?? 'general', qty: l.qty, amountUSD: l.amountUSD })),
    locale,
  };
}

export interface PaystackResult { reference: string; email: string }

function Field({ id, label, className, ...props }: React.ComponentProps<'input'> & { id: string; label: string }) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="text-[11px] font-medium uppercase tracking-[0.2em] text-paper/70">{label}</Label>
      <div className="mt-2 border-b border-paper/30 transition-colors focus-within:border-paper">
        <Input
          id={id}
          className="h-11 rounded-none border-0 bg-transparent px-0 text-base text-paper shadow-none placeholder:text-paper/40 focus-visible:border-0 focus-visible:ring-0 md:text-base"
          {...props}
        />
      </div>
    </div>
  );
}

export function PaystackCheckout({ lines, currency, rates, onSuccess }: { lines: GiftLine[]; currency: Currency; rates: Record<string, number>; onSuccess: (result: PaystackResult) => void }) {
  const t = useTranslations('donate');
  const locale = useLocale() as Locale;
  const id = useId();
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'starting' | 'cancelled' | 'error'>('idle');
  const total = lineTotal(lines, currency, rates);

  // Warm the popup script while the donor types; a failure here is retried on submit.
  useEffect(() => { loadPaystack().catch(() => undefined); }, []);

  const pay = (e: React.FormEvent) => {
    e.preventDefault();
    if (total <= 0) return;
    setState('starting');
    const donorEmail = email.trim();
    loadPaystack()
      .then((PaystackPop) => {
        new PaystackPop().newTransaction({
          key: PAYSTACK_PUBLIC_KEY,
          email: donorEmail,
          firstName: first.trim(),
          lastName: last.trim(),
          amount: Math.round(total * 100), // Paystack takes the amount in the currency's subunit
          currency,
          reference: newReference(),
          metadata: paystackMetadata(lines, locale),
          onSuccess: (tx) => onSuccess({ reference: tx.reference, email: donorEmail }),
          onCancel: () => setState('cancelled'),
          onError: () => setState('error'),
        });
        setState('idle');
      })
      .catch(() => setState('error'));
  };

  const status = state === 'cancelled' ? t('paystackCancelled') : state === 'error' ? t('paystackError') : t('paystackNote');

  return (
    <form onSubmit={pay} aria-describedby={`${id}-status`} data-method="paystack">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={`${id}-first`} label={t('firstName')} value={first} onChange={(e) => setFirst(e.target.value)} autoComplete="given-name" required />
        <Field id={`${id}-last`} label={t('lastName')} value={last} onChange={(e) => setLast(e.target.value)} autoComplete="family-name" required />
        <Field id={`${id}-email`} label={t('email')} type="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required className="sm:col-span-2" />
      </div>
      <Button type="submit" size="lg" disabled={state === 'starting' || total <= 0} className="mt-8 w-full text-[13px] sm:w-auto">
        {t('payWithPaystack', { amount: money(total, currency, locale) })}
      </Button>
      <p id={`${id}-status`} aria-live="polite" className={cn('m-0 mt-4 text-sm leading-relaxed', state === 'idle' || state === 'starting' ? 'text-paper/60' : 'text-paper')}>
        {status}
      </p>
    </form>
  );
}

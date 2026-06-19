'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import gsap from 'gsap'
import { v4 } from 'uuid'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/Eyebrow'

declare const Checkout: {
  configure: (config: {
    session?: { id: string }
    merchant?: string
    order?: Record<string, unknown>
    transaction?: Record<string, unknown>
    interaction?: Record<string, unknown>
  }) => void
  showLightbox?: () => void
}

const CURRENCIES = ['USD', 'KES', 'EUR', 'GBP']

const AMOUNTS: Record<string, string[]> = {
  USD: ['10', '25', '50', '100', '250', '500'],
  KES: ['500', '1000', '2500', '5000', '10000', '25000'],
  EUR: ['10', '25', '50', '100', '250', '500'],
  GBP: ['10', '25', '50', '100', '250', '500'],
}

const PAYMENT_METHODS = [
  { id: 'card',   label: 'Card' },
  { id: 'paypal', label: 'PayPal' },
  { id: 'mpesa',  label: 'M-Pesa' },
]

function PayPalSection({ currency, amount, onSuccess, unavailableMsg }: { currency: string; amount: string; onSuccess: () => void; unavailableMsg: string }) {
  const [{ isRejected }] = usePayPalScriptReducer()
  if (isRejected) {
    return <p className="text-sm text-ink-soft">{unavailableMsg}</p>
  }
  return (
    <PayPalButtons
      style={{ layout: 'vertical', color: 'gold', shape: 'rect' }}
      createOrder={(_data, actions) =>
        actions.order.create({
          intent: 'CAPTURE',
          purchase_units: [{ amount: { currency_code: currency, value: amount } }],
        })
      }
      onApprove={(_data, actions) =>
        actions.order!.capture().then(onSuccess)
      }
    />
  )
}

export default function DonateClient() {
  const t = useTranslations('donate')
  const [page, setPage] = useState(1)
  const [amount, setAmount] = useState('25')
  const [currency, setCurrency] = useState('USD')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [phone, setPhone] = useState('')
  const [sessionID, setSessionID] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const thankRef = useRef<HTMLDivElement>(null)

  const fmt = new Intl.NumberFormat('en', { style: 'currency', currency })
  const parsedAmount = parseFloat(amount)
  const validAmount = !isNaN(parsedAmount) && parsedAmount > 0

  useEffect(() => {
    if (sent && thankRef.current) {
      gsap.to(thankRef.current, { duration: 0.3, opacity: 1, ease: 'power3.inOut' })
      setTimeout(() => setSent(false), 5000)
    }
  }, [sent])

  useEffect(() => {
    fetch('https://payutil.tk/mastercard/authenticate', { method: 'POST' })
      .then(r => r.json())
      .then(data => setSessionID(data?.session?.id ?? ''))
      .catch(() => {})

    if (typeof Checkout === 'undefined') return
    Checkout.configure({
      session: { id: sessionID },
      merchant: 'LUIGI',
      order: {
        amount,
        currency,
        description: 'Donation to The Luigi Footprints Foundation',
        id: v4(),
        reference: v4(),
      },
      transaction: { reference: v4() },
      interaction: {
        operation: 'PURCHASE',
        merchant: { name: 'Luigi Footprints Foundation:' },
      },
    })
  }, [amount, currency, sessionID])

  const handleMpesa = async () => {
    setLoading(true)
    await fetch('https://payutil.tk/mpesa/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone_number: phone,
        amount: Math.ceil(parsedAmount),
        reference_code: 'Donation',
        description: 'A donation to The Luigi Footprints Foundation',
      }),
    })
      .then(r => r.json())
      .then(() => setLoading(false))
  }

  const headline = t('headline').split('\n')

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2">

      {/* Left: editorial panel */}
      <div className="bg-ink flex flex-col justify-end px-8 md:px-16 pt-40 pb-16
                      lg:sticky lg:top-16 lg:h-[calc(100svh-4rem)] lg:pt-20">
        <Eyebrow className="text-paper/70! mb-6">{t('supportMission')}</Eyebrow>
        <h1 className="display-1 text-paper mb-8">
          {headline.map((line, i) => (
            <span key={i}>{line}{i < headline.length - 1 && <br />}</span>
          ))}
        </h1>
        <div className="w-8 h-px bg-green mb-8" />
        <p className="text-paper/70 text-sm leading-relaxed max-w-sm">
          {t('bodyText')}
        </p>
      </div>

      {/* Right: form panel */}
      <div className="flex flex-col justify-center px-8 md:px-16 py-16 lg:py-24 lg:min-h-[calc(100svh-4rem)]">
        <div className="max-w-md w-full mx-auto">

        {/* Step indicator */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex items-center gap-2">
            <span className={`eyebrow transition-colors duration-300 ${page === 1 ? 'text-green' : 'text-ink/30'}`}>01</span>
            <span className={`text-[11px] uppercase tracking-widest transition-colors duration-300 ${page === 1 ? 'text-ink' : 'text-ink/30'}`}>{t('step1')}</span>
          </div>
          <div className="flex-1 h-px bg-line" />
          <div className="flex items-center gap-2">
            <span className={`eyebrow transition-colors duration-300 ${page === 2 ? 'text-green' : 'text-ink/30'}`}>02</span>
            <span className={`text-[11px] uppercase tracking-widest transition-colors duration-300 ${page === 2 ? 'text-ink' : 'text-ink/30'}`}>{t('step2')}</span>
          </div>
        </div>

        {/* ── Step 1: Amount ── */}
        {page === 1 && (
          <div className="space-y-10">

            {/* Currency tabs */}
            <div className="space-y-3">
              <p className="eyebrow">{t('currencyLabel')}</p>
              <div className="flex gap-2 flex-wrap">
                {CURRENCIES.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => { setCurrency(c); setAmount(AMOUNTS[c]?.[1] ?? '25') }}
                    className={[
                      'text-[11px] uppercase tracking-[0.12em] px-5 py-2.5 border transition-all duration-200',
                      currency === c
                        ? 'bg-green text-paper border-green'
                        : 'border-line text-ink-soft hover:border-green hover:text-ink',
                    ].join(' ')}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount grid */}
            <div className="space-y-3">
              <p className="eyebrow">{t('selectAmount')}</p>
              <div className="grid grid-cols-3 gap-2">
                {(AMOUNTS[currency] ?? AMOUNTS.USD).map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setAmount(v)}
                    className={[
                      'text-[13px] py-4 border transition-all duration-200 text-center',
                      amount === v
                        ? 'bg-green text-paper border-green'
                        : 'border-line text-ink-soft hover:border-green hover:text-ink',
                    ].join(' ')}
                  >
                    {new Intl.NumberFormat('en', { style: 'currency', currency }).format(parseFloat(v))}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom amount */}
            <div className="space-y-2">
              <Label htmlFor="custom-amount" className="eyebrow">
                {t('customAmount')}
              </Label>
              <div className="relative flex items-center">
                <span className="text-[13px] text-ink-soft pr-3 select-none">{currency}</span>
                <Input
                  id="custom-amount"
                  type="number"
                  min="1"
                  placeholder="0.00"
                  onChange={e => setAmount(e.target.value)}
                  className="text-[15px] bg-transparent border-0 border-b border-line rounded-none placeholder:text-ink/30 focus-visible:ring-0 focus-visible:border-green pb-2 h-auto"
                />
              </div>
            </div>

            <Button
              onClick={() => setPage(2)}
              disabled={!validAmount}
              className="w-full rounded-none"
            >
              {t('continueBtn')}{validAmount ? ` — ${fmt.format(parsedAmount)}` : ''} →
            </Button>
          </div>
        )}

        {/* ── Step 2: Payment ── */}
        {page === 2 && (
          <div className="space-y-10">

            {/* Donation summary */}
            <div className="border-l-2 border-green pl-5">
              <p className="eyebrow mb-1">{t('donating')}</p>
              <p className="display-2 text-ink">
                {fmt.format(parsedAmount)}
              </p>
            </div>

            {/* Payment method tabs */}
            <div className="space-y-3">
              <p className="eyebrow">{t('paymentMethod')}</p>
              <div className="flex gap-2">
                {PAYMENT_METHODS.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={[
                      'text-[11px] uppercase tracking-[0.12em] px-5 py-3 border transition-all duration-200',
                      paymentMethod === m.id
                        ? 'bg-green text-paper border-green'
                        : 'border-line text-ink-soft hover:border-green hover:text-ink',
                    ].join(' ')}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Card */}
            {paymentMethod === 'card' && (
              <div className="space-y-5">
                <p className="text-sm text-ink-soft leading-relaxed">
                  {t('cardDescription', { amount: fmt.format(parsedAmount) })}
                </p>
                <Button
                  onClick={() => typeof Checkout !== 'undefined' && Checkout.showLightbox?.()}
                  className="w-full rounded-none"
                >
                  {t('payWithCard')}
                </Button>
              </div>
            )}

            {/* PayPal */}
            {paymentMethod === 'paypal' && (
              <PayPalScriptProvider
                options={{
                  clientId: 'AfcPQsuVQb3JFz4o8t3g3JolRBipWWIpAjHM5-6dLqYbmtfwz34Ey-aOZyByb_mFkjkVGJCJMjJfGK4EqOCy5n5BkTOZ8X5F',
                  currency,
                }}
              >
                <PayPalSection currency={currency} amount={amount} onSuccess={() => setSent(true)} unavailableMsg={t('paypalUnavailable')} />
              </PayPalScriptProvider>
            )}

            {/* M-Pesa */}
            {paymentMethod === 'mpesa' && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="eyebrow">
                    {t('phoneLabel')}
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={t('phonePlaceholder')}
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="text-[15px] bg-transparent border-0 border-b border-line rounded-none placeholder:text-ink/30 focus-visible:ring-0 focus-visible:border-green pb-2 h-auto"
                  />
                </div>
                <Button
                  onClick={handleMpesa}
                  disabled={loading || !phone}
                  className="w-full rounded-none"
                >
                  {loading ? t('processing') : t('payMpesa')}
                </Button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setPage(1)}
              className="text-[11px] uppercase tracking-[0.12em] text-ink-soft hover:text-ink transition-colors duration-200"
            >
              {t('changeAmount')}
            </button>
          </div>
        )}

        {/* Thank you */}
        {sent && (
          <div ref={thankRef} className="opacity-0 mt-10 p-8 border border-green/40 bg-green/5">
            <p className="display-2 text-ink mb-3">{t('thankYouTitle')}</p>
            <p className="text-sm text-ink-soft leading-relaxed">
              {t('thankYouBody')}
            </p>
          </div>
        )}

        </div>{/* /max-w-md */}
      </div>
    </section>
  )
}

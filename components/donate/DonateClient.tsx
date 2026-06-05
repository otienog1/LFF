'use client'

import Layout from '@/components/layout/Layout'
import { useState, useEffect, useRef } from 'react'
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import gsap from 'gsap'
import { v4 } from 'uuid'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

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
  { id: 'card', label: 'Card' },
  { id: 'paypal', label: 'PayPal' },
  { id: 'mpesa', label: 'M-Pesa' },
]

function PayPalSection({ currency, amount, onSuccess }: { currency: string; amount: string; onSuccess: () => void }) {
  const [{ isRejected }] = usePayPalScriptReducer()
  if (isRejected) {
    return (
      <p className="font-body font-light text-[14px] text-muted">
        PayPal is temporarily unavailable. Please use card or M-Pesa.
      </p>
    )
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

  return (
    <Layout>
      <section className="bg-base min-h-svh grid grid-cols-1 lg:grid-cols-2">

        {/* Left: editorial panel */}
        <div className="bg-surface flex flex-col justify-end px-10 pt-40 pb-16 lg:sticky lg:top-0 lg:h-svh">
          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-gold mb-6">Support our mission</p>
          <h1 className="font-display italic text-[clamp(48px,5vw,80px)] text-cream leading-[1.0] mb-8">
            Every gift<br />leaves a<br />footprint.
          </h1>
          <div className="w-8 h-px bg-gold mb-8" />
          <p className="font-body font-light text-[15px] text-muted leading-[1.8] max-w-sm">
            Your contribution directly funds wildlife conservation, community education, and environmental stewardship across East Africa.
          </p>
        </div>

        {/* Right: form panel */}
        <div className="flex flex-col justify-center px-10 pt-16 lg:pt-0 pb-16 min-h-svh">

          {/* Step indicator */}
          <div className="flex items-center gap-4 mb-12">
            <div className="flex items-center gap-2">
              <span className={`font-body text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 ${page === 1 ? 'text-gold' : 'text-muted/40'}`}>01</span>
              <span className={`font-body text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 ${page === 1 ? 'text-cream' : 'text-muted/40'}`}>Amount</span>
            </div>
            <div className="flex-1 h-px bg-border" />
            <div className="flex items-center gap-2">
              <span className={`font-body text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 ${page === 2 ? 'text-gold' : 'text-muted/40'}`}>02</span>
              <span className={`font-body text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 ${page === 2 ? 'text-cream' : 'text-muted/40'}`}>Payment</span>
            </div>
          </div>

          {/* ── Step 1: Amount ── */}
          {page === 1 && (
            <div className="space-y-10">

              {/* Currency tabs */}
              <div className="space-y-3">
                <p className="font-body text-[10px] uppercase tracking-[0.2em] text-muted">Currency</p>
                <div className="flex gap-2 flex-wrap">
                  {CURRENCIES.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => { setCurrency(c); setAmount(AMOUNTS[c]?.[1] ?? '25') }}
                      className={[
                        'font-body text-[11px] uppercase tracking-[0.12em] px-5 py-2.5 border transition-all duration-200',
                        currency === c
                          ? 'bg-gold text-base border-gold'
                          : 'border-border text-muted hover:border-gold hover:text-cream',
                      ].join(' ')}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount grid */}
              <div className="space-y-3">
                <p className="font-body text-[10px] uppercase tracking-[0.2em] text-muted">Select amount</p>
                <div className="grid grid-cols-3 gap-2">
                  {(AMOUNTS[currency] ?? AMOUNTS.USD).map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setAmount(v)}
                      className={[
                        'font-body text-[13px] py-4 border transition-all duration-200 text-center',
                        amount === v
                          ? 'bg-gold text-base border-gold'
                          : 'border-border text-muted hover:border-gold hover:text-cream',
                      ].join(' ')}
                    >
                      {new Intl.NumberFormat('en', { style: 'currency', currency }).format(parseFloat(v))}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom amount */}
              <div className="space-y-2">
                <Label htmlFor="custom-amount" className="font-body text-[10px] uppercase tracking-[0.2em] text-muted">
                  Or enter custom amount
                </Label>
                <div className="relative flex items-center">
                  <span className="font-body text-[13px] text-muted pr-3 select-none">{currency}</span>
                  <Input
                    id="custom-amount"
                    type="number"
                    min="1"
                    placeholder="0.00"
                    onChange={e => setAmount(e.target.value)}
                    className="font-body text-[15px] bg-transparent border-0 border-b border-border rounded-none text-cream placeholder:text-muted/30 focus-visible:ring-0 focus-visible:border-gold pb-2 h-auto"
                  />
                </div>
              </div>

              <Button
                onClick={() => setPage(2)}
                disabled={!validAmount}
                className="font-body text-[11px]! uppercase tracking-[0.15em] bg-gold text-base hover:bg-gold-light border-0 rounded-none px-8 py-4 h-auto w-full disabled:opacity-40"
              >
                Continue {validAmount ? `— ${fmt.format(parsedAmount)}` : ''} →
              </Button>
            </div>
          )}

          {/* ── Step 2: Payment ── */}
          {page === 2 && (
            <div className="space-y-10">

              {/* Donation summary */}
              <div className="border-l-2 border-gold pl-5">
                <p className="font-body text-[10px] uppercase tracking-[0.2em] text-muted mb-1">Donating</p>
                <p className="font-display italic text-[36px] text-cream leading-tight">
                  {fmt.format(parsedAmount)}
                </p>
              </div>

              {/* Payment method tabs */}
              <div className="space-y-3">
                <p className="font-body text-[10px] uppercase tracking-[0.2em] text-muted">Payment method</p>
                <div className="flex gap-2">
                  {PAYMENT_METHODS.map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={[
                        'font-body text-[11px] uppercase tracking-[0.12em] px-5 py-3 border transition-all duration-200',
                        paymentMethod === m.id
                          ? 'bg-gold text-base border-gold'
                          : 'border-border text-muted hover:border-gold hover:text-cream',
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
                  <p className="font-body font-light text-[14px] text-muted leading-relaxed">
                    You will be charged{' '}
                    <span className="text-cream">{fmt.format(parsedAmount)}</span>
                    {' '}via secure Mastercard checkout.
                  </p>
                  <Button
                    onClick={() => typeof Checkout !== 'undefined' && Checkout.showLightbox?.()}
                    className="font-body text-[11px]! uppercase tracking-[0.15em] bg-gold text-base hover:bg-gold-light border-0 rounded-none px-8 py-4 h-auto w-full"
                  >
                    Pay with Card →
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
                  <PayPalSection currency={currency} amount={amount} onSuccess={() => setSent(true)} />
                </PayPalScriptProvider>
              )}

              {/* M-Pesa */}
              {paymentMethod === 'mpesa' && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-body text-[10px] uppercase tracking-[0.2em] text-muted">
                      Phone number (with country code)
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+254 700 000 000"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="font-body text-[15px] bg-transparent border-0 border-b border-border rounded-none text-cream placeholder:text-muted/30 focus-visible:ring-0 focus-visible:border-gold pb-2 h-auto"
                    />
                  </div>
                  <Button
                    onClick={handleMpesa}
                    disabled={loading || !phone}
                    className="font-body text-[11px]! uppercase tracking-[0.15em] bg-gold text-base hover:bg-gold-light border-0 rounded-none px-8 py-4 h-auto w-full disabled:opacity-40"
                  >
                    {loading ? 'Processing…' : 'Pay via M-Pesa →'}
                  </Button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setPage(1)}
                className="font-body text-[11px] uppercase tracking-[0.12em] text-muted hover:text-cream transition-colors duration-200"
              >
                ← Change amount
              </button>
            </div>
          )}

          {/* Thank you */}
          {sent && (
            <div ref={thankRef} className="opacity-0 mt-10 p-8 border border-gold/40 bg-gold/5">
              <p className="font-display italic text-[28px] text-cream mb-3">Thank you.</p>
              <p className="font-body font-light text-[14px] text-muted leading-relaxed">
                Your donation to the Luigi Footprints Foundation is deeply appreciated.
              </p>
            </div>
          )}

        </div>
      </section>
    </Layout>
  )
}

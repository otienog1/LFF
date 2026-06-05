'use client'

import Layout from '@/components/layout/Layout'
import { useState, useEffect, useRef } from 'react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import gsap from 'gsap'
import { v4 } from 'uuid'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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

const AMOUNTS_USD = { row1: ['10', '25', '50'], row2: ['100', '250', '500'] }
const AMOUNTS_KES = { row1: ['500', '1000', '2500'], row2: ['5000', '10000', '25000'] }

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="w-full h-px bg-border mb-12">
      <div
        className="h-full bg-gold transition-all duration-500"
        style={{ width: `${(step / 2) * 100}%` }}
      />
    </div>
  )
}

function AmountPill({
  value,
  selected,
  currency,
  onClick,
}: {
  value: string
  selected: boolean
  currency: string
  onClick: () => void
}) {
  const fmt = new Intl.NumberFormat('en', { style: 'currency', currency })
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'font-body text-[13px] px-4 py-2 border transition-all duration-200',
        selected ? 'bg-gold text-base border-gold' : 'border-border text-muted hover:border-gold hover:text-cream',
      ].join(' ')}
    >
      {fmt.format(parseFloat(value))}
    </button>
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

  const amounts = currency === 'KES' ? AMOUNTS_KES : AMOUNTS_USD

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
        amount: Math.ceil(parseFloat(amount)),
        reference_code: 'Donation',
        description: 'A donation to The Luigi Footprints Foundation',
      }),
    })
      .then(r => r.json())
      .then(() => setLoading(false))
  }

  return (
    <Layout>
      <section className="bg-base min-h-svh pt-40 pb-20 px-8">
        <div className="max-w-[640px] mx-auto">
          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-gold mb-4">Support our work</p>
          <h1 className="font-display italic text-[clamp(36px,4vw,56px)] text-cream leading-[1.05] mb-12">
            Make a Donation
          </h1>

          <ProgressBar step={page - 1} />

          {/* Step 1: Amount */}
          {page === 1 && (
            <div className="space-y-8">
              <div className="space-y-2">
                <Label className="font-body text-[11px] uppercase tracking-[0.12em] text-muted">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="bg-surface border-border text-cream w-40 focus:ring-gold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-surface border-border">
                    <SelectItem value="USD" className="text-cream focus:bg-gold/20">USD</SelectItem>
                    <SelectItem value="KES" className="text-cream focus:bg-gold/20">KES</SelectItem>
                    <SelectItem value="EUR" className="text-cream focus:bg-gold/20">EUR</SelectItem>
                    <SelectItem value="GBP" className="text-cream focus:bg-gold/20">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-body text-[11px] uppercase tracking-[0.12em] text-muted">Amount</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {amounts.row1.map(v => (
                    <AmountPill key={v} value={v} selected={amount === v} currency={currency} onClick={() => setAmount(v)} />
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {amounts.row2.map(v => (
                    <AmountPill key={v} value={v} selected={amount === v} currency={currency} onClick={() => setAmount(v)} />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-amount" className="font-body text-[11px] uppercase tracking-[0.12em] text-muted">
                  Custom amount
                </Label>
                <Input
                  id="custom-amount"
                  type="number"
                  min="1"
                  placeholder="Enter amount"
                  onChange={e => setAmount(e.target.value)}
                  className="bg-surface border-border text-cream placeholder:text-muted/40 focus-visible:ring-gold w-48"
                />
              </div>

              <Button
                onClick={() => setPage(2)}
                disabled={!amount || parseFloat(amount) <= 0}
                className="font-body text-[11px] uppercase tracking-[0.15em] bg-gold text-base hover:bg-gold-light border-0 rounded-none px-8 py-3 h-auto disabled:opacity-40"
              >
                Continue →
              </Button>
            </div>
          )}

          {/* Step 2: Payment */}
          {page === 2 && (
            <div className="space-y-8">
              <div className="flex gap-2">
                {[
                  { id: 'card', label: 'Card' },
                  { id: 'paypal', label: 'PayPal' },
                  { id: 'mpesa', label: 'M-Pesa' },
                ].map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={[
                      'font-body text-[11px] uppercase tracking-[0.12em] px-4 py-2 border transition-all duration-200',
                      paymentMethod === m.id ? 'bg-gold text-base border-gold' : 'border-border text-muted hover:border-gold',
                    ].join(' ')}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <p className="font-body font-light text-[14px] text-muted">
                    You will be charged{' '}
                    <span className="text-cream">
                      {new Intl.NumberFormat('en', { style: 'currency', currency }).format(parseFloat(amount))}
                    </span>
                    {' '}via secure Mastercard checkout.
                  </p>
                  <Button
                    onClick={() => Checkout.showLightbox?.()}
                    className="font-body text-[11px] uppercase tracking-[0.15em] bg-gold text-base hover:bg-gold-light border-0 rounded-none px-8 py-3 h-auto"
                  >
                    Pay with Card →
                  </Button>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div>
                  <PayPalScriptProvider
                    options={{
                      clientId: 'AfcPQsuVQb3JFz4o8t3g3JolRBipWWIpAjHM5-6dLqYbmtfwz34Ey-aOZyByb_mFkjkVGJCJMjJfGK4EqOCy5n5BkTOZ8X5F',
                      currency,
                    }}
                  >
                    <PayPalButtons
                      style={{ layout: 'vertical', color: 'gold', shape: 'rect' }}
                      createOrder={(_data, actions) =>
                        actions.order.create({
                          intent: 'CAPTURE',
                          purchase_units: [{
                            amount: { currency_code: currency, value: amount },
                          }],
                        })
                      }
                      onApprove={(_data, actions) =>
                        actions.order!.capture().then(() => setSent(true))
                      }
                    />
                  </PayPalScriptProvider>
                </div>
              )}

              {paymentMethod === 'mpesa' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-body text-[11px] uppercase tracking-[0.12em] text-muted">
                      Phone number (with country code)
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+254..."
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="bg-surface border-border text-cream placeholder:text-muted/40 focus-visible:ring-gold"
                    />
                  </div>
                  <Button
                    onClick={handleMpesa}
                    disabled={loading || !phone}
                    className="font-body text-[11px] uppercase tracking-[0.15em] bg-gold text-base hover:bg-gold-light border-0 rounded-none px-8 py-3 h-auto disabled:opacity-40"
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
                ← Back
              </button>
            </div>
          )}

          {sent && (
            <div ref={thankRef} className="opacity-0 mt-8 p-6 border border-gold bg-gold/10">
              <p className="font-display italic text-[24px] text-cream mb-2">Thank you.</p>
              <p className="font-body font-light text-[14px] text-muted">
                Your donation to the Luigi Footprints Foundation is deeply appreciated.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}

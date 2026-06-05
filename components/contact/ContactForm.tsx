'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const fieldClass =
  'font-body text-[15px] bg-transparent border-0 border-b border-border rounded-none text-cream placeholder:text-muted/30 focus-visible:ring-0 focus-visible:border-gold pb-2 h-auto'

const labelClass = 'font-body text-[10px] uppercase tracking-[0.2em] text-muted'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const body = encodeURIComponent(`Name: ${form.name}\n\n${form.message}`)
    window.location.href = `mailto:info@theluigifootprints.org?subject=${encodeURIComponent(form.subject)}&body=${body}`
    setSent(true)
  }

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="space-y-2">
        <Label htmlFor="name" className={labelClass}>Name</Label>
        <Input
          id="name"
          value={form.name}
          onChange={set('name')}
          required
          placeholder="Your full name"
          className={fieldClass}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className={labelClass}>Email</Label>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={set('email')}
          required
          placeholder="your@email.com"
          className={fieldClass}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" className={labelClass}>Subject</Label>
        <Input
          id="subject"
          value={form.subject}
          onChange={set('subject')}
          required
          placeholder="How can we help?"
          className={fieldClass}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className={labelClass}>Message</Label>
        <Textarea
          id="message"
          value={form.message}
          onChange={set('message')}
          required
          rows={4}
          placeholder="Tell us more…"
          className={`${fieldClass} resize-none`}
        />
      </div>

      {sent ? (
        <p className="font-display italic text-[22px] text-cream">Message sent. Thank you.</p>
      ) : (
        <Button
          type="submit"
          className="font-body text-[11px]! uppercase tracking-[0.15em] bg-gold text-base hover:bg-gold-light border-0 rounded-none px-8 py-4 h-auto w-full"
        >
          Send Message →
        </Button>
      )}
    </form>
  )
}

'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const body = encodeURIComponent(`Name: ${form.name}\n\n${form.message}`)
    window.location.href = `mailto:info@theluigifootprints.org?subject=${encodeURIComponent(form.subject)}&body=${body}`
  }

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="font-body text-[11px] uppercase tracking-[0.12em] text-muted">Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={set('name')}
            required
            className="bg-surface border-border text-cream placeholder:text-muted/40 focus-visible:ring-gold"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="font-body text-[11px] uppercase tracking-[0.12em] text-muted">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={set('email')}
            required
            className="bg-surface border-border text-cream placeholder:text-muted/40 focus-visible:ring-gold"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject" className="font-body text-[11px] uppercase tracking-[0.12em] text-muted">Subject</Label>
        <Input
          id="subject"
          value={form.subject}
          onChange={set('subject')}
          required
          className="bg-surface border-border text-cream placeholder:text-muted/40 focus-visible:ring-gold"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="font-body text-[11px] uppercase tracking-[0.12em] text-muted">Message</Label>
        <Textarea
          id="message"
          value={form.message}
          onChange={set('message')}
          required
          rows={6}
          className="bg-surface border-border text-cream placeholder:text-muted/40 focus-visible:ring-gold resize-none"
        />
      </div>
      <Button
        type="submit"
        className="font-body text-[11px] uppercase tracking-[0.15em] bg-gold text-base hover:bg-gold-light border-0 rounded-none px-8 py-3 h-auto"
      >
        Send Message →
      </Button>
    </form>
  )
}

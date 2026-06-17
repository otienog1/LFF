'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const fieldClass =
  'text-[15px] bg-transparent border-0 border-b border-current/30 rounded-none placeholder:text-current/40 focus-visible:ring-0 focus-visible:border-green pb-2 h-auto'

const labelClass = 'text-[10px] uppercase tracking-[0.2em] opacity-60'

export default function ContactForm() {
  const t = useTranslations('contact')
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
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name" className={labelClass}>{t('formName')}</Label>
        <Input id="name" value={form.name} onChange={set('name')} required placeholder={t('formNamePlaceholder')} className={fieldClass} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className={labelClass}>{t('formEmail')}</Label>
        <Input id="email" type="email" value={form.email} onChange={set('email')} required placeholder="your@email.com" className={fieldClass} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" className={labelClass}>{t('formSubject')}</Label>
        <Input id="subject" value={form.subject} onChange={set('subject')} required placeholder={t('formSubjectPlaceholder')} className={fieldClass} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className={labelClass}>{t('formMessage')}</Label>
        <Textarea id="message" value={form.message} onChange={set('message')} required rows={4} placeholder={t('formMessagePlaceholder')} className={`${fieldClass} resize-none`} />
      </div>

      {sent ? (
        <p className="display-3 text-current">{t('formSent')}</p>
      ) : (
        <Button type="submit" className="w-full">{t('formSubmit')}</Button>
      )}
    </form>
  )
}

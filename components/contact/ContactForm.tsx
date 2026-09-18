'use client';
import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { CONTACT_EMAIL } from '@/lib/site';
import { CONTACT_ENDPOINT, CONTACT_REASONS, type ContactReason } from '@/lib/contact';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const FIELD = 'h-12 rounded-none border-0 bg-transparent px-0 text-base text-ink shadow-none placeholder:text-ink/40 focus-visible:border-0 focus-visible:ring-0 md:text-base';
const LABEL = 'text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft';
const LINE = 'mt-2 border-b border-ink/30 transition-colors focus-within:border-green';

type Status = 'idle' | 'sending' | 'sent' | 'error';

/**
 * The letter: who is writing, how to reply, why, and the message. It posts
 * to the contact function, which sends the mail through Resend, and turns
 * into a thank-you naming the writer. If sending fails the message stays in
 * the fields, with the foundation's address to write to instead. A hidden
 * field catches robots.
 */
export default function ContactForm() {
  const t = useTranslations('contact');
  const locale = useLocale();
  const id = useId();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState<ContactReason>('general');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [status, setStatus] = useState<Status>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), reason, message: message.trim(), website, locale }),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const reset = () => { setName(''); setEmail(''); setReason('general'); setMessage(''); setStatus('idle'); };

  if (status === 'sent') {
    return (
      <div role="status" data-sent>
        <p className="m-0 font-display text-3xl leading-tight text-ink">{t('sentTitle', { name: name.trim() })}</p>
        <p className="m-0 mt-4 max-w-[44ch] text-[15px] leading-relaxed text-ink-soft">{t('sentBody', { email: CONTACT_EMAIL })}</p>
        <Button variant="ghost" className="mt-8" onClick={reset}>{t('again')}</Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} aria-describedby={`${id}-status`}>
      <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${id}-name`} className={LABEL}>{t('formName')}</Label>
          <div className={LINE}>
            <Input id={`${id}-name`} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required minLength={2} maxLength={120} className={FIELD} />
          </div>
        </div>
        <div>
          <Label htmlFor={`${id}-email`} className={LABEL}>{t('formEmail')}</Label>
          <div className={LINE}>
            <Input id={`${id}-email`} type="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required maxLength={200} className={FIELD} />
          </div>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor={`${id}-reason`} className={LABEL}>{t('reason')}</Label>
          <div className={cn(LINE, 'relative')}>
            <select
              id={`${id}-reason`}
              value={reason}
              onChange={(e) => setReason(e.target.value as ContactReason)}
              className="h-12 w-full appearance-none bg-transparent pr-8 text-base text-ink outline-none"
            >
              {CONTACT_REASONS.map((r) => <option key={r} value={r}>{t(`reason_${r}`)}</option>)}
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-0 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
          </div>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor={`${id}-message`} className={LABEL}>{t('formMessage')}</Label>
          <div className={LINE}>
            <Textarea id={`${id}-message`} value={message} onChange={(e) => setMessage(e.target.value)} required minLength={10} maxLength={5000} rows={5} className={cn(FIELD, 'h-auto min-h-36 resize-y py-3 leading-relaxed')} />
          </div>
        </div>
        {/* Robots fill every field; people never see this one. */}
        <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor={`${id}-website`}>Website</label>
          <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
        <Button type="submit" size="lg" disabled={status === 'sending'} className="text-[13px]">
          {status === 'sending' ? t('sending') : t('send')}
        </Button>
        <p id={`${id}-status`} aria-live="polite" className={cn('m-0 max-w-[44ch] text-sm leading-relaxed', status === 'error' ? 'text-ink' : 'text-ink-soft')}>
          {status === 'error' ? (
            <>
              {t('errorBody')}{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="link-draw" data-fallback>{CONTACT_EMAIL}</a>.
            </>
          ) : (
            t('privacy')
          )}
        </p>
      </div>
    </form>
  );
}

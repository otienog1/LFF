'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/config';
import { CONTACT_EMAIL, localePath } from '@/lib/site';
import { Button } from '@/components/ui/button';
import { ErrorChapter } from '@/components/errors/ErrorChapter';

const LINK = 'link-draw inline-flex text-[11px] font-medium uppercase tracking-[0.2em] text-paper/80 hover:text-paper';

/**
 * What a visitor sees when a page throws: the same chapter frame as the
 * 404, a way to try the page again (Next re-renders the segment), the way
 * home, and a way to tell the foundation. The error itself goes to the
 * console; its digest is shown so a report can be matched to a log.
 */
export function ErrorState({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('errorPage');
  const common = useTranslations('common');
  const locale = useLocale() as Locale;

  useEffect(() => { console.error(error); }, [error]);

  return (
    <ErrorChapter
      code="500"
      label={t('label')}
      heading={t('title')}
      body={t('body')}
      actions={
        <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
          <Button size="lg" onClick={reset} className="text-[13px]">{t('retry')}</Button>
          <Link href={localePath(locale, '/')} className={LINK}>{t('home')}</Link>
          <a href={`mailto:${CONTACT_EMAIL}`} className={LINK}>{common('writeToUs')}</a>
        </div>
      }
      aside={
        error.digest ? (
          <p className="m-0 text-xs text-paper/50">
            {t('reference')}: <span className="font-mono">{error.digest}</span>
          </p>
        ) : undefined
      }
    />
  );
}

'use client';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';

const LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'pt', label: 'PT' },
];

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  function getLocalizedHref(targetLocale: string) {
    if (targetLocale === 'en') {
      // Strip /es or /pt prefix to get English path
      return pathname.replace(/^\/(es|pt)/, '') || '/';
    }
    // Strip any existing locale prefix (es/pt); en paths never carry one
    const stripped = pathname.replace(/^\/(es|pt)/, '');
    return `/${targetLocale}${stripped || '/'}`;
  }

  return (
    <div className="flex gap-2 text-sm">
      {LOCALES.map(({ code, label }) => (
        <Link
          key={code}
          href={getLocalizedHref(code)}
          className={locale === code ? 'font-bold underline' : 'opacity-60 hover:opacity-100'}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}

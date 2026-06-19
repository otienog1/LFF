'use client';
import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { ChevronDownIcon, CheckIcon } from 'lucide-react';
import { GB, ES, PT } from 'country-flag-icons/react/3x2';
import { cn } from '@/lib/utils';

const LOCALES = [
  { code: 'en', label: 'EN', Flag: GB },
  { code: 'es', label: 'ES', Flag: ES },
  { code: 'pt', label: 'PT', Flag: PT },
];

interface Props { solid?: boolean; mobile?: boolean }

export default function LocaleSwitcher({ solid = false, mobile = false }: Props) {
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = LOCALES.find(l => l.code === locale) ?? LOCALES[0];

  function getLocalizedHref(target: string) {
    if (target === 'en') return pathname.replace(/^\/(es|pt)/, '') || '/';
    const stripped = pathname.replace(/^\/(es|pt)/, '');
    return `/${target}${stripped || '/'}`;
  }

  function navigate(code: string) {
    setOpen(false);
    if (code === locale) return;
    window.dispatchEvent(new CustomEvent('page-transition-start', { detail: getLocalizedHref(code) }));
  }

  useEffect(() => {
    if (!open) return;
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [open]);

  if (mobile) {
    return (
      <div className="flex items-center gap-4">
        {LOCALES.map(({ code, label, Flag }) => (
          <button
            key={code}
            type="button"
            onClick={() => navigate(code)}
            className={cn(
              'flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase font-medium transition-colors duration-200 outline-none',
              locale === code ? 'text-paper' : 'text-paper/30 hover:text-paper/60'
            )}
          >
            <Flag className="w-5 h-auto" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          'flex items-center gap-1.5 outline-none cursor-pointer transition-colors duration-300',
          'text-[11px] tracking-[0.12em] uppercase font-medium',
          solid ? 'text-ink-soft hover:text-ink' : 'text-paper/70 hover:text-paper'
        )}
      >
        <active.Flag className="w-4 h-auto" aria-hidden="true" />
        {active.label}
        <ChevronDownIcon className={cn(
          'size-3 opacity-50 transition-transform duration-200',
          open && 'rotate-180'
        )} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full mt-2.5 z-50 min-w-24 bg-paper border border-line py-1"
        >
          {LOCALES.map(({ code, label, Flag }) => (
            <button
              key={code}
              role="option"
              aria-selected={locale === code}
              type="button"
              onClick={() => navigate(code)}
              className={cn(
                'relative w-full flex items-center gap-2.5 px-4 py-2 text-left cursor-default select-none outline-none',
                'text-[11px] tracking-[0.12em] uppercase font-medium transition-colors duration-150',
                locale === code
                  ? 'text-ink'
                  : 'text-ink/50 hover:text-ink hover:bg-ink/4'
              )}
            >
              <Flag className="w-4 h-auto shrink-0" aria-hidden="true" />
              {label}
              {locale === code && (
                <CheckIcon className="absolute right-3 size-3" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

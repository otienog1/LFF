import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale, getMessages } from 'next-intl/server';
import HtmlLang from '@/components/ui/HtmlLang';
import { locales, type Locale } from '@/i18n/config';

/** Only the locales listed below are built; anything else is a 404, not a copy of the English home. */
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.filter((l) => l !== 'en').map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale) || locale === 'en') notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <HtmlLang />
      {children}
    </NextIntlClientProvider>
  );
}

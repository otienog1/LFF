import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale, getMessages } from 'next-intl/server';
import HtmlLang from '@/components/ui/HtmlLang';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  await params;
  const base = 'https://theluigifootprints.org';
  return {
    alternates: {
      languages: {
        'en': base,
        'es': `${base}/es`,
        'pt': `${base}/pt`,
        'x-default': base,
      },
    },
  };
}

export function generateStaticParams() {
  return [{ locale: 'es' }, { locale: 'pt' }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <HtmlLang />
      {children}
    </NextIntlClientProvider>
  );
}

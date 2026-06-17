import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale, getMessages } from 'next-intl/server';
import HtmlLang from '@/components/ui/HtmlLang';

export const metadata: Metadata = {
  alternates: {
    languages: {
      'en': 'https://theluigifootprints.org',
      'es': 'https://theluigifootprints.org/es',
      'pt': 'https://theluigifootprints.org/pt',
      'x-default': 'https://theluigifootprints.org',
    },
  },
};

export default async function EnLayout({ children }: { children: React.ReactNode }) {
  setRequestLocale('en');
  const messages = await getMessages();
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <HtmlLang />
      {children}
    </NextIntlClientProvider>
  );
}

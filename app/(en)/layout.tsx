import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale, getMessages } from 'next-intl/server';

export default async function EnLayout({ children }: { children: React.ReactNode }) {
  setRequestLocale('en');
  const messages = await getMessages();
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

import { getRequestConfig } from 'next-intl/server';
import en from '../messages/en.json';
import es from '../messages/es.json';
import pt from '../messages/pt.json';

const messages = { en, es, pt } as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? 'en';
  const msgs = messages[locale as keyof typeof messages] ?? messages.en;
  return { locale, messages: msgs, timeZone: 'Africa/Nairobi' };
});

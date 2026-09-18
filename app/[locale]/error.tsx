'use client';
import { ErrorState } from '@/components/errors/ErrorState';

/** Catches a page that throws in the Spanish or Portuguese tree; the layout, nav and footer stay. */
export default function LocaleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorState error={error} reset={reset} />;
}

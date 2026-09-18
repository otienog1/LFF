'use client';
import { ErrorState } from '@/components/errors/ErrorState';

/** Catches a page that throws in the English tree; the layout, nav and footer stay. */
export default function EnError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorState error={error} reset={reset} />;
}

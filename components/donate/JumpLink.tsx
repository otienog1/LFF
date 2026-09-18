'use client';
import { ArrowDown } from 'lucide-react';
import { useLenis } from '@/components/layout/Layout';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * A button that scrolls to a chapter further down the same page, landing it
 * on the chapters' line. Lenis is resynced first because a native scroll may
 * have just moved the page; without Lenis the browser scrolls.
 */
export function JumpLink({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) {
  const lenis = useLenis();
  const jump = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(to);
    if (!target) return;
    e.preventDefault();
    if (lenis) {
      const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 96;
      lenis.scrollTo(window.scrollY, { immediate: true });
      lenis.scrollTo(target.getBoundingClientRect().top + window.scrollY - margin);
    } else {
      target.scrollIntoView({ block: 'start' });
    }
  };
  return (
    <a href={`#${to}`} onClick={jump} className={cn(buttonVariants({ size: 'lg' }), 'text-[13px]', className)}>
      {children}
      <ArrowDown aria-hidden="true" className="size-4" />
    </a>
  );
}

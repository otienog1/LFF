'use client';
import { useEffect, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';

const NAV_DELAY = 600; // ms to show loading screen before navigating

export function PageTransition() {
  const overlayRef  = useRef<HTMLDivElement>(null);
  const barRef      = useRef<HTMLDivElement>(null);
  const numRef      = useRef<HTMLSpanElement>(null);
  const active      = useRef(false);
  const minTime     = useRef(0);
  const progress    = useRef({ value: 0 });
  const pathname    = usePathname();
  const router      = useRouter();

  const show = useCallback(() => {
    const el  = overlayRef.current;
    const bar = barRef.current;
    const num = numRef.current;
    if (!el || !bar || !num || active.current) return;

    active.current         = true;
    minTime.current        = Date.now() + 400;
    progress.current.value = 0;

    gsap.killTweensOf([el, bar, progress.current]);
    gsap.set(el,  { display: 'flex', pointerEvents: 'all' });
    gsap.set(bar, { scaleX: 0, transformOrigin: 'left center' });
    num.textContent = '0';

    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'none' });

    gsap.to(progress.current, {
      value: 82,
      duration: 4,
      ease: 'power1.out',
      onUpdate: () => {
        if (numRef.current)
          numRef.current.textContent = Math.round(progress.current.value).toString();
      },
    });

    gsap.to(bar, { scaleX: 0.82, duration: 4, ease: 'power1.out' });
  }, []);

  const hide = useCallback(() => {
    const el  = overlayRef.current;
    const bar = barRef.current;
    if (!el || !bar || !active.current) return;

    const wait = Math.max(0, minTime.current - Date.now());
    setTimeout(() => {
      active.current = false;
      gsap.killTweensOf([bar, progress.current]);

      gsap.to(progress.current, {
        value: 100,
        duration: 0.22,
        ease: 'power1.in',
        onUpdate: () => {
          if (numRef.current)
            numRef.current.textContent = Math.round(progress.current.value).toString();
        },
      });
      gsap.to(bar, { scaleX: 1, duration: 0.22, ease: 'power1.in' });
      gsap.to(el, {
        opacity: 0,
        duration: 0.35,
        delay: 0.22,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(el, { display: 'none', pointerEvents: 'none' });
          progress.current.value = 0;
        },
      });
    }, wait);
  }, []);

  useEffect(() => { hide(); }, [pathname, hide]);


  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (
        !href ||
        href.startsWith('http') ||
        href.startsWith('mailto') ||
        href.startsWith('tel') ||
        href.startsWith('#')
      ) return;
      if (href === window.location.pathname) return;
      e.preventDefault();
      show();
      setTimeout(() => router.push(href), NAV_DELAY);
    };

    const onLocaleNav = (e: Event) => {
      const href = (e as CustomEvent<string>).detail;
      show();
      setTimeout(() => router.push(href), NAV_DELAY);
    };

    document.addEventListener('click', onClick);
    window.addEventListener('page-transition-start', onLocaleNav);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('page-transition-start', onLocaleNav);
    };
  }, [show, router]);

  return (
    <div
      ref={overlayRef}
      style={{ display: 'none', opacity: 0, pointerEvents: 'none' }}
      className="fixed inset-0 z-9999 bg-paper-deep flex flex-col items-center justify-center gap-5"
    >
      {/* Percentage */}
      <div className="flex items-start leading-none">
        <span
          ref={numRef}
          className="font-display text-ink"
          style={{ fontSize: 'clamp(48px, 8vw, 80px)', letterSpacing: '-0.04em', lineHeight: 1 }}
        >
          0
        </span>
        <span
          className="font-display text-ink/25"
          style={{ fontSize: 'clamp(14px, 2.2vw, 24px)', marginTop: '0.12em', marginLeft: '3px', lineHeight: 1 }}
        >
          %
        </span>
      </div>

      {/* Foundation name */}
      <p className="text-[9px] uppercase tracking-[0.22em] text-ink/30 select-none">
        The Luigi Footprints Foundation
      </p>

      {/* Progress bar */}
      <div className="w-48 h-[1.5px] bg-ink/8 overflow-hidden">
        <div
          ref={barRef}
          className="h-full w-full bg-green"
          style={{ transform: 'scaleX(0)', transformOrigin: 'left center' }}
        />
      </div>
    </div>
  );
}

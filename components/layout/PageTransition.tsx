'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { resolveTransitionTarget } from '@/lib/navigation';

gsap.registerPlugin(useGSAP);

/** Minimum time the curtain stays closed, so fast routes don't flicker. */
const HOLD_MS = 320;
/** Reveal anyway if the route never commits (network failure, hard redirect). */
const TIMEOUT_MS = 8000;
/** Lag between the green leading panel and the ink panel behind it. */
const PANEL_LAG = 0.09;
/** Travel time of each panel across the viewport. */
const COVER_S = 0.75;
/** Minimum time the curtain stays on a hard load, so the wordmark registers before the lift. */
const PRELOAD_HOLD_MS = 900;
/** On a hard load, reveal anyway if fonts or the hero image never settle. */
const PRELOAD_TIMEOUT_MS = 4000;

type Phase = 'idle' | 'covering' | 'covered' | 'revealing';

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Fonts in, the first image in main decoded, and the document's load event fired. */
function whenPageReady(): Promise<void> {
  const fonts: Promise<unknown> = document.fonts?.ready ?? Promise.resolve();
  const img = document.querySelector<HTMLImageElement>('main img');
  const image = img && !img.complete
    ? new Promise<void>((resolve) => {
        img.addEventListener('load', () => resolve(), { once: true });
        img.addEventListener('error', () => resolve(), { once: true });
      })
    : Promise.resolve();
  const loaded = document.readyState === 'complete'
    ? Promise.resolve()
    : new Promise<void>((resolve) => window.addEventListener('load', () => resolve(), { once: true }));
  return Promise.all([fonts, image, loaded]).then(() => undefined);
}

/**
 * Curtain wipe between routes.
 *
 * A green panel leads and an ink panel follows a beat behind, rising from the
 * bottom to cover the outgoing page. The route is pushed once the screen is
 * covered, and when the new page has committed the curtain keeps travelling up
 * and exits through the top while the new page settles in from below.
 * Back/forward navigation gets the page entrance only, no curtain.
 *
 * On a hard load the curtain is already down: the inline script in the root
 * layout marks the document covered before first paint, so the overlay is the
 * first frame. It lifts once fonts and the hero image are in, and the nav
 * settles in with it. Load sequences gated on the reveal event start then.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const rootRef    = useRef<HTMLDivElement>(null);
  const mainRef    = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const greenRef   = useRef<HTMLDivElement>(null);
  const inkRef     = useRef<HTMLDivElement>(null);
  const markRef    = useRef<HTMLDivElement>(null);
  const ruleRef    = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const router   = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;

  const api = useRef<{ routeChanged: () => void } | null>(null);
  const seenPath = useRef(pathname);

  useGSAP((_, contextSafe) => {
    const main    = mainRef.current!;
    const overlay = overlayRef.current!;
    const green   = greenRef.current!;
    const ink     = inkRef.current!;
    const mark    = markRef.current!;
    const rule    = ruleRef.current!;

    let phase: Phase = 'idle';
    let coveredAt = 0;
    let routeReady = false;
    let timeoutId = 0;
    let holdId = 0;
    let raf = 0;
    let liftNav = false;

    // A hard load arrives with the curtain down (see the root layout's head script).
    const preloading = document.documentElement.dataset.transition === 'covered';

    // Resting positions are set here rather than inline so GSAP owns the
    // transforms; an inline translateY(100%) is read back as a pixel offset.
    gsap.set([green, ink], { yPercent: preloading ? 0 : 100 });
    gsap.set(mark, { opacity: 0 });
    gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' });

    const enterPage = contextSafe((delay = 0) => {
      gsap.killTweensOf(main);
      if (reducedMotion()) { gsap.set(main, { clearProps: 'opacity,transform' }); return; }
      gsap.fromTo(
        main,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, delay, ease: 'power3.out', clearProps: 'opacity,transform' },
      );
    });

    const finish = contextSafe(() => {
      phase = 'idle';
      routeReady = false;
      gsap.set(overlay, { visibility: 'hidden', pointerEvents: 'none', opacity: 1 });
      gsap.set([green, ink], { yPercent: 100 });
      gsap.set(mark, { opacity: 0 });
      gsap.set(rule, { scaleX: 0 });
    });

    const reveal = contextSafe(() => {
      if (phase !== 'covered') return;
      phase = 'revealing';
      window.clearTimeout(timeoutId);
      gsap.killTweensOf([green, ink, main, mark, rule, overlay]);
      // Let load sequences on the new page start now rather than under the curtain.
      delete document.documentElement.dataset.transition;
      window.dispatchEvent(new Event('page-transition-reveal'));

      if (reducedMotion()) {
        gsap.set(main, { clearProps: 'opacity,transform' });
        gsap.to(overlay, { opacity: 0, duration: 0.3, ease: 'none', onComplete: finish });
        return;
      }

      const tl = gsap.timeline({ onComplete: finish, defaults: { ease: 'power3.inOut', duration: 0.8 } })
        .to(ink,   { yPercent: -100 }, 0)
        .to(green, { yPercent: -100 }, PANEL_LAG)
        .to(mark,  { opacity: 0, y: -16, duration: 0.35, ease: 'power1.in' }, 0)
        .fromTo(
          main,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', clearProps: 'opacity,transform' },
          0.25,
        );
      // First reveal only: the fixed nav settles in with the page instead of sitting there already.
      if (liftNav) {
        liftNav = false;
        const header = document.querySelector('header');
        if (header) {
          tl.fromTo(header, { y: -12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', clearProps: 'opacity,transform' }, 0.35);
        }
      }
    });

    /** Route has committed under the curtain: hold briefly, let it paint, then reveal. */
    const scheduleReveal = (minHold = HOLD_MS) => {
      window.clearTimeout(holdId);
      const wait = Math.max(0, minHold - (performance.now() - coveredAt));
      holdId = window.setTimeout(() => {
        raf = requestAnimationFrame(() => { raf = requestAnimationFrame(reveal); });
      }, wait);
    };

    const onCovered = (href: string) => {
      phase = 'covered';
      coveredAt = performance.now();
      routerRef.current.push(href);
      timeoutId = window.setTimeout(reveal, TIMEOUT_MS);
      if (routeReady) scheduleReveal();
    };

    const cover = contextSafe((href: string) => {
      if (phase !== 'idle') return;
      phase = 'covering';
      routeReady = false;
      document.documentElement.dataset.transition = 'covered';
      gsap.killTweensOf([green, ink, main, mark, rule, overlay]);
      gsap.set(overlay, { visibility: 'visible', pointerEvents: 'auto', opacity: 1 });

      if (reducedMotion()) {
        gsap.set([green, ink], { yPercent: 0 });
        gsap.set(mark, { opacity: 1, y: 0 });
        gsap.set(rule, { scaleX: 1 });
        gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'none', onComplete: () => onCovered(href) });
        return;
      }

      // The route is pushed the moment the ink panel lands; the wordmark and
      // rule keep animating on top while the next page is fetched.
      gsap.timeline({ defaults: { ease: 'power3.inOut', duration: COVER_S } })
        .fromTo(green, { yPercent: 100 }, { yPercent: 0 }, 0)
        .fromTo(ink,   { yPercent: 100 }, { yPercent: 0 }, PANEL_LAG)
        .to(main,  { y: -56, opacity: 0.6 }, 0)
        .add(() => onCovered(href), COVER_S + PANEL_LAG)
        .fromTo(mark, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.35)
        .fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: 'power1.inOut' }, 0.55);
    });

    api.current = {
      routeChanged: () => {
        if (phase === 'covered') scheduleReveal();
        else if (phase === 'covering') routeReady = true;
        else if (phase === 'idle') enterPage();
      },
    };

    const onClick = (e: MouseEvent) => {
      // Leave modifier-clicks, middle-clicks, new-tab links and downloads to the browser.
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest?.('a[href]');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== '_self') return;
      if (anchor.hasAttribute('download')) return;
      const target = resolveTransitionTarget(anchor.getAttribute('href'), window.location);
      if (!target) return;
      e.preventDefault();
      cover(target);
    };

    const onLocaleNav = (e: Event) => {
      const href = (e as CustomEvent<string>).detail;
      const target = resolveTransitionTarget(href, window.location);
      if (target) cover(target);
      else if (href) routerRef.current.push(href);
    };

    if (preloading) {
      // Curtain already down: hold it until the page is ready, then run the normal reveal.
      phase = 'covered';
      coveredAt = performance.now();
      routeReady = true;
      liftNav = true;
      gsap.set(overlay, { visibility: 'visible', pointerEvents: 'auto', opacity: 1 });
      // The wordmark appears only once its face has loaded, so it never shows in the fallback serif.
      (document.fonts?.ready ?? Promise.resolve()).then(contextSafe(() => {
        if (reducedMotion()) gsap.set(mark, { opacity: 1 });
        else gsap.fromTo(mark, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' });
      }));
      if (!reducedMotion()) gsap.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: 'power1.inOut' });
      else gsap.set(rule, { scaleX: 1 });
      timeoutId = window.setTimeout(reveal, PRELOAD_TIMEOUT_MS);
      whenPageReady().then(contextSafe(() => scheduleReveal(PRELOAD_HOLD_MS)));
    } else {
      enterPage();
    }
    // Capture phase: run before Next's <Link> handler on the React root, which
    // would otherwise push the route itself and mark the event as handled.
    document.addEventListener('click', onClick, true);
    window.addEventListener('page-transition-start', onLocaleNav);

    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('page-transition-start', onLocaleNav);
      window.clearTimeout(timeoutId);
      window.clearTimeout(holdId);
      cancelAnimationFrame(raf);
      api.current = null;
    };
  }, { scope: rootRef });

  useEffect(() => {
    if (seenPath.current === pathname) return;
    seenPath.current = pathname;
    api.current?.routeChanged();
  }, [pathname]);

  return (
    <div ref={rootRef} className="contents">
      <main ref={mainRef} id="main" tabIndex={-1} className="min-h-dvh focus-visible:outline-none">
        {children}
      </main>

      <div
        ref={overlayRef}
        data-curtain
        aria-hidden="true"
        className="fixed inset-0 z-9999 invisible pointer-events-none"
      >
        {/* Leading panel: shows as a green band at the curtain's edge. */}
        <div ref={greenRef} className="absolute inset-0 bg-green will-change-transform" />
        {/* Main panel, carrying the wordmark. */}
        <div
          ref={inkRef}
          className="absolute inset-0 bg-ink will-change-transform flex items-center justify-center px-6"
        >
          <div ref={markRef} className="flex flex-col items-center gap-7 select-none opacity-0">
            <p
              className="font-display text-paper text-center leading-none tracking-[-0.02em]"
              style={{ fontSize: 'clamp(1.625rem, 4.5vw, 3rem)' }}
            >
              The Luigi Footprints Foundation
            </p>
            <div className="w-12 h-px bg-paper/15 overflow-hidden">
              <div ref={ruleRef} className="h-full w-full origin-left scale-x-0 bg-green-light" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

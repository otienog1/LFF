'use client';
import { useCallback, useLayoutEffect, useRef, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type Lenis from 'lenis';
import { resolveTransitionTarget, trimSlash } from '@/lib/navigation';
import { WORDMARK } from '@/lib/site';
import { useLenis } from './LenisContext';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Panel travel as the curtain closes over the page being left. */
const COVER_S = 0.65;
/** Panel travel as the curtain lifts off the new page. */
const REVEAL_S = 0.75;
/** Lag between the green leading panel and the ink panel behind it. */
const PANEL_LAG = 0.08;
/**
 * The rule under the wordmark is the curtain's loading line. While the next page is on its way it draws most of the
 * way across (to RULE_WAIT, over RULE_WAIT_S, slowing as it goes); once the page is ready it finishes (see
 * finishRule), and only then does the curtain lift. So the pause at full cover always reads as loading completing,
 * never as the curtain stalling, however fast the page arrives.
 */
const RULE_WAIT = 0.9;
/** Long enough that the line is still visibly drawing while a first visit's photographs decode (about 1.5s in). */
const RULE_WAIT_S = 1.6;
/** How long the rule takes to finish from where it stands: quick from far back, quicker still near the end. */
const ruleFinishS = (from: number) => 0.12 + 0.3 * (1 - from);
/** The lift begins this far through the rule's finish, so the wordmark leaves as the line completes, not after. */
const RULE_HANDOFF = 0.75;
/** The wordmark lifts off this far ahead of the panels, so the curtain follows it out. */
const MARK_LEAD = 0.08;
/**
 * Longest the closed curtain waits for the first screen's photographs once the new route is in. Past it the curtain
 * lifts anyway and a photograph still on its way fades in when it lands (SmartImage), so a slow connection costs the
 * reader a fade, never a longer wait.
 */
const MEDIA_WAIT_MS = 1200;
/** Lift anyway if the route never commits (a failed fetch falls back to a full page load). */
const TIMEOUT_MS = 8000;
/** Least time the curtain stays down on a full page load, so the wordmark registers before the lift. */
const PRELOAD_HOLD_MS = 900;
/** On a full page load, lift anyway if fonts or photographs never settle. */
const PRELOAD_TIMEOUT_MS = 4000;
/** Session key for each page's scroll position, so back, forward and reload return the reader to their place. */
const SCROLL_STORE = 'lff:scroll';

type Phase = 'idle' | 'covering' | 'covered' | 'revealing';
/** How the route about to commit was reached. `none` leaves scrolling to Next (a navigation this file did not start). */
type Arrival = { kind: 'initial' } | { kind: 'push'; href: string } | { kind: 'pop' } | { kind: 'none' };

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const pageKey = () => trimSlash(window.location.pathname) + window.location.search;

function readPositions(): Record<string, number> {
  try {
    return JSON.parse(sessionStorage.getItem(SCROLL_STORE) ?? '{}') as Record<string, number>;
  } catch {
    return {};
  }
}

function savePosition(key: string, y: number) {
  try {
    const all = readPositions();
    all[key] = Math.round(y);
    sessionStorage.setItem(SCROLL_STORE, JSON.stringify(all));
  } catch {
    // Storage unavailable (private mode, quota): positions are simply not kept.
  }
}

/** The document position an in-page anchor scrolls to, less its scroll margin; null when there is no such element. */
function anchorY(hash: string): number | null {
  if (!hash || hash === '#') return null;
  let id = hash.slice(1);
  try { id = decodeURIComponent(id); } catch { /* keep it as written */ }
  const el = document.getElementById(id);
  if (!el) return null;
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  return Math.max(0, el.getBoundingClientRect().top + window.scrollY - margin);
}

/** Where a full page load opens: the kept position on a reload or a return through history, else the anchor, else the top (null). */
function initialPosition(): number | null {
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  if (nav?.type === 'reload' || nav?.type === 'back_forward') {
    const kept = readPositions()[pageKey()];
    if (kept != null) return kept;
  }
  return anchorY(window.location.hash);
}

/**
 * Move the page at once. Through Lenis when it runs, so its own position stays in step, after re-measuring it so a
 * new page longer than the old one is not clamped to the old one's length.
 */
function jumpTo(lenis: Lenis | null, y: number) {
  if (lenis) {
    lenis.resize();
    lenis.scrollTo(y, { immediate: true, force: true });
  } else {
    window.scrollTo(0, y);
  }
}

/** Resolves once the photographs in the first screen are decoded, or after `cap` ms, whichever comes first. */
function firstScreenMedia(scope: HTMLElement, cap: number): Promise<void> {
  const vh = window.innerHeight;
  const images = Array.from(scope.querySelectorAll('img')).filter((img) => {
    const r = img.getBoundingClientRect();
    return r.width > 0 && r.bottom > 0 && r.top < vh;
  });
  if (!images.length) return Promise.resolve();
  const decoded = Promise.all(images.map((img) => img.decode().catch(() => undefined))).then(() => undefined);
  return Promise.race([decoded, new Promise<void>((resolve) => window.setTimeout(resolve, cap))]);
}

/** Fonts in and the document's load event fired: the state a full page load lifts its curtain on. */
function whenLoaded(): Promise<void> {
  const fonts: Promise<unknown> = document.fonts?.ready ?? Promise.resolve();
  const loaded = document.readyState === 'complete'
    ? Promise.resolve()
    : new Promise<void>((resolve) => window.addEventListener('load', () => resolve(), { once: true }));
  return Promise.all([fonts, loaded]).then(() => undefined);
}

/**
 * Rendered ahead of the page inside <main>. Layout effects run in tree order, so this one runs after the new page's
 * DOM is in but before the page's own effects: the page is already where it will be shown when its scroll triggers
 * first measure, and nothing reveals early or late for having measured at the old page's scroll position.
 */
function BeforePage({ onRoute }: { onRoute: () => void }) {
  const pathname = usePathname();
  useLayoutEffect(onRoute, [pathname, onRoute]);
  return null;
}

/**
 * Curtain wipe between routes.
 *
 * A green panel leads and an ink panel follows a beat behind, rising from the bottom over the page being left, which
 * dims slightly under them. The wordmark rises in with a loading line beneath it, which draws most of the way across
 * while the next page loads. Once the screen is covered the route is pushed; when the new page has committed, is
 * placed (top, anchor, or its kept position) and measured, and the photographs in its first screen are decoded, the
 * line finishes, the wordmark lifts off and the curtain follows it out through the top, so the pause at full cover
 * always reads as loading completing. The page underneath is complete and at rest by then: nothing
 * about it changes as it is uncovered, and its own entrance (photograph, then heading, then the rest) starts with the
 * lift. The page itself is never faded or moved, so the paper behind it never shows through and fixed or pinned
 * elements inside it never lose their place.
 *
 * A link chosen while the curtain is closing replaces the destination; one chosen while it is down is pushed at
 * once; one chosen while it is lifting brings it back down. Back/forward gets no curtain: the page returns at the
 * position it was left, placed before it first paints. A full page load arrives with the curtain already down (the
 * root layout's head script marks the document covered before first paint), so the overlay is the first frame; it
 * lifts once fonts and the first screen's photographs are in, and the nav settles in with it.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const rootRef    = useRef<HTMLDivElement>(null);
  const mainRef    = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const veilRef    = useRef<HTMLDivElement>(null);
  const greenRef   = useRef<HTMLDivElement>(null);
  const inkRef     = useRef<HTMLDivElement>(null);
  const markRef    = useRef<HTMLDivElement>(null);
  const ruleRef    = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const router   = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  const arrival = useRef<Arrival>({ kind: 'initial' });
  const api = useRef<{ routeCommitted: () => void } | null>(null);
  const seenPath = useRef(pathname);

  /** Scroll for the route now committing, before the page measures. Consumes the arrival. */
  const placePage = useCallback(() => {
    const how = arrival.current;
    arrival.current = { kind: 'none' };
    if (how.kind === 'initial') {
      // Lenis starts after this and takes the position as it finds it. Fonts may still move an anchor a little;
      // the full-load path places the page again once they are in.
      const y = initialPosition();
      if (y != null) window.scrollTo(0, y);
    } else if (how.kind === 'push') {
      jumpTo(lenisRef.current, anchorY(new URL(how.href, window.location.origin).hash) ?? 0);
    } else if (how.kind === 'pop') {
      jumpTo(lenisRef.current, readPositions()[pageKey()] ?? 0);
    }
  }, []);

  useGSAP((_, contextSafe) => {
    const html    = document.documentElement;
    const main    = mainRef.current!;
    const overlay = overlayRef.current!;
    const veil    = veilRef.current!;
    const green   = greenRef.current!;
    const ink     = inkRef.current!;
    const mark    = markRef.current!;
    const rule    = ruleRef.current!;

    let phase: Phase = 'idle';
    /** The page the reader asked for, pushed once the curtain is down. */
    let target: string | null = null;
    /** The path that has to commit before the curtain may lift. */
    let awaiting: string | null = null;
    let coveredAt = 0;
    let timeoutId = 0;
    let holdId = 0;
    let raf = 0;
    /** Bumped whenever a scheduled lift must be abandoned (a new destination, a history navigation). */
    let token = 0;
    let disposed = false;
    let coverTl: gsap.core.Timeline | null = null;
    let revealTl: gsap.core.Timeline | null = null;
    let navTween: gsap.core.Tween | null = null;
    let liftNav = false;
    let currentKey = pageKey();

    // Back, forward and reload are placed by this file (see BeforePage), not by the browser, which would restore
    // onto the page being left before the new one exists.
    try { history.scrollRestoration = 'manual'; } catch { /* not supported: the browser restores as usual */ }

    // A full load arrives with the curtain down (see the root layout's head script).
    const preloading = html.dataset.transition === 'covered';

    // Resting positions are set here rather than inline so GSAP owns the transforms.
    gsap.set([green, ink], { yPercent: preloading ? 0 : 100 });
    gsap.set(veil, { opacity: 0 });
    gsap.set(mark, { opacity: 0 });
    gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' });

    /** Stops every curtain animation; `keepRule` leaves the loading line to finish drawing as the lift begins. */
    const killCurtain = (keepRule = false) => {
      coverTl?.kill(); coverTl = null;
      revealTl?.kill(); revealTl = null;
      gsap.killTweensOf(keepRule ? [green, ink, veil, mark, overlay] : [green, ink, veil, mark, rule, overlay]);
    };
    const cancelLift = () => { token++; window.clearTimeout(holdId); cancelAnimationFrame(raf); };
    const armTimeout = (ms: number) => { window.clearTimeout(timeoutId); timeoutId = window.setTimeout(() => reveal(), ms); };

    const finish = contextSafe(() => {
      phase = 'idle';
      revealTl = null;
      gsap.set(overlay, { visibility: 'hidden', pointerEvents: 'none', opacity: 1 });
      gsap.set([green, ink], { yPercent: 100 });
      gsap.set(veil, { opacity: 0 });
      gsap.set(mark, { opacity: 0, y: 0 });
      gsap.set(rule, { scaleX: 0 });
    });

    const reveal = contextSafe(() => {
      if (phase !== 'covered' || disposed) return;
      cancelLift();
      window.clearTimeout(timeoutId);
      phase = 'revealing';
      killCurtain(true);
      // The new page's own entrance starts now, as the curtain lifts, not under it.
      delete html.dataset.transition;
      window.dispatchEvent(new Event('page-transition-reveal'));

      if (reducedMotion()) {
        revealTl = gsap.timeline({ onComplete: finish }).to(overlay, { opacity: 0, duration: 0.25, ease: 'none' });
        return;
      }
      // The wordmark lifts off first and the panels follow it out, the ink panel leading the green.
      revealTl = gsap.timeline({ onComplete: finish, defaults: { ease: 'power3.inOut', duration: REVEAL_S } })
        .to(mark,  { opacity: 0, y: -16, duration: 0.3, ease: 'power1.in' }, 0)
        .to(ink,   { yPercent: -100 }, MARK_LEAD)
        .to(green, { yPercent: -100 }, MARK_LEAD + PANEL_LAG);
      // First lift only: the fixed nav settles in with the page instead of sitting there already.
      if (liftNav) {
        liftNav = false;
        const header = document.querySelector('header');
        if (header) {
          navTween = gsap.fromTo(header, { y: -12, opacity: 0 }, {
            y: 0, opacity: 1, duration: 0.8, delay: 0.35 + MARK_LEAD, ease: 'power3.out', clearProps: 'opacity,transform',
          });
        }
      }
    });

    /** Draws the loading line most of the way across, slowing as it goes, while the next page is on its way. */
    const trickleRule = contextSafe(() => {
      if (reducedMotion()) { gsap.set(rule, { scaleX: 1 }); return; }
      gsap.fromTo(rule, { scaleX: 0 }, { scaleX: RULE_WAIT, duration: RULE_WAIT_S, ease: 'power2.out', overwrite: true });
    });

    /**
     * Finishes the loading line from wherever it stands. Resolves true at the handoff point of the finish (the line
     * completes on its own while the lift begins), or false at once when there was nothing left to draw (reduced
     * motion, or a line already full).
     */
    const finishRule = () => new Promise<boolean>((resolve) => {
      const from = Number(gsap.getProperty(rule, 'scaleX')) || 0;
      if (reducedMotion() || from >= 0.999) {
        gsap.set(rule, { scaleX: 1 });
        resolve(false);
        return;
      }
      contextSafe(() => {
        let handedOff = false;
        const handOff = () => { if (!handedOff) { handedOff = true; resolve(true); } };
        const tween: gsap.core.Tween = gsap.to(rule, {
          scaleX: 1, duration: ruleFinishS(from), ease: 'power2.out', overwrite: true,
          onUpdate: () => { if (tween.progress() >= RULE_HANDOFF) handOff(); },
          onComplete: handOff, onInterrupt: handOff,
        });
      })();
    });

    /**
     * The route is in under the curtain: wait out any least hold and the first screen's photographs, finish the
     * loading line, then lift. The finish runs at least 90ms before the lift takes over, time in which the new page
     * has painted underneath; when the line had nothing left to draw, two frames make sure of that paint instead.
     */
    const scheduleLift = (minHold = 0) => {
      cancelLift();
      const mine = token;
      const live = () => mine === token && !disposed;
      const hold = new Promise<void>((resolve) => {
        holdId = window.setTimeout(resolve, Math.max(0, minHold - (performance.now() - coveredAt)));
      });
      Promise.all([hold, firstScreenMedia(main, MEDIA_WAIT_MS)])
        .then(() => (live() ? finishRule() : false))
        .then((drew) => {
          if (!live()) return;
          if (drew) { reveal(); return; }
          raf = requestAnimationFrame(() => { raf = requestAnimationFrame(() => { if (live()) reveal(); }); });
        });
    };

    const pushTarget = () => {
      const href = target;
      if (!href) return;
      target = null;
      cancelLift();
      armTimeout(TIMEOUT_MS);
      arrival.current = { kind: 'push', href };
      const url = new URL(href, window.location.origin);
      if (trimSlash(url.pathname) !== trimSlash(seenPath.current)) {
        awaiting = trimSlash(url.pathname);
        routerRef.current.push(href, { scroll: false });
        return;
      }
      // The page already on screen (the reader chose the page they were leaving): nothing will commit, so place it
      // for the link and lift.
      awaiting = null;
      if (url.search + url.hash !== window.location.search + window.location.hash) {
        routerRef.current.push(href, { scroll: false });
      }
      placePage();
      ScrollTrigger.refresh();
      scheduleLift();
    };

    const onCovered = () => {
      phase = 'covered';
      coveredAt = performance.now();
      coverTl = null;
      gsap.set(veil, { opacity: 0 });
      armTimeout(TIMEOUT_MS);
      if (target) pushTarget();
      else if (!awaiting) scheduleLift(); // a history navigation brought its page in while the curtain closed
    };

    const cover = contextSafe(() => {
      phase = 'covering';
      html.dataset.transition = 'covered';
      window.dispatchEvent(new Event('page-transition-cover'));
      killCurtain();
      gsap.set(overlay, { visibility: 'visible', pointerEvents: 'auto', opacity: 1 });

      if (reducedMotion()) {
        gsap.set([green, ink], { yPercent: 0 });
        gsap.set(mark, { opacity: 1, y: 0 });
        gsap.set(rule, { scaleX: 1 });
        coverTl = gsap.timeline()
          .fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'none' })
          .add(onCovered);
        return;
      }
      // The page being left stays exactly where it is and dims under the rising panels. The route is pushed the
      // moment the ink panel lands; the wordmark and its loading line keep drawing on top while the next page loads.
      coverTl = gsap.timeline({ defaults: { ease: 'power3.inOut', duration: COVER_S } })
        .fromTo(green, { yPercent: 100 }, { yPercent: 0 }, 0)
        .fromTo(ink,   { yPercent: 100 }, { yPercent: 0 }, PANEL_LAG)
        .fromTo(veil,  { opacity: 0 }, { opacity: 0.35 }, 0)
        .add(onCovered, COVER_S + PANEL_LAG)
        .fromTo(mark, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.3)
        .add(trickleRule, 0.3);
    });

    /** Another page chosen while the curtain lifts: run the lift backwards, then go. */
    const recover = contextSafe(() => {
      const tl = revealTl;
      if (!tl) return;
      phase = 'covering';
      html.dataset.transition = 'covered';
      window.dispatchEvent(new Event('page-transition-cover'));
      navTween?.progress(1);
      revealTl = null;
      coverTl = tl;
      tl.eventCallback('onComplete', null);
      tl.eventCallback('onReverseComplete', onCovered);
      tl.reverse();
      // The line starts over for the new destination rather than standing full while it loads.
      trickleRule();
    });

    const navigate = (href: string) => {
      // Fetch the route while the curtain closes rather than after it lands.
      routerRef.current.prefetch(href);
      target = href;
      if (phase === 'idle') {
        savePosition(currentKey, window.scrollY);
        cover();
      } else if (phase === 'covered') {
        pushTarget();
      } else if (phase === 'revealing') {
        recover();
      }
      // Covering: the newest choice is pushed when the curtain lands.
    };

    api.current = {
      routeCommitted: () => {
        currentKey = pageKey();
        // Everything measured at its final layout and scroll, the persistent footer's trigger included.
        ScrollTrigger.refresh();
        if (phase !== 'covering' && phase !== 'covered') return;
        if (awaiting && trimSlash(seenPath.current) !== awaiting) return; // not the page the curtain is waiting for
        awaiting = null;
        if (phase === 'covered') scheduleLift();
        // Covering: onCovered lifts once the curtain lands.
      },
    };

    const onClick = (e: MouseEvent) => {
      // Leave modifier-clicks, middle-clicks, new-tab links and downloads to the browser.
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest?.('a[href]');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== '_self') return;
      if (anchor.hasAttribute('download')) return;
      const href = resolveTransitionTarget(anchor.getAttribute('href'), window.location, { samePath: phase !== 'idle' });
      if (!href) return;
      e.preventDefault();
      navigate(href);
    };

    const onLocaleNav = (e: Event) => {
      const href = (e as CustomEvent<string>).detail;
      const to = resolveTransitionTarget(href, window.location, { samePath: phase !== 'idle' });
      if (to) navigate(to);
      else if (href) routerRef.current.push(href);
    };

    const onPopState = () => {
      // Restoration is manual, so the page being left is still on screen at its own scroll: keep its place.
      savePosition(currentKey, window.scrollY);
      arrival.current = { kind: 'pop' };
      if (phase === 'idle') return; // placed before it paints; no curtain
      if (phase === 'revealing') { revealTl?.progress(1); return; } // finish the lift; the history page arrives as usual
      // Closing or closed: history takes over from the link that started the transition.
      target = null;
      cancelLift();
      const path = trimSlash(window.location.pathname);
      awaiting = path === trimSlash(seenPath.current) ? null : path;
      if (phase === 'covered' && !awaiting) {
        placePage();
        ScrollTrigger.refresh();
        scheduleLift();
      }
    };

    const onPageHide = () => savePosition(currentKey, window.scrollY);

    if (preloading) {
      // Curtain already down: hold it until the page is ready, then run the normal lift.
      phase = 'covered';
      coveredAt = performance.now();
      liftNav = true;
      gsap.set(overlay, { visibility: 'visible', pointerEvents: 'auto', opacity: 1 });
      // The wordmark appears only once its face has loaded, so it never shows in the fallback serif.
      (document.fonts?.ready ?? Promise.resolve()).then(contextSafe(() => {
        if (disposed) return;
        if (reducedMotion()) gsap.set(mark, { opacity: 1 });
        else gsap.fromTo(mark, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' });
      }));
      trickleRule();
      armTimeout(PRELOAD_TIMEOUT_MS);
      whenLoaded().then(() => {
        if (disposed || phase !== 'covered' || target || awaiting) return;
        // Fonts are in, so an anchor's position is final: place the page again, measure, then lift.
        const y = initialPosition();
        if (y != null) jumpTo(lenisRef.current, y);
        ScrollTrigger.refresh();
        scheduleLift(PRELOAD_HOLD_MS);
      });
    }

    // Capture phase: run before Next's <Link> handler on the React root, which would otherwise push the route itself
    // and mark the event as handled.
    document.addEventListener('click', onClick, true);
    window.addEventListener('page-transition-start', onLocaleNav);
    window.addEventListener('popstate', onPopState);
    window.addEventListener('pagehide', onPageHide);

    return () => {
      disposed = true;
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('page-transition-start', onLocaleNav);
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('pagehide', onPageHide);
      window.clearTimeout(timeoutId);
      cancelLift();
      api.current = null;
    };
  }, { scope: rootRef });

  // After the new page's own layout effects: measure, then lift when ready. Before paint, so a history navigation's
  // first frame is already final.
  useLayoutEffect(() => {
    if (seenPath.current === pathname) return;
    seenPath.current = pathname;
    api.current?.routeCommitted();
  }, [pathname]);

  return (
    <div ref={rootRef} className="contents">
      <main ref={mainRef} id="main" tabIndex={-1} className="min-h-dvh focus-visible:outline-none">
        <BeforePage onRoute={placePage} />
        {children}
      </main>

      <div
        ref={overlayRef}
        data-curtain
        aria-hidden="true"
        className="fixed inset-0 z-9999 invisible pointer-events-none"
      >
        {/* Dims the page being left as the panels rise over it. */}
        <div ref={veilRef} className="absolute inset-0 bg-ink opacity-0" />
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
              {WORDMARK}
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

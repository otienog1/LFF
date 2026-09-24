import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { whenRevealed } from './transitionGate';
import { cascade } from './presets';

/** How long a first-screen entrance waits once the curtain lifts, so the hero's photograph and heading lead. */
const AFTER_HERO = 0.9;
/** The wait when the page opens away from its hero (an anchor, a kept position): just until the curtain clears. */
const AFTER_LIFT = 0.3;

/**
 * Runs `play(delay)` once, as `trigger` passes `start`. The delay puts the entrance in the page's order. Arriving with
 * other entrances, it cascades (see `cascade`). Arriving under the page transition's curtain, which is how the first
 * screen of every new page arrives, it waits for the lift and then for the hero to lead, so a page always opens
 * photograph first, then heading, then the rest, and nothing plays unseen beneath the curtain. The ScrollTrigger is
 * returned so it lives and dies with the caller's GSAP context.
 *
 * Callers create their tweens in `play` through the gsap.matchMedia callback's own context, `(d) => context.add(...)`,
 * never through useGSAP's `contextSafe`. ScrollTrigger runs this callback inside the context that created it (the
 * matchMedia one); a contextSafe function from the outer useGSAP context called there registers the outer context
 * inside the inner one, and the two then revert each other without end when the component unmounts.
 */
export function onArrival(trigger: Element, start: string, play: (delay: number) => void): ScrollTrigger {
  return ScrollTrigger.create({
    trigger,
    start,
    once: true,
    onEnter: () => {
      if (document.documentElement.dataset.transition !== 'covered') {
        play(cascade());
        return;
      }
      const opening = window.scrollY < window.innerHeight * 0.5;
      whenRevealed().then(() => {
        if (trigger.isConnected) play((opening ? AFTER_HERO : AFTER_LIFT) + cascade());
      });
    },
  });
}

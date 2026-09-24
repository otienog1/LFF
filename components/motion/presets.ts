/**
 * The site's motion vocabulary. Every one-off entrance draws on these, so the same kind of element always arrives
 * the same way: text rises out of a mask, a block fades up a short way, a photograph unmasks and settles, a rule
 * draws in. The page transition's curtain and the scroll-linked moves (parallax drift, the scrubbed statement, the
 * programme wipes) keep their own curves: they follow the route or the scroll rather than arriving once.
 *
 * Each helper returns a fresh object. GSAP writes into the vars it is given (parent, startAt, immediateRender), so a
 * shared object would carry one tween's settings into the next.
 */
type Vars = gsap.TweenVars;

/** Text (a heading's words, a quote's lines, a figure) starts below its mask. 110% clears every mask on the site. */
export const riseFrom = (): Vars => ({ yPercent: 110 });
/** ...and rises into it. */
export const rise = (vars: Vars = {}): Vars => ({ yPercent: 0, duration: 1.1, ease: 'power4.out', ...vars });

/** A block (a paragraph, a caption, a chapter mark) starts faded, a short way down... */
export const fadeFrom = (): Vars => ({ opacity: 0, y: 16 });
/** ...and fades up into place. */
export const fade = (vars: Vars = {}): Vars => ({ opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', ...vars });

/** Something whose size or place is the information (a framed photograph, the hero's corner notes) only fades in. */
export const appear = (vars: Vars = {}): Vars => ({ opacity: 1, duration: 0.8, ease: 'power3.out', ...vars });

/** A photograph unmasking inside its frame (pass the clip-path it opens to). */
export const unmask = (vars: Vars = {}): Vars => ({ duration: 1.3, ease: 'power3.out', ...vars });
/** A photograph settling from a slight zoom to rest, under or after its unmask (pass the resting scale). */
export const settle = (vars: Vars = {}): Vars => ({ duration: 2.2, ease: 'power2.out', ...vars });

/** A hairline or a progress fill drawing in from the left (pass the scaleX it draws to). */
export const draw = (vars: Vars = {}): Vars => ({ duration: 0.9, ease: 'power3.out', ...vars });

export const STAGGER = {
  /** Words of a heading. */
  words: 0.06,
  /** Lines of a quote or statement. */
  lines: 0.12,
  /** Blocks in a sequence: paragraphs, footer columns, a chapter's parts. */
  blocks: 0.1,
  /** Photographs arriving as a pair. */
  frames: 0.15,
} as const;

let lastEntry = -Infinity;
let chain = 0;

/**
 * Extra delay for an element arriving in the same moment as others (a row of cards, list rows entering together, a
 * screenful revealed as the curtain lifts): each one after the first waits one block stagger more, up to four. An
 * element arriving on its own starts at once, however far down its list it sits.
 */
export function cascade(): number {
  const now = performance.now();
  chain = now - lastEntry < 60 ? Math.min(chain + 1, 4) : 0;
  lastEntry = now;
  return chain * STAGGER.blocks;
}

/** Where an entrance starts, as a ScrollTrigger start line. */
export const START = {
  /** Most elements: as their top passes 85% of the viewport. */
  block: 'top 85%',
  /** A chapter's sequence (mark, lines, rule, attribution) starts a little later, so all of it plays in view. */
  chapter: 'top 75%',
  /** Small things low on the screen: rules, progress, ledger rows, the footer's columns. */
  detail: 'top 90%',
  /** A caption or description that should arrive with the element above it rather than a beat after. */
  follow: 'top 95%',
} as const;

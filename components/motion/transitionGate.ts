/**
 * Resolves once the page transition curtain has started to lift, or at once
 * when the page was not reached through a transition (hard load, back/forward).
 * Resolves `true` when it had to wait, so a load sequence can pace itself to
 * the curtain.
 */
export function whenRevealed(): Promise<boolean> {
  if (typeof document === 'undefined' || document.documentElement.dataset.transition !== 'covered') {
    return Promise.resolve(false);
  }
  return new Promise((resolve) => {
    window.addEventListener('page-transition-reveal', () => resolve(true), { once: true });
  });
}

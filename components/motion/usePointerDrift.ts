'use client';
import type { RefObject } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * Leans an element a few pixels toward the pointer while it moves over a
 * section, with an eased follow (never 1:1), and returns it to rest when the
 * pointer leaves or the window blurs. Fine pointers only, nothing under
 * prefers-reduced-motion, and the loop runs only while there is somewhere to
 * go, so nothing ticks while the section is off screen or the pointer is still.
 */
export function usePointerDrift(
  section: RefObject<HTMLElement | null>,
  selector: string,
  strength = 14,
) {
  useGSAP(() => {
    const el = section.current;
    if (!el) return;
    const target = el.querySelector<HTMLElement>(selector);
    if (!target) return;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)', () => {
      let tx = 0, ty = 0, cx = 0, cy = 0, running = false;
      const tick = () => {
        cx += (tx - cx) * 0.08;
        cy += (ty - cy) * 0.08;
        if (tx === 0 && ty === 0 && Math.abs(cx) < 0.05 && Math.abs(cy) < 0.05) {
          cx = 0; cy = 0; running = false;
          gsap.ticker.remove(tick);
        }
        gsap.set(target, { x: cx, y: cy });
      };
      const wake = () => { if (!running) { running = true; gsap.ticker.add(tick); } };
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * strength;
        ty = ((e.clientY - r.top) / r.height - 0.5) * strength;
        wake();
      };
      const rest = () => { tx = 0; ty = 0; wake(); };
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', rest);
      window.addEventListener('blur', rest);
      return () => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', rest);
        window.removeEventListener('blur', rest);
        gsap.ticker.remove(tick);
        gsap.set(target, { x: 0, y: 0 });
      };
    });
  }, { scope: section });
}

import { createContext, useContext } from 'react';
import type Lenis from 'lenis';

/**
 * The page's Lenis instance: null until it has started, and for good under
 * prefers-reduced-motion, where the page scrolls natively. Its own module so
 * the layout's children (the page transition among them) can read it without
 * importing the layout that renders them.
 */
export const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

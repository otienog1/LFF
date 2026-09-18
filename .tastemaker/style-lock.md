# Style lock: Luigi Footprints Foundation

Locked 17 September 2026 from the site's existing identity (not a cold start). Change only on an explicit request.

## Mood and thesis

Elegant, editorial. A foundation's annual report set as a printed grid: numbered chapters, hairline column rules at the container edges, photographs at real scale, three type sizes, nothing decorative that is not information.

## Tokens (styles/globals.css)

- Colour: `--color-paper #FAF8F4`, `--color-paper-deep #F1ECE3`, `--color-ink #141414`, `--color-ink-soft #565049`, `--color-line #E3DDD1`, `--color-green #1E5631`, `--color-green-deep #163F24`, `--color-green-light #6BB585`.
- Type: display Fraunces (`--font-display`), body Inter (`--font-body`). Scale: hero `clamp(2.5rem, 5.6vw, 6rem)`; `display-1` up to 4.5rem (figures); `display-2` up to 3.25rem (chapter heads); index titles up to 2.5rem; opening lede up to 1.875rem; eyebrow 11px / 0.22em tracking, uppercase, weight 600.
- Motion: `--ease-out cubic-bezier(0.23, 1, 0.32, 1)`, `--ease-in-out cubic-bezier(0.77, 0, 0.175, 1)`, `--ease-drawer cubic-bezier(0.32, 0.72, 0, 1)`. Engine GSAP + ScrollTrigger; Lenis for smooth scroll, off under reduced motion.
- Grid: `container` widths 768 / 1024 / 1200 / 1440 / 1536 by breakpoint, mirrored in `--container-w`; column rules drawn by `Chapter`; `bleed-right` lets one grid item run to the viewport edge at `xl`.

## Colour contract (check_contrast.py --matrix, 17 Sep 2026)

- Text-safe (>= 4.5): ink/paper 17.4, ink/paper-deep 15.7, green/paper 8.2, paper/green 8.2 (button), green/paper-deep 7.3, green-light/ink 7.5, ink-soft/paper 7.5, ink-soft/paper-deep 6.8, paper 70% on ink 8.9, paper 70% on green 4.9.
- UI-safe (>= 3.0): green/green-light 3.5.
- Decorative only: green-light on paper 2.3, line on paper 1.3, paper 40% on green 2.7 (never for text; the statement band's meta line moved to 70%).

## Density and spacing

Chapters `py-20 md:py-28 lg:py-36`. Grid gap `gap-x-8`. Index rows `py-8 md:py-10`. Figures `gap-y-10`. Card and row internal padding never exceeds the gap around it.

## Assets

Only the foundation's own photographs, as listed in `data/data.json`, with their honest alt text. No stock, no generated people, no illustrations. Icons: lucide (site-wide family). No logo wall: no verified partner list exists.

## Do not

- Do not add a photograph to Community enterprise until the foundation supplies one; none in the pool shows that programme.
- Do not reintroduce testimonials, partner names or donation tiers without the foundation's confirmation.
- Do not raise display sizes above the hero's 6rem ceiling.
- Do not add a second motion engine, a second smooth-scroll engine, or a shader background.
- Do not restyle the shared interior blocks from the home page; new home sections are separate components.

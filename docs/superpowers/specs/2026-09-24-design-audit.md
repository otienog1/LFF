# Design and UX audit, 24 September 2026

Audited on the running dev server at 1440×900, 1280×800, 1024×768, 834×1112 and 390×844, against `.tastemaker/style-lock.md` and the owner's resolved decisions in `.tastemaker/decisions.log`. Findings as found come first, then the ranked list with what was done, what was left and why, and the final review.

## Findings as found

### Home
- Lede drop cap: the narrow initial "I" sits a full gutter away from "n the heart", so the first word reads as two.
- Belief spread: photograph 755px tall beside a 593px text column. Breaks the standing rule that a spread's photograph matches its text column.
- Numbers: the 3:4 photograph ends 260px above the text column, leaving an empty block under it. Same rule.
- Invitation portraits: the two photographs drift at different rates and rest a few pixels out of line with each other, which reads as an accident rather than a stagger.
- Footer tagline names only Amboseli ("and beyond"); every other surface names all three landscapes. Header wordmark says "The Luigi Footprints Foundation", footer says "Luigi Footprints Foundation".
- Back to top: hard-coded English label; a rounded, shadowed circle is the only soft widget on a flat hairline site.

### About, Our Work, Projects, Impact, Get Involved, Donate, Contact, 404
- About hero, Projects hero and every interior photograph hero: the transparent header sits over the brightest part of the photograph; the hero shade only darkens toward the bottom, so the nav links lose contrast (worst on About's vehicle and trees).
- About Legacy spread: photograph 604px beside 565px of text. About elephant spread: photograph 604px beside 730px. Same rule.
- About quote: the opening quotation mark sits inside the text edge, indenting "Protecting" against the lines below.
- Our Work: field-project rows show the grey placeholder; the restoration programme does not link the Olchani Project (which it is), education does not link Scholarships, enterprise does not link The Elephant Den.
- Projects archive: the first two rows are six wireframe boxes (crossed lines, camera icon); nine of eighteen cards in all. The same box fills project heroes at 82svh (Olchani, Scholarships, ...), where the white wordmark and nav sit on light beige and become unreadable, and donate cards and the donate ledger's sticky frame.
- Project hero date shows a day the record does not support ("15 May 2021", a guessed day; "1 January 2021" for a year-only date).
- Project write-ups drop inline emphasis: the copy sets species names (Rhizophora mucronata) and titles in italics and names in bold; the page renders plain text.
- Donate and Contact keep the header solid from the first frame ("light background at the top"), a rule from before both pages opened on photographs.
- Donate cards: "Give to this project" sits at a different height in each card of a row; the progress label is a long all-caps sentence that wraps and orphans "PARK".
- Display headings end on one orphaned word across the site ("it.", "wildlife.", "with.", "mind.").
- Contact headline sets "We'd" with a straight apostrophe at display size.
- Impact emergency spread: a 687px-wide photograph stretched to a 978px frame shows its low resolution. Supply issue, not layout.
- 404: the chapter's column rule runs up behind the transparent header and cuts through "Luigi" in the wordmark.
- Back to top disappears on ink sections (ink circle on ink), leaving a floating arrow.
- Neither the desktop nav nor the mobile menu marks the current page.

### Responsive
- 768 to about 1150px: the desktop nav is shown and does not fit. The wordmark wraps to two lines and "Our Work", "Get Involved" and "Donate" wrap. Breaks gate 26 on every tablet and small laptop.
- 390px: no horizontal scroll anywhere checked. Menu button is 24×24 and footer links 29px tall, under the 44px target.
- Drop-cap gap is worse at 390px ("I" then "n the heart" a full column apart).

## Implementation plan (in order; tick as done)

Progress (24 Sep): steps 1 to 12 implemented. Also fixed: Spanish nav "Partícipa" to "Participa" (messages/es.json); ink-hero column rules start below the header (top-16 xl:top-24); quote lines balanced in About Words. Typecheck clean, 30 tests green, slop scan clean.

Verified in the browser so far: 1024 header is wordmark + 44px menu button on one line with the top shade over the About photo; 1280 EN and ES nav on one line, current page underlined; ES archive plates (label + excerpt) replace the wireframes; Olchani project page opens on ink with "May 2021" and keeps em/strong; home Belief 593/593 and Numbers 750/750; About Legacy 565/565 and Namesake 730/730; hanging quote aligns "Protecting" with the lines below; drop cap gap now 15px.

Still to verify: donate cards (CTA row alignment, progress label), a cause ledger with a pending plate, 404 rules, mobile 390 (menu button, footer links, plates in rows), reduced motion, sibling production build. Then: decisions.log pending-review entries, style lock note (text-wrap, pending plates, nav breakpoint), final gate review.

1. Pending photographs: `components/shared/PendingPhoto.tsx` (plate: paper-deep, hairline, "Photograph to come" from the alt text's lead, optional excerpt in Fraunces). Used by `Photo` (archive cards get the project excerpt, cause cards get none), `FieldProjects` rows (size row), `ItemLedger` (size panel; figcaption hidden for pending). `InteriorHero` treats a pending image as none: ink hero at 64svh with the chapter column rules.
2. `InteriorHero`: top scrim so the transparent nav reads over any photograph.
3. Navbar: desktop links from `xl` (hamburger below); `aria-current` + drawn underline on the current page, full paper in the mobile menu; menu button 44px; drop the stale `alwaysSolid` for /donate and /contact.
4. Spreads take the row's height on large screens: home Belief, home Numbers (photo cols 8-12), About Legacy, About Namesake.
5. Type: `text-wrap: balance` on display headings (SplitHeading, display-1/2/3, InteriorHero h1), `pretty` on body-lg; typographic apostrophes and quotes in display headings (`lib/typeset.ts`); hanging opening quote in About Words; drop cap margin for narrow initials.
6. Project pages: hero date month + year (year only when `datePrecision: "year"`, set on the mangroves); write-ups keep inline emphasis (strong/em) from `parseWpContent`.
7. Donate cards: CTA pinned to the card foot; progress label sentence case.
8. PortraitPair: `items-start` so the documented stagger shows.
9. Back to top: square hairline paper button, localized label.
10. Footer: links 44px tall below lg; tagline names all three landscapes (en/es/pt messages).
11. Our Work field rows: restoration leads with the Olchani Project; education adds Scholarships; enterprise adds The Elephant Den.
12. 404: column rules start below the header.
13. Verify: typecheck, tests, sibling build, browser at 1440/1280/1024/834/390, ES/PT nav at 1280, reduced motion.

## Pass 2 (24 Sep): the owner's notes and the motion audit

### Owner's notes, done
- The footer wordmark reads "The Luigi Footprints Foundation". One `WORDMARK` constant (lib/site.ts) now sets the header, the footer, the transition curtain and the home page's green-band caption; the English legal line follows. `SITE_NAME` (page titles, Open Graph) is unchanged.
- Contact is in the main nav after Get Involved, on desktop and in the menu. At 1280 the row still fits on one line in EN, ES and PT (Spanish is tightest, 54px between the wordmark and the first link). Portuguese spelled it "Contacto" (European); now "Contato" and "Entre em contato", like the rest of the Brazilian copy.
- No dashes in shipped copy. 33 sentences (18 project write-ups and excerpts, the Elephant Den donate summary, Peter Karanja's bio) rewritten in English and in the ES/PT tables of scripts/locale-copy.py, then regenerated with 0 strings left in English. Numeric ranges keep their en dash. No em dash or spaced en dash remains in data (three languages) or messages.

### Motion audit: what the traces showed
Every frame of a click navigation was recorded (curtain panels, `<main>` opacity and transform, header, scroll, hero image), on the dev server and on a production export.
1. The flicker. The new page was uncovered while `<main>` was still fading in from opacity 0: 38% with 80px uncovered, 63% at 286px, 80% at 660px, full only about 100ms after the curtain had gone. Every page opens on a dark hero, so each lift went dark curtain, washed-out grey page (the paper behind it showing through), dark page. A staged frame shows it.
2. The curtain lifted after a fixed 320ms hold, not when the hero photograph was ready, so an uncached photograph popped in after the lift.
3. Back/forward faded the page from 0 in an effect that runs after the first paint (one frame at full opacity, then nothing, then the fade) and landed at an arbitrary scroll: Our Work at 1,438, back, About at 5,362.
4. The new page's scroll triggers measured while `<main>` still carried the cover's transform (-56px) and the old page's scroll, so first-screen entrances played unseen under the curtain. The same transform broke `position: fixed` inside `<main>`: the pinned programme column vanished as the cover began.
5. A click during a transition was swallowed. Anchor links opened at the top and jumped to the section a second after the lift (a 1,000ms timer).

### Fixes (PageTransition, Layout, SmartImage, globals.css)
- The page is never faded or moved. The curtain lifts off a complete page at rest, and the page's own entrance carries the motion: photograph, heading, subtitle, then the rest. The page being left dims under a veil inside the curtain instead of fading toward paper.
- The lift waits for the route and the decode of the first screen's photographs, capped at 1.2s. A photograph still on its way after the cap fades in when it lands instead of popping in.
- The line under the wordmark is the curtain's loading line. It draws most of the way across while the page loads; once the page is ready it finishes, the wordmark lifts off during its last quarter, and the panels follow. Owner's report after the first fix: on fast pages the curtain rose, stopped for a split second with the line a quarter drawn, then rose again. Measured: 351ms at rest with the line at 26%. Now the line is full at every lift and nothing in the curtain stands still after the page is ready (longest still moment 0 to 30ms, was 100 to 300).
- Each page is placed (top, anchor, or its kept position) before its own effects run, by a component rendered ahead of it in `<main>`, so its triggers measure at the final scroll. ScrollTrigger refreshes under the curtain, not after the lift.
- Scroll restoration is the site's own: positions kept per page for the session. Back/forward returns to the exact place with no curtain, placed before the first paint; a reload restores under the curtain; a deep link opens on its anchor.
- Header changes made under the curtain land at once, so it never lifts on a 300ms fade in progress.
- Rapid navigation: a click while the curtain closes replaces the destination, one while it is down goes at once, one while it lifts runs the curtain back down and then goes. The destination is prefetched at the click; the mobile menu closes as the curtain starts.
- Timing: cover 0.65s + 0.08s lag (was 0.75 + 0.09); no fixed hold (was 320ms), the line's finish (0.12 to 0.42s, from wherever it stands) is the beat; the wordmark leads the panels by 0.08s; lift 0.75s (was 0.8 plus a 0.9s page fade).

### Consistency
- One vocabulary, components/motion/presets.ts: `rise` (text out of its mask from 110%, 1.1s power4.out; words 0.06s apart, lines 0.12), `fade` (16px, 0.8s power3.out), `unmask` (1.3s power3.out), `settle` (2.2s power2.out), `draw` (0.9s power3.out), and four start lines (block 85%, chapter 75%, detail 90%, follow 95%). Before: text rose over 1.1 or 1.2s from 105% or 110%; blocks faded 12, 16 or 20px over 0.6 to 0.9s on two eases; photographs unmasked over 1.2 to 1.4s on two eases; eight different start lines.
- Index delays are gone. Row 10 of a write-up used to wait 0.6s after scrolling into view; now elements arriving in the same moment step 0.1s apart and one arriving alone starts at once (`cascade`).
- First-screen entrances wait for the lift and follow the hero by 0.9s (`onArrival`, components/motion/arrive.ts), so every page opens in the same order.

### Performance
- No standing `will-change` on split words and figures (a compositor layer per word before); GSAP promotes each only while it moves.
- The home scroll cue's loop pauses once the cue has faded; the ticker already stopped off screen.
- One ScrollTrigger refresh per route, under the curtain; Lenis is re-measured before each placement.

### Verified (production export, 1440×900 unless noted)
| Check | Result |
|---|---|
| Click navigation, cached hero | Lift 120ms after the route commits; photograph decoded; `<main>` at opacity 1, no transform, every frame |
| Click navigation, Slow 4G, uncached hero | Lift at the 1.5s cap of that build (now 1.2s); photograph faded in on arrival, no pop |
| Hero order after the lift | Title rises at +0.3s, subtitle at +0.8s, first-screen text below the hero after both |
| Rapid clicks (closing, down, lifting, back while closing, back to the page being left) | The curtain lifted only on the final destination each time |
| Back / forward | Exact positions (Home 0 and 2,100, Our Work 4,456), one frame, no curtain |
| Reload | Curtain from the first frame, page restored at 2,100 before the lift |
| Deep link and cross-page anchor | Section at its 96px scroll margin at the lift, no later jump |
| Mobile menu, 390px | Contact listed; menu gone before the curtain closes; lands on Contact |
| Reduced motion | Curtain fades only, Lenis off, nothing left hidden on five pages scrolled end to end |

### Found on the way
- A GSAP context cycle, `contextSafe` from useGSAP called inside a ScrollTrigger callback created in `gsap.matchMedia`, crashed a page on unmount ("Maximum call stack size exceeded"). Those tweens are now created through the matchMedia context; the reason is written in arrive.ts.

## Ranked findings and what was done

Critical
1. Header broke between 768 and about 1150px (wordmark and labels wrapping). Desktop nav now from 1280px; menu button below. Verified at 1024, 1280 (EN and ES), 390.
2. Wireframe placeholders (crossed lines, camera) on 9 of 18 archive cards, field rows, donate cards and the donate ledger, and at 82svh as project and cause heroes, where the white nav became unreadable. Replaced by catalogue plates; heroes without a photograph open on ink. Verified on the EN and ES archive, Olchani project page, Ubuntu Hay cause page, Our Work rows at 390.
3. Transparent nav over bright interior photographs (About, Projects). Top shade on interior heroes. Verified at 1024.

Major
4. Four spreads broke the photo-equals-text rule. Now exact: Belief 593/593, Numbers 750/750, Legacy 565/565, elephant chapter 730/730.
5. Donate and Contact solid from the first frame. Now transparent like every page.
6. One-word orphans in display headings site-wide. Balanced display type, pretty body text.
7. No current-page cue in the nav or menu. Drawn underline plus aria-current.
8. Touch targets under 44px (menu 24px, footer links 29px, email 33px, wordmark 28px). All 44px.
9. Project heroes showed days the record does not support. Month and year; year alone for the mangroves.
10. Write-ups dropped italics and bold (species names, campaign titles). Kept through a strict inline filter.
11. Back to top invisible on ink, English-only. Square paper button, localized.

Minor
12. Drop cap gap for "I". 13. Straight apostrophes in display type. 14. Quote mark inside the text edge. 15. Donate card links out of line, progress label wrapping. 16. Invitation portraits' stagger cancelled by items-end. 17. Footer tagline named one landscape. 18. Our Work rows missed their own projects. 19. 404 rule through the wordmark. 20. Spanish "Partícipa". All fixed.

## Not changed, and why

- Low-resolution photographs (Impact emergency response, Donate hero crop) and the Dignity House portrait repeated on four pages: the foundation's photographs; the owner will replace them and asked that they not be cropped or zoomed to hide flaws.
- Em dashes in the project copy, Contact in the primary nav and the header/footer naming were left for the owner in pass 1; the owner decided all three and pass 2 carried them out (above).
- Legacy block components under `components/blocks/` are unused; left in place rather than deleted unasked.

## Final review against the brief

1. Hierarchy: one hero headline, chapter numerals, balanced display heads; nothing in a chapter competes with its heading.
2. Identity: paper, ink and green, Fraunces over Inter, hairline column rules and numbered chapters, unchanged and now carried into the photo-less heroes and plates.
3. Connection: every page opens the same way (transparent header, hero or ink opener) and closes on the same invitation and footer.
4. Type and spacing: orphans gone, typographic quotes, hanging punctuation, drop cap spacing, dates at honest precision.
5. Interaction: current page shown, 44px targets, card links aligned, focus rings unchanged.
6. Mobile: no horizontal scroll at 390, the menu from 1280 down, plates and rows checked at 390.
7. Generic or unfinished: the wireframe placeholders were the one templated moment; replaced.
8. Inconsistencies left: none of the owner's; the wordmark and Contact were settled in pass 2.
9. Motion: one vocabulary and one entrance order across every page (pass 2); the transition lifts off a finished page; reduced motion verified (curtain fades only, Lenis off, nothing left hidden).
10. Art direction: the site reads as one printed grid; the fixes remove the places where it read as components.

### Code scans
- `components/blocks/*` (HeroBlock, BlockRenderer, ContentBlock, CardsBlock, ImpactBlock, TeamBlock), `about/LuigiPanel`, `ui/Section`, `ui/Eyebrow`: not imported by any route. HeroBlock carries em dashes and `h-screen`; none of it ships.
- `--ease-in-out` token is named like the browser keyword but is a strong custom curve; fine. `scale(0)` hits are `scaleX(0)` line draws; fine.

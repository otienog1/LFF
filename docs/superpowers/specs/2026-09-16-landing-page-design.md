# Landing page: hero and belief

Date: 2026-09-16. Scope: the home page only (`/`, `/es`, `/pt`). Interior pages and their blocks are untouched.

## Brief

Raise the landing page's craft while keeping the existing identity: the Editorial Mono palette (paper, ink, green), Fraunces for display and Inter for body, the current copy in all three languages, and the site's own photographs. The page stays data-driven from `data/data.json` and its Spanish and Portuguese mirrors.

A first pass restaged every section (pinned horizontal programmes, a numbers ledger, a project strip, a gutter trail). After review the owner kept only the hero and the belief section; the programme cards, numbers grid, green statement and invitation were restored as they were.

## Sections

1. **Hero** (`HomeHero`). Full-bleed photograph. The headline is set to run two lines at desktop width and its words rise out of a mask on load while the photograph eases from a slight zoom to rest; the subtitle and button follow beneath the headline on the left. On scroll the photograph drifts slower than the page and darkens. The ticker remains beneath.
2. **Belief** (`Belief`). The original two-column editorial row (text left, photograph right) with the statement revealed word by word as the reader scrolls through it.
3. Programme cards, numbers grid, green statement and invitation: existing blocks, unchanged.

## Motion rules

- One orchestrated hero sequence on load. It waits for the page transition's reveal when the visitor arrives via the curtain; the transition emits a `page-transition-reveal` event and sets `data-transition` on the root element while covered.
- Reduced motion disables the hero sequence, the parallax and the word reveal via `gsap.matchMedia`; content renders static.
- Lenis feeds `ScrollTrigger.update` so scrubbed motion stays in sync.

## Files

- New: `components/home/HomeHero.tsx`, `components/home/Belief.tsx`, `components/motion/transitionGate.ts`.
- Changed: `app/(en)/page.tsx`, `app/[locale]/page.tsx`, `components/layout/PageTransition.tsx`, `components/layout/Layout.tsx`.

## Verification

Headless Chrome captures at desktop and phone widths plus a reduced-motion pass. Typecheck and vitest stay green.

## 17 September 2026: craft pass (audit, motion, accessibility)

Scope unchanged: the same sections in the same order, the Editorial Mono look, the same copy in all three languages. The page was audited against the tastemaker gate list first; the fixes below answer that audit.

### Sections

- **Hero.** The photograph rests at 1.03 scale and, on a fine pointer only, leans up to 14px toward the cursor (eased follow, never 1:1; returns to rest on leave and window blur; the loop stops itself once settled). The button's arrow slides 4px on hover. The headline carries `aria-label`; the split word spans are `aria-hidden`.
- **Introduction.** The drop cap rises out of a mask and the paragraph follows, once, when the section reaches 78% of the viewport. The full text is also present as screen-reader-only copy so the initial is not read as a separate letter.
- **Ticker.** Runs only while on screen and the tab is visible; static under reduced motion; `aria-hidden`.
- **Belief.** Word scrub floor raised to 0.22. The photograph is unmasked top to bottom once as it arrives, then drifts 5% either way at 1.12 scale while in view.
- **Programmes.** Each card is its link (the data always carried one). On hover and keyboard focus the title turns green and an arrow slides in at the top right; the whole card takes the green focus outline.
- **Numbers.** Descriptions follow the figures with a short delay; the block's call to action ("More about our impact") is rendered.
- **Statement band.** The two lines rise from masks, light line then bold, the rule draws, the meta line fades. Eyebrow and meta line sit at paper/70 (4.9:1 on green). Type capped at 6rem, the hero's ceiling.
- **Invitation.** The two portraits are unmasked with a 150ms stagger, then drift at different rates (20px and 44px) as the section passes.

### Chrome and foundation

- Nav links draw an underline on hover and focus. A skip link targets `#main`.
- Buttons press to 0.98 and transition named properties only. The `link` variant now draws only its bottom rule (the base 1px border had made it a box). The mobile sheet uses the drawer curve at 300ms.
- `globals.css` rebuilt: shadcn tokens mapped onto the palette (ring and primary are green, border and input are the hairline colour), `overflow-x: clip` on html and body, motion tokens (`--ease-out`, `--ease-in-out`, `--ease-drawer`), and the legacy block removed (unused Verlag, Berkeley and Goudy `@font-face` rules, noise and grain animations, `.list__item`, `.icon-scroll-line`, `transition: all`). The global `p { margin: 1rem 0 }` is kept on purpose; layouts were built on top of it.
- Lenis is not created under `prefers-reduced-motion`; native scroll is used and back-to-top falls back to window scroll. ScrollTrigger refreshes once webfonts have loaded.

### Motion rules

Every entrance plays once. Scrubbed motion is limited to parallax and the belief statement. Every animation branches on `prefers-reduced-motion` through `gsap.matchMedia`, and pointer-driven motion is created only under `(hover: hover) and (pointer: fine)`. Nothing animates while off screen.

### Verification

`yarn tsc --noEmit` and vitest green. Puppeteer captures at 1440 and 390 with a scroll-through, a reduced-motion pass, hover and focus frames, and a smoke run over every page at both widths (no console errors, no horizontal overflow). The production build was not run in-session because it would write to the `.next` directory the running dev server uses.

## 17 September 2026, pass 2: the editorial chapter grid

The owner reviewed the first pass and asked again for an Awwwards-standard design: the motion was right, the design had not moved. This pass is the redesign, built with the build-awwwards-quality-sites skill (direction, hero, motion system, validation), tastemaker (audit gates, asset honesty) and the animate skill (motion decisions). It is additive: the new sections live in `components/home`, the two home page files switch to them, and the shared `CardsBlock` and `ImpactBlock` stay in place for the interior pages. The previous versions of the replaced home files are in the session scratchpad under `backup-pass1`.

### Direction contract

- **Visual thesis.** A foundation's annual report, set as a printed grid: numbered chapters, hairline column rules at the container edges, photographs at real scale, three type sizes, and nothing decorative that is not information.
- **Hero focal asset.** The foundation's own photograph of the community handover. It opens from a framed inset to full bleed on load; a hairline frame carries two corner notes (location, ecosystems) and a scroll cue sits on the container's right edge, level with the button.
- **Type.** Fraunces at 6rem for the hero, 3.25rem for chapter heads, 2.5rem for index titles and 1.875rem for the opening lede; Inter for body copy; 11px tracked labels paired with Fraunces numerals.
- **Colour.** Paper, paper-deep, ink, green. Green is reserved for numerals, rules, the drop cap, buttons and the statement band.
- **Sequence.** Hero, 01 Opening, marquee, 02 Belief, 03 Programmes index, 04 Numbers, 05 Statement, Invitation, footer.
- **Motion narrative.** The frame opens and the words rise; chapter heads split-reveal; index rows stagger in; figures rise from their masks; the band's lines rise; the portraits unmask. Every entrance plays once. Scrubbed motion is limited to parallax and the belief statement. Pointer effects exist only on fine pointers. Everything renders in its final state under reduced motion.
- **Smooth scroll.** Lenis alone, not created under reduced motion. **Three.js:** none; the photography carries the page and a shader would compete with it.
- **Assets.** Only the foundation's photographs from `data.json`. Icons stay on lucide, the site's existing family, rather than switching the home page to Solar; one icon set across the site matters more than the skill's default.

### Sections

- **Hero.** Frame and corner notes at `xl` and up, scroll cue from `md`. The redundant "Luigi Footprints Foundation" eyebrow is gone; the nav wordmark already says it.
- **01 Opening.** The lede is set in Fraunces light with a green drop cap, on the right eight columns, with the chapter numeral on the left three.
- **Marquee.** The word ticker is now set in Fraunces, translated in all three locales, and hidden from assistive technology. First shown at up to 2.25rem; the owner asked for it smaller, so it runs at up to 1.25rem.
- **02 Belief.** Text on six columns, the photograph on five at 4:5, bleeding to the viewport's right edge on wide screens: the page's one deliberate rule-break.
- **03 Programmes.** A numbered index instead of four text cards: numeral, title, description and arrow on one baseline, each row its link, hairlines between rows, a warm tint on hover that runs rule to rule.
- **04 Numbers.** Two by two figures, the block's call to action, and the classroom photograph beside them. A count-up was tried first; the owner did not like the way the figures appeared, so they rise out of masks as in the first pass.
- **05 Statement.** As before, framed by the grid.

### New strings

`messages/*.json` gained a `home` namespace: `meta`, `scroll`, `ticker`, in English, Spanish and Portuguese. `data.json` gained an image on the `home-impact` block; `data.es.json` and `data.pt.json` were regenerated with `scripts/locale-copy.py` (no strings left in English).

### Validation

`yarn tsc --noEmit` and vitest green. Puppeteer captures at 1440 and 390 with a scroll-through; per-section frames; hover, focus and press probes; a reduced-motion pass and a JavaScript-disabled pass (all headings keep their accessible names, all figures render as their final values). No console errors, no horizontal overflow. Production build: `yarn build` passed (59 static pages generated, export complete) in a temporary copy of the project placed beside it at `build/LFF-buildcheck`, since a build inside the project directory shares `.next` with the running dev server and corrupts it. A `distDir` environment override was tried first and did not take effect, so it was removed. The copy was deleted after the build.

## 17 September 2026, pass 3: first load, chrome motion, About page

### Site-wide

- **Curtain first on a hard load.** The root layout's head script marks the document `data-transition="covered"` before first paint, so the transition overlay is the first frame; without scripts the mark is never set and the page renders plainly. `PageTransition` holds the curtain until fonts, the first image in `main` and the load event have settled (minimum 900ms, cap 4s), then runs the same reveal as a client-side transition and dispatches the reveal event the hero sequences wait for. The curtain's wordmark appears only after the display font has loaded, so it never shows in the fallback serif. A CSS timer uncovers the page after 8s if scripts fail after marking.
- **Nav and footer motion, lightly.** The fixed nav settles in once with the first reveal and is otherwise still. The footer's three columns rise once as it arrives; its links draw the same underline as the nav.
- **Primary buttons on the home page** use the large size, 48px tall with a 13px label, per the owner. The nav's Donate keeps the ghost style another session gave it.
- **Drop cap** is a home-page signature only. `Lede` takes `dropCap`; every other page sets its opening plain.
- `ImageRef.focus` is an optional CSS object-position, applied by `SmartImage`, for crops that must keep a face; `focus` is structural in the locale script.

### About page

Additive, like the home page: new components under `components/about`, the two About routes switched, the old blocks left for other pages. Sequence: full-bleed hero at interior height with pointer drift (the frame and corner notes were tried and removed at the owner's request; they belong to the home hero only), 01 the opening paragraph, 02 the legacy with a square photograph bleeding left, 03 in his words, 04 what guides us as three statements in the display face, 05 the board as rows, then the shared invitation with two field photographs instead of trustee portraits repeated from the section above.

- **05 Board of Trustees.** One row per trustee: portrait left, stretched to the height of the text beside it on large screens, name, role and the full biography right. The drawer is gone with its missing dialog semantics; the biographies are the best copy on the site and now sit on the page. The owner will replace the portraits.
- **03 In his words.** First built as a split (small portrait left, quote right), then as a statement with a small byline portrait; the owner rejected both. Now the portrait is a panel the full height of the chapter, top edge to bottom edge, filling the right half of the viewport (the chapter's container is static on large screens so the panel positions against the section), unmasked from the left; the quote runs over its shaded left side, opening sentence light and closing sentence in weight, with the attribution under a drawn rule beneath the text. On phones the quote overlaps the bottom of the photograph. The portrait is a 598px scan and reads soft at this size; the owner plans to replace the photographs.

### Validation

Typecheck and tests green after each step. First-load frames probed at intervals: document marked covered before hydration, headline words hidden under the curtain, curtain lifts between 2 and 5 seconds in dev, nav fades in with it; the same under reduced motion; client-side transition to About still works. About captured at 1440 and 390 in English and Spanish with no errors or overflow. Cross-page sweep clean.

### Later the same day

- About hero: frame and corner notes removed. Owner: "remove the bordered div and remove nairobi, kenya, amboseli ecosystem etc".
- Board of Trustees: each portrait is its own grid cell, so its height equals its own row's text and differs row to row; it arrives with a fade. A zoom to hide the cream border baked into Peter Mwangi Karanja's file was tried and removed: the owner will replace the photographs and does not want them altered to hide flaws. `ImageRef` keeps `focus` only.
- In his words: the portrait is a panel the full height of the chapter.

## 17 September 2026, pass 4: Our Work

Same skills and the same additive approach: new components under `components/our-work`, a shared interior hero under `components/shared`, both Our Work routes switched. The About hero moved to the shared `InteriorHero` and the About routes render their opening `Lede` themselves.

### Audit of the previous page

Static hero on the generic interior template; a sticky bar of pill chips (template chrome) whose smooth scroll silently did nothing under reduced motion; four identical image-and-text rows all in the same tone with an eyebrow on each; the field projects named in the data for every programme never rendered; the invitation centred, with its second link ("Get involved") dropped; a widowed "to" in its headline.

### Direction

- **Thesis.** The programmes volume of the same annual report: four chapters, 01 to 04, each a spread with the photograph running to the outer edge on one side and the text on the other, alternating sides and tones (light, deep) down the page.
- **Hero.** Full-bleed at interior height, no frame or corner notes, words rise, pointer drift.
- **Opening.** The lede on the right, and on the left, in place of the chip bar, the page's contents: the four programmes as numbered anchor rows. Clicking scrolls through Lenis, or natively under reduced motion; either way the chapter lands on its scroll margin below the fixed header, and the hash is recorded without a jump.
- **Chapters.** Chapter mark, split-reveal heading, body, then "From the field": the programme's projects as dated rows with their own photographs, linking into the archive. Dates through `Intl` in the page's locale. On phones the photograph opens the chapter and the rows close it.
- **Invitation.** The no-image invitation is now left-aligned in the grid with the title balanced and both links rendered, title and text sharing the top edge (first bottom-aligned to the links; the owner asked for top). The Impact page shares this branch and gains its second link too.
- **Motion.** Hero words; lede rise; contents rows stagger; photograph unmask and drift; heading split; rows reveal. Everything once, all under `gsap.matchMedia`.

### A bug found while verifying

`lenis.scrollTo(element)` measures the element against Lenis's own scroll value, which lags a native scroll by a frame. When the browser has just scrolled the link into view (keyboard focus, or a tap near the viewport edge), the target is stale and the page stops short, or overshoots to the end. The contents now compute the destination from `window.scrollY` and the chapter's scroll margin, resync Lenis with an immediate `scrollTo` to the current position, and only then animate. Verified by mouse, by keyboard (focus then Enter) and after the back-to-top button: all land at 96px.

### Validation

Typecheck and tests green. Captures at 1440 and 390, per-section frames, English and Spanish routes (contents label, dates and links localized), a reduced-motion pass, and a cross-page sweep with no failed requests or overflow. Production export passed in an isolated copy.

### Later: one pinned column of photographs beside the programme texts

The per-chapter spreads were replaced at the owner's request with the construction they had in mind: the four programmes are one chapter. On the left, one column holds all four photographs stacked absolutely inside a single frame sized to the viewport (100svh minus 8rem), so every photograph renders at exactly the same size and is cover-cropped to it. On the right, the four texts follow one another with a large gap (24svh) and start one beat (24svh) below the column, so the photograph reaches the top and pins before the first text arrives; the owner asked for the two not to reach the top together. `ProgrammeStack` (client) pins the column when its top reaches the chapter's scroll margin (96px) and releases it when the last text's bottom meets the column's bottom, with pin spacing off so the grid keeps its own height. When a programme's text comes into view (its top passing 85% of the viewport) a GSAP timeline wipes that programme's photograph in from the bottom over the previous one (a clip-path inset whose top edge rises from 100% to 0%), playing through on its own in about a second and reversing if the reader scrolls back above that line; the photograph settles up 6% inside the reveal while the previous one scales to 1.08 and takes a 35% ink shade, so the change reads as depth rather than a flat swap. It was first scrubbed to scroll position; the owner asked for it to complete on its own once started, could not see the change until a reload, briefly asked to drop it, then confirmed it was right; the triggered version stands. The owner asked for a wipe rather than a slide, then for motion on the photographs and the texts themselves: while a programme is read its photograph grows slowly from 1.00 to 1.05 (scrubbed from the end of its wipe to the start of the next), each text's chapter mark and body rise in once as the block reaches 80% of the viewport (at every size), and on large screens the outgoing text fades to 15% as its bottom passes from 45% to 15% of the viewport; the last text leaves with the column instead. The recede and the drift act on separate wrappers so no two tweens share a property. The frame is unmasked once as the section arrives. Without JavaScript the first photograph shows and the rest stay clipped away. On phones, and on large screens under prefers-reduced-motion, the column is not rendered; each programme carries its own photograph above its text, and under reduced motion the texts take the middle eight columns. `ProgrammeText` (server) holds the text, heading, body and field-project rows. Verified: the frame holds at 96px at every programme at 1440 and 1366, each slide is exactly one frame below until its turn, the mid-transition sample shows a slide half-way up, the column releases level with the last text, the contents links still land on their programme with the right photograph showing, and there are no errors or overflow in English, Spanish or Portuguese at four widths.

### Later: the programme navigation moves into the pinned section

The owner did not like the four programme links in the opening. They are gone; the opening is the lede alone. In their place `ProgrammeStack` renders a rail of four square thumbnails (56px) fixed to the viewport at the far right, 2rem from the edge so their right edge sits on the header's line (the header runs edge to edge with 2rem padding, wider than the page grid), and vertically centred on the pinned column; a ScrollTrigger sharing the pin's start and end fades it in and out, so it is shown for exactly the stretch the column is pinned. A first version placed it in the last grid column and pinned it with a second ScrollTrigger; the owner asked for it on the header's line, and a pinned element's box is fixed at refresh, so the margin trick did not move it. The text column narrowed from six to five columns so the rail never meets it. The rail is a `nav` of links, one per programme, each labelled with the programme's title; the one whose text is on screen (from 60% of the viewport down to its bottom) is marked `data-active` and `aria-current`, at full opacity with a green outline, the others at 40%. A click or Enter scrolls to the programme through the same resynced Lenis path as before and lands it on its scroll margin. The rail fades in with the frame (an explicit fromTo on the nav, the thumbnails moving only in y); thumbnail opacity belongs to the stylesheet alone, after a first version whose entrance tween left every thumbnail at an inline opacity of 0. It is not rendered on small screens or under reduced motion. The wipes are GSAP throughout: a scrubbed `gsap.timeline` tweening each slide's clip-path inset; no CSS transition or animation touches them.

### Later: a closing summary before the invitation

At the owner's request the Our Work page closes with a summary chapter between the programmes and the invitation: chapter mark 05 "In short" on the left, one paragraph in the display face on the right, on the deeper paper tone, a bookend to the opening lede. `Lede` now takes several paragraphs (split on blank lines, rising in one after another) and a tone, so the same component serves both ends of the page. The copy is drawn only from the programme texts and figures already on the site (scholarships and the Amboseli OYC Choir, the four Olchani nurseries and their 42,000 seedling capacity, Dignity Tailors and the Maasai Ushanga shop, lighting, beekeeping and Dignity Housing) and ends on the foundation's own principle, done with communities rather than for them. First written as two paragraphs; the owner asked for one, now 78 words. The block is a `statement` in `data.json` (`work-summary`), translated in the locale tables; Spanish and Portuguese regenerate with no strings left in English.


## 17 September 2026, pass 5: Impact

Same skills, same additive approach: new components under `components/impact`, a shared `FieldProjects` under `components/shared` (the Our Work programme texts now use it too), both Impact routes switched. The shared interior blocks stay for Get Involved.

### Audit of the previous page

An italic pull-quote opening on a white section that broke the paper palette (the site's only white); five figures in a four-column grid that left the fifth orphaned on its own row; the crisis section's three related field projects named in the data but never rendered; four text-only "what the numbers mean" cards with numbered markers on non-sequential items; the invitation already left-aligned from the earlier `CtaBlock` change.

### Direction

- **Sequence.** Hero, 01 the opening paragraph (the former pull quote, set plain in the display face), 02 figures, 03 emergency response, 04 what the numbers mean, invitation.
- **02 Figures as a ledger on ink.** One row per figure, the numeral large (up to 6rem) in green-light on the left five columns, its description on the right six, hairlines between rows. Each numeral rises out of its mask as its row arrives, the description follows, and each hairline draws in from the left. Five rows read as a list, so the count no longer matters to the layout.
- **03 Emergency response as a spread.** Photograph on the right five columns to the viewport edge, text on the left six, then "From the field": the three related projects (water for wildlife, Parthenium removal, the Lake Nakuru clean-up) as dated rows with their photographs.
- **04 What the numbers mean.** Four statements, each led by a square photograph of the programme it comes from (classroom, cabbage harvest, Dignity House, seedlings) and linking to that programme on Our Work. `CardItem` gained an optional `image`; the four items carry it and a link in `data.json`.

### Hash routes land where they point

Following a link such as `/our-work#coexistence` from another page used to land 40px short: `Layout` reset the scroll to the top on every route change, and even without that the browser's own hash scroll happens while `<main>` is still translated by the page entrance. `Layout` now leaves a hash route alone, waits for the transition's reveal and the entrance to finish, then scrolls to the element on its scroll margin (through Lenis when it is running). Verified from a meaning tile, from the home programme index, and on a plain route change, which still resets to the top.

### Validation

Typecheck and tests green. Per-section frames at 1440; full page at 1440 and 390; Spanish route with localized heading, label, dates and links; reduced-motion pass; cross-page sweep including the Spanish and Portuguese Impact routes with no failed requests or overflow; production export passed with all three Impact pages.

## 18 September 2026, pass 6: Get Involved

Same skills, same additive approach: `WaysIndex` under `components/get-involved`, the Impact crisis spread generalised into a shared `StorySpread` (side and tone props) that both pages now use, both Get Involved routes switched.

### Audit of the previous page

The generic interior hero with the wordmark eyebrow; a drop cap in the opening, which the owner reserved for the home page; four text-only cards for the ways to help, whose links were invisible until hovered; the tourism section's related field project named in the data but never rendered; the invitation on two small portraits.

### Direction

- **Sequence.** Hero, 01 the opening paragraph, 02 ways to help, 03 conservation through tourism, invitation.
- **02 Ways to help as an action index.** One row per way: a square photograph (about 180px on desktop, 88px on phones), numeral, title, description and, at the far right, the action it leads to ("Donate" for the donate page, "Write to us" for the contact page, from the existing message strings in all three languages). The whole row is the link; hover tints the row rule to rule, turns the title green and slides the arrow; keyboard focus shows the green outline. Photographs are the foundation's own and honest to each way: the trustee with a young elephant for Donate (the Donate page's own hero), the completed Dignity House for Sponsor a project, the supporters beside the Walk for Elephants vehicle for Partner with us, the Lake Nakuru clean-up for Volunteer. `CardItem.image` carries them in `data.json`.
- **03 Conservation through tourism** as a spread with the photograph on the left, to the viewport edge, on the deeper tone, and its field project (tree planting at Nairobi National Park) as a dated row. At the owner's request the photograph stands exactly as tall as the content beside it on large screens (the grid stretches both columns; the photograph frame takes the row's height with a 24rem floor); the Impact emergency-response spread shares the component and behaves the same.
- **Invitation** unchanged: the proverb, the paragraph, the Donate button and the paired photographs, which the owner plans to replace.

### Validation

Typecheck and tests green. Per-section frames at 1440, full page at 1440 and 390, hover and focus probes, action labels and links checked in English, Spanish and Portuguese, a reduced-motion pass, a cross-page sweep including the localized Get Involved routes with no failed requests or overflow, and the production export with all three Get Involved pages and Impact present. Photograph height equals text height on both spreads at 1280, 1440 and 1920.

## 18 September 2026, pass 7: Projects, with Dignity Housing as the flagship

The owner asked for the archive with Dignity Housing emphasised. Components under `components/projects`; both archive routes and both detail routes rewritten around a shared `ProjectArticle`.

### Audit of the previous pages

The archive was an ink text band and a flat grid of ten identical cards, newest first, so the one project with a real write-up sat last. The detail template rendered only the excerpt: the four paragraphs and five photographs of the Dignity Housing write-up in `data.json` were never shown anywhere on the site, and the sponsorship strings already translated in `messages` were unused there. Nine projects have no write-up, so their pages were a hero and links.

### Direction

- **Archive sequence.** Hero (the mangrove planting photograph, added to the `projects-hero` block), 01 the opening line, 02 the flagship, 03 the other nine.
- **02 Flagship, on ink.** The Dignity House photograph across the full container (2.2:1 on desktop), then the title and the write-up's first two paragraphs on the left seven columns with "Read the write-up"; on the right four the housed-camps figure, rising from its mask, taken from the Impact page's figures so it is written once (`4 of 25`, `4 de 25`), and the sponsorship panel: the US$14,000 unit cost and plaque, Donate and "Talk to us about sponsoring", from the existing message strings. The five field photographs from the write-up follow in one row, cover-cropped to 4:5.
- **03 The archive.** Nine photograph-led entries, three to a row, the month on a rule with an arrow, the title turning green on hover and focus. Dignity Housing is not repeated here.
- **Project pages.** Interior hero with the photograph, title, full date and a way back to the archive; the excerpt as the lede where one exists; the write-up as paragraphs (the excerpt is not repeated) and a row of its photographs; for the flagship, a chapter on ink with the figure and the sponsorship panel; then three more projects and the previous and next entries. Projects without a write-up go from the hero to the archive links. The flagship is named once, in `FLAGSHIP_SLUG` in `lib/projects.ts`.
- `InteriorHero` now accepts any block with a title and an optional `lead` line above it.

### Validation

Typecheck and tests green (the content tests still assert the write-up parses into four paragraphs and five images). Archive and flagship page captured at 1440 and 390 with per-section frames; the thin page for a project without a write-up; the Spanish archive with the translated flagship label, figure and actions; hover and keyboard focus on archive cards; reduced motion; a cross-page sweep including the localized archive and two detail routes with no failed requests or overflow; the production export with the flagship chapter and the write-up chapter present in the exported HTML.

### 18 September: the column no longer snaps into its pin, and the wipes carry their zoom

The owner saw the programme column reach about 85% of the way up the screen and then jump to its pinned line. The cause was the pin's look-ahead (`anticipatePin`), which pins a frame early from the scroll velocity; under Lenis's smoothing that early pin reads as a snap. It is removed, so the column pins exactly where it arrives. Measured by driving the page with wheel events through Lenis and sampling every 40ms: the frame's movement matched the page's movement to the pixel before the pin (largest mismatch 0.0px) and it settled at 95.8px with no jump.

They also asked for the wipe and the zoom to be one motion. Each wipe now runs its four channels on one duration and one curve (1s, power3.inOut): the clip edge rising, the incoming photograph settling from 1.15 to 1.04, the outgoing photograph receding to 1.08 and its shade to 35%. The reading drift then continues the same settle from 1.04 to 1.00 at scroll pace, so the zoom never changes direction. The first programme's entrance matches the rest: the frame wipes in from the bottom (it used to unmask top-down) with the first photograph's zoom in step. The incoming photograph's separate 6% upward settle is gone. Sampled through the second programme's wipe, the four normalised channels stayed within a few hundredths of one another.

## 18 September 2026, pass 8: Donate, project by project

The owner asked for donors to choose a project and either give generally or sponsor tangible items, without invented components or costs, with amounts from verified budgets or clearly marked estimates, and with the payment handoff understood before it was touched. Mid-build they added that Paystack would be the processor, then that PayPal should go entirely, then that the item cards should be rethought. Components under `components/donate`; data under `donate` in `data.json`; the review document is `docs/superpowers/specs/2026-09-18-donate-proposal.md`.

### Audit

The old page was a two-step amount-then-PayPal form with no project choice; M-Pesa and Mastercard were dead behind an offline helper, and PayPal itself no longer recognised the client ID in the source, so nothing could complete. The only verified figures anywhere are the US$14,000 Dignity House and 4 of 25 camps housed; the write-up names the components of a house.

### Direction

- **Donate page.** Hero (kept), 01 the opening line, 02 six project cards with the reported progress where there is any, 03 a gift where it is needed most, 04 your gift.
- **One page per project** (`/donate/<slug>` in all three languages): hero, 01 one line on the project (its summary as the heading) with the reported progress beside it, a button down to the items and a link out to the project's own page, 02 field photographs, 03 the item ledger, 04 a gift of any amount, 05 your gift. A first version carried the multi-paragraph story; the owner asked for the short form with the link out.
- **The ledger.** Items in amount order as numbered rows on hairlines: item, a line on what it does, the suggested gift, a square add control that becomes a stepper. One project photograph stands beside the list, held on the chapters' line by position: sticky while the list scrolls past and released when the list ends; its caption is the photograph's description. It began as a ScrollTrigger pin; under Lenis a pin is applied a frame after the threshold, which reads as a snap at speed, and the owner asked for it to stick naturally, so the pin went. A first version swapped in an item's own photograph with a wipe as its row was pointed at; the owner asked for one still image, and the swap and the item images were removed. A running "In your gift" line and a way down to the gift close the list. This replaced a three-column card grid the owner rejected.
- **Amounts.** Everything except the house is `estimate: true`; the page calls them suggested and says so in a closing line. Items are priced and charged in US dollars; the account is a dollar account ("dont use kenya shillings"). Another currency would need a rate in `donate.rates`.
- **Payments.** Paystack Inline v2, loaded from Paystack on demand, behind `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`; donor name and email; amount in subunits; an `LFF-` reference; metadata naming the projects and items. Without a key the gift chapter asks donors to write. PayPal and its package are gone.
- **Data model.** `donate.rates`, `presetsUSD`, `presets`, `causes[]` with `items[]`; every string through the locale tables, which now also translate multi-paragraph strings paragraph by paragraph.

### Validation

Typecheck and the fifteen tests green; the locale script reports nothing left in English. Browser probes at 1440 and 390: the overview and every cause route in English, Spanish and Portuguese; adding items, quantities and general gifts; persistence across pages; the ledger's hover, focus and keyboard paths; the photograph catching on the chapters' line and releasing at the list's end, sampled through a wheel-driven Lenis scroll; the Paystack handoff against a stub popup in three configurations (shillings only, shillings and dollars, no key) with the amount, currency, reference and metadata checked, cancel leaving the gift intact and success clearing it into the confirmation. Production export from a sibling copy with a placeholder key: 77 pages generated, the donate page and six cause pages present in all three languages, no PayPal left in the output.

## 18 September 2026, pass 9: the error pages

### Audit

One `app/not-found.tsx`, English only, on ink with a faint 360px "404" behind the text and a ghost "Return Home" button; no title of its own. The static export serves that single `404.html` for every unknown URL, including `/es/...` and `/pt/...`, so Spanish and Portuguese visitors got the English page. There was no `error.tsx` or `global-error.tsx` anywhere, so a page that threw showed Next's bare default screen. In development, `output: 'export'` turns any unknown top-level path (or unknown dynamic param) into a 500 with "missing param in generateStaticParams" instead of the 404; the check in next-dev-server throws before `dynamicParams` is consulted. The export flag is now applied only to production builds (`next.config.ts`), and `dynamicParams = false` is declared on every dynamic page as well as the locale layout, so in development unknown URLs get the 404 page; the exported site is unchanged, and static-rendering violations surface at build time, which the sibling build catches.

### Direction

- **One frame, `components/errors/ErrorChapter.tsx`.** A chapter on ink whose numeral is the status code, so the error reads as another chapter of the site rather than a system screen: `404 —— Page not found`, the heading rising word by word (`This path leads nowhere.`), a line of explanation, the action beneath it, and on the right four columns the ways through the site as a hairline index (`These trails do lead somewhere`: Home, About, Our Work, Projects, Impact, Get Involved, Donate, Contact). No decorative numeral, no photograph: an error page should be light and cannot depend on anything failing.
- **One 404 for three languages.** `app/not-found.tsx` renders the chapter three times from the `notFound` and `nav` messages, each block marked `data-lang`; a rule in `globals.css` shows only the block matching `<html lang>`, which the root layout's head script already sets from the URL before first paint. No JavaScript is needed to pick the language, nothing flashes, and nothing mismatches at hydration. The page carries its own title and `noindex`.
- **Error boundaries.** `app/(en)/error.tsx` and `app/[locale]/error.tsx` render `ErrorState`: the same frame with `500 —— Something went wrong`, "Try again" (Next re-renders the segment), the way home and "Write to us"; the error goes to the console and its digest is shown for support. `app/global-error.tsx` covers a failing root layout in plain English with system type, since fonts, navigation and translations cannot be assumed there.

### Validation

Typecheck green. In the browser: the Portuguese and Spanish 404s at 1440 and 390 show only their own language block, the index links carry the locale prefix, the nav and footer stay, no console errors; a temporary throwing route (`boom-test`, removed afterwards) showed the error chapter in English and Portuguese with the nav and footer intact, and "Try again" re-rendered without breaking. The production export's `404.html` carries all three blocks; the English block is what shows when it is served for an unprefixed URL.

## 18 September 2026, pass 10: Contact, with mail that actually sends

The owner asked for the contact page next and said the mail would go through Resend SMTP.

### Audit

The page was a split screen: a sticky ink panel with the tree-planting photograph under a 65% wash, the title, the email and the social links, and a paper panel with a four-field form whose submit built a `mailto:` link, so nothing was ever sent by the site. The page's own block (`contact-hero`: title, "Get in touch", an opening line and the José Manuel portrait) was only half used. The site is a static export, so it cannot hold a Resend key or send mail itself.

### Direction

- **Page.** `InteriorHero` from the block, 01 the opening line as the lede, 02 "Write to us": the left four columns carry the heading, a line on what to write, and the ways to reach the foundation as a definition list (email, the three social links, Nairobi); the right seven carry the letter. The home invitation closes the page without its portraits, since one of them is the hero.
- **The letter** (`components/contact/ContactForm.tsx`). Name and email side by side, a reason (a general question, a partnership, volunteering, sponsoring a project, press), the message; underline fields with eyebrow labels, as in the donor details; native validation; a hidden field robots fill. It posts JSON to the contact function and turns into a thank-you naming the visitor; if the send fails the message stays in the fields and the foundation's address is shown. A first version fell back to the visitor's email app when no endpoint was configured; the owner ruled that out ("the send button should not open a mail app"), so the endpoint defaults to `/api/contact` on the site's origin and the form always sends through it.
- **Delivery** (`server/contact/`). One Web-standard function, `handler.ts`, with adapters for Vercel (`api/contact.ts`), Netlify (`netlify/functions/contact.ts`) and Cloudflare (`worker.ts`): CORS for the site's origins, a per-address rate limit, validation mirroring the form, the honeypot answered with a silent yes, and one email to `CONTACT_TO` from `CONTACT_FROM` through Resend's HTTP API with the visitor as reply-to. The owner ruled out PHP and chose the API ("ill use the api for sending mail"), so the WordPress alternative and the SMTP notes were removed. The site reads only `NEXT_PUBLIC_CONTACT_ENDPOINT`, default `/api/contact`, which the Vercel adapter answers directly and `netlify.toml` routes to the Netlify one.

### Validation

Typecheck green; twelve unit tests on the handler (validation, composition, preflight, origins, bad JSON, honeypot, the Resend request, failure, configuration, rate limit) plus the fifteen existing ones. In the browser at 1440 and 390, English and Spanish: structure, labels and reasons in the page's language, the honeypot off-screen and out of the tab order, an empty submit stopped by native validation, the failure state on the plain dev server where nothing answers `/api/contact`; and against a mock endpoint, the preflight, a failed send keeping the message with the address shown, a successful send showing the thank-you with the posted JSON carrying every field, and "Write another message" clearing the form. Production export from a sibling copy.

### 18 September: the owner's photograph crops

The owner cropped four photographs with Cropframe and left `handoff.md` and `handoff.json` at the repository root with the crops exported at 2x into `public/<page>/`. Each slot in the handoff now points at its crop: the home hero (`/index/give.webp`, 2560x1600), the About hero (`/about/13-scaled.webp`, 2389x1224), the third Get Involved row's square thumbnail (`/get-involved/13-scaled.webp`, 336x336) and the first archive card (`/projects/13-scaled.webp`, 736x552). The archive card and the field-project rows take a new per-project `thumbnail` (`projectThumbnail()` in `lib/projects.ts`); the project's own page and the flagship keep the full-size featured photograph. Verified in the browser: every slot loads its local file at the exported size with no failed requests, the Spanish alt text still applies, and the Walk for Elephants page still shows the 2560px original.


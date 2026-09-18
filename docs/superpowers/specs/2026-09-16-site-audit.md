# Luigi Footprints Foundation — Website audit (16 Sep 2026)

## 1. Current structure

Next.js 15 static export, Tailwind v4, next-intl (en default, /es, /pt mirrors), GSAP + Lenis.
All copy lives in `data/data.json` (+ machine-translated `data.es.json`, `data.pt.json`), rendered by
block components. Routes: `/`, `/about`, `/our-work`, `/impact`, `/get-involved`, `/projects`,
`/projects/[slug]` (10 records), `/contact`, `/donate`, plus a 404.

Audience: prospective donors, tourism partners (Maniago Safaris network), sponsors, and people in Kenya's
conservation community. Primary conversion: Donate. Secondary: Get Involved / Contact.

## 2. What works

- Clear, small information architecture; every page ends in a CTA; Donate pinned in the header.
- The ivory / ink / single-green palette and Fraunces + Inter pairing are sound and already coded as tokens.
- Content is data-driven, so copy fixes do not require component changes.
- Trustee bios are genuine, specific, and the best-written content on the site.
- The project archive has 10 real field photographs with dates.
- Mobile layouts hold together; no horizontal overflow except the marquee strips.

## 3. Problems

**Content and credibility (highest priority)**
- Homepage hero is a 598×612 px, 12 KB scan of Luigi's portrait stretched full-bleed with a cyan cast,
  alt-texted as "Wildlife and landscapes". It is the first thing every visitor sees.
- Trustee portraits are used as programme images with false alt text (e.g. Peter's headshot labelled
  "a flourishing tree nursery"; Daniel's labelled "Maasai women creating beadwork").
- Two images (`Give.webp`, `Tree-Planting.webp`) are reused 9 times while 10 relevant project photos go unused.
- Unverifiable content shipped as fact: 5 anonymous testimonials, 7 named "Partners & Supporters"
  (KWS, WWF Kenya, USAID, UNEP…), and donation tiers ("$25 plants 10 trees") that appear nowhere in the
  foundation's own write-up. These must come out until the foundation supplies them.
- Copy drifts into filler: "dynamic corporate partnerships", "legendary wildlife", "community-first
  architecture goes deeper than paper matrices", "tailored pathways to maximize your personal impact".
- The word-marquee ("Wildlife • Community • Conservation…") and the 6.5 rem "Every footprint leaves a mark"
  band are decoration, not information.
- Project titles are lower-case in data and force-capitalised by CSS ("Walk For Elephants With Jim Nyamu");
  one has a typo ("ivasive"); one card shows raw `<p>` HTML in its excerpt.
- 9 of 10 project detail pages have no body content: hero → generic quote → prev/next. Dead ends.

**Conversion**
- Donate: `payutil.tk` (M-Pesa + Mastercard session) is unreachable, and the Mastercard `Checkout` script is
  never loaded. Two of three payment buttons do nothing. Only PayPal works.
- Contact form is a `mailto:` link but reports "Message sent. Thank you." — misleading.

**UX / performance**
- Page transition intercepts every link, waits 600 ms, shows a fake 0–100 % counter, and breaks
  ctrl/⌘-click and middle-click (no modifier check).
- `imagesloaded.min.js` loaded `beforeInteractive` on every page; nothing uses it.
- Any unknown top-level path (`/anything`) renders the English homepage with HTTP 200 via `[locale]`.

**Accessibility**
- Eyebrows and footer text at 10–11 px with 25–40 % opacity fail AA contrast.
- Team bio drawer lacks dialog semantics and focus management.
- Language switcher uses national flags for languages (UK flag for English on a Kenyan site).

**Design system hygiene**
- `globals.css` carries ~250 lines of dead CSS (three unused webfont families, noise/grain animations,
  slider classes), a dark-brown shadcn theme overridden by the ivory palette, a global `p { margin: 1rem 0 }`,
  and a gold focus ring on inputs vs green elsewhere.
- Numbered "01 / 02 / 03" markers on non-sequential cards; two-staggered-portrait CTA layout on three pages.
- Header wordmark says "The Luigi Footprints Foundation", footer says "Luigi Footprints Foundation".

**SEO**
- No `metadataBase`, no Open Graph image, no sitemap/robots, hreflang alternates always point to `/`,
  `feed.xml`, `browserconfig.xml`, `safari-pinned-tab.svg` referenced but absent, manifest has empty name
  and wrong icon paths.

## 4–6. Improvements (content, UX, design)

- Rewrite all page copy from the foundation's own write-up (`data/writeup/writeup.md`): plainer, specific,
  no invented facts. Remove testimonials, partner list, and donation tiers. Keep verified figures
  (2,553+ students, 3,500+ trees, 4 nurseries, 42,000 seedling capacity; Dignity House = US$14,000, 4 of 25 built).
- Re-map every image to what it actually shows, with honest alt text. Luigi's portrait appears once, at a
  size it can carry, on About.
- Home: hero → what we believe → four programmes → figures → recent field work (real project photos) → CTA.
- Replace the marquee, giant statement band, partner strip and tiers with quieter, content-bearing sections.
- Projects: photo-led archive; detail pages only where a write-up exists (Dignity Housing gets a proper
  article with its 5 inline photos parsed from the WordPress HTML).
- Donate: show only the payment method that works (PayPal, which also takes cards). Keep M-Pesa/card code
  behind a flag with a comment until a backend exists.
- Page transition: honest, brief, respects modifier keys. Fix contrast, dialog semantics, flag-free locale switch.
- Clean the CSS foundation; unify shadcn variables with the editorial palette; drop dead scripts.
- Add sitemap, robots, OG metadata, per-page hreflang, manifest fix, `dynamicParams = false`.

## 7. Missing (needs the foundation, not invention)

- Named partners / tourism operators with permission to list them.
- Real quotes from students, women's groups, or rangers, with names or roles.
- Per-project write-ups for the 9 empty projects (even 2–3 sentences each).
- Registration / charity number and a postal address for the footer.
- Concrete "what a gift buys" figures beyond the Dignity House unit cost.
- A higher-resolution photograph of Luigi Francescon.

## 8. Priority

1. Hero image, image/alt mapping, removal of unverifiable content, copy rewrite.
2. Donate flow honesty, contact form messaging, 404 fallback, link interception bug.
3. Design tightening (cards, CTA, transitions, contrast), CSS cleanup, SEO metadata.
4. Projects archive redesign and Dignity Housing article.
5. Re-translate es/pt after copy settles (`scripts/translate-data.mjs`, needs ANTHROPIC_API_KEY).

## 9. Implementation plan

1. Foundation: `globals.css`, root layout metadata, sitemap/robots, locale guard.
2. Content: rewrite `data.json`; structural sync script for `data.es.json` / `data.pt.json`.
3. Blocks: Hero (full / portrait variants), Content, Cards, Impact, Cta, Team, LuigiPanel, new FieldNotes.
4. Pages: home, about, our-work, impact, get-involved, projects (+detail), contact, donate, 404 — both route groups.
5. Chrome: Navbar, Footer, LocaleSwitcher, PageTransition, BackToTop.
6. QA: build, tests, full-page screenshots at 390 / 820 / 1440, overflow and console checks.

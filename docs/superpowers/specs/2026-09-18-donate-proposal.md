# Donate page: proposal for review

Date: 18 September 2026. Prepared for the site owner and the Luigi Footprints Foundation before the page goes live.

## What the audit found

- The donate page was a two-step form: an amount in one of four currencies, then PayPal. No project could be chosen and nothing on the receipt said what a gift was for.
- PayPal was the only route left on the page. M-Pesa and the Mastercard checkout depended on a helper backend that is offline; their code is in git history, not on the page. PayPal itself no longer recognised the client ID in the page's source ("client-id not recognized for either production or sandbox"), so no online gift could complete. At the owner's instruction PayPal has been removed entirely, package included; Paystack is the processor.
- The content model (`data/data.json`, mirrored into `data.es.json` and `data.pt.json` by `scripts/locale-copy.py`) had projects and programme copy but nothing about giving. The foundation's own material carries one verified cost, a fitted Dignity House at US$14,000, and one verified progress figure, 4 of 25 ranger camps housed. The 2021 write-up also lists what a house contains: three beds, a kitchenette, a shower and flush toilet, solar power for lighting and hot water, and large water tanks. Its photographs show the container, its door and window, the solar panels and the plaque.

## The structure built

Each project a gift can go to is a **cause**. Every cause has a general gift (any amount) and, except the general fund, a list of **items** to sponsor, each with a suggested amount. A donor can add several items and several general gifts to one gift, change quantities, and pay once. The Paystack transaction carries the gift line by line, named for the item and its project, so the foundation's record says what the gift was for.

| Cause | Source of the story and photographs | Items |
| --- | --- | --- |
| Dignity Housing for wildlife rangers | The project write-up and its five photographs | Window, door, bed and mattress, flooring, shower and flush toilet, solar lighting, water tanks and plumbing, fitted kitchenette, solar water heater, a complete house |
| Education and youth | The Our Work programme text; classroom and Walk for Elephants photographs | Exam fees, a year of textbooks, uniform and shoes, the OYC Choir, a term's fees, a conservation workshop, a year's scholarship |
| Landscape restoration | The Olchani programme text; seedlings, planting and mangrove photographs | Ten seedlings, nursery tools, shade netting, a month of water, a hundred seedlings, a community planting day |
| Community enterprise | The programme text; the COVID-19 livelihoods photograph | Beads and wire, fabric and thread, seeds and tools for a plot, a sewing machine, a training place |
| Coexistence and guarding | The programme text; the boots handover and a Dignity House | Ranger boots, a beehive, a bee suit and smoker, a predator-deterrent light |
| Emergency response | The Impact page's crisis text; water trucks, weed clearing and the clean-up | A clean-up kit, a day of weed clearing, a water delivery, a truckload of hay |
| Where it is needed most | No page: a general gift on the donate page | None |

Items are listed as an itemised schedule in amount order: numbered rows on hairlines with the item, a line on what it does, the suggested gift and an add control that becomes a quantity stepper. One photograph of the project stands beside the list, held in place while the list scrolls past. A whole unit, where a project has one, closes the list under a heavier rule.

## Amounts: what is verified and what is an estimate

**Verified:** a complete Dignity House at US$14,000, with a plaque for a funded unit (`estimate: false` in the data). **Progress:** 4 of 25 homes built, read from the foundation's own figure on the Impact page.

**Everything else is an estimate** that I set so the page could be built and tested, marked `estimate: true` in the data. They were chosen to sit in a plausible order of magnitude for Kenya and to be consistent with each other, not from any budget of the foundation's. The owner supplied the first Dignity Housing figures (window 80, door 120, toilet 250, solar water heater 650, bed and mattress 140; roofing sheets 180 was left out, see below). Before launch the foundation should confirm or replace every estimate in `data/data.json` under `donate.causes[].items[].amountUSD`; no code changes are needed, and the Spanish and Portuguese files regenerate with `python scripts/locale-copy.py`.

On the page the amounts are labelled "Suggested" and the chapter closes with: "Suggested amounts are a guide. Every gift, whatever its size, goes to the project you choose." Nothing on the page claims an item costs the amount shown.

### Components considered and left out

- **Roofing sheets** (owner's example): the houses are converted containers and the photographs show no added roof, so it is not in the data. Add it if the fit-out includes one.
- **GPS collars, camera traps, veterinary support** (owner's example list): not part of the foundation's documented work; not added.
- **Funding status per item** (fully, partially or not yet funded): the model has room for it, but there is no data. Not shown until the foundation reports it.
- **Money targets per cause**: no verified targets. The model has room for them; only the unit progress for Dignity Housing is shown.

## What the foundation needs to supply

1. Confirmation or correction of every estimated amount, or a per-item cost sheet.
2. Whether windows, doors, flooring and roofing are part of the container fit-out, and how many of each per house.
3. Current progress: homes built, and any per-item funding already received.
4. Costs for the other programmes: a scholarship term and year, exam fees, seedlings per nursery, a beehive, a predator-deterrent light, a water delivery, a truckload of hay.
5. Whether they want money targets shown per cause.
6. Currency: items are priced and charged in US dollars. Should the account ever charge another currency, add it to `NEXT_PUBLIC_PAYSTACK_CURRENCIES` and its rate per dollar to `donate.rates`.
7. Paystack account details, listed under Payments.

## 23 September 2026: the causes retold as the archive's projects

The projects archive was rewritten from the foundation's field record (19 projects; see `docs/superpowers/specs/2026-09-22-luigi-story-and-project-refresh.md` and `data/writeup/project_copy/`). The owner asked for the donate page to match it, so the six programme causes became ten project causes plus the general fund. Cause ids and slugs were kept so the Paystack line naming and the URLs do not move; titles, summaries and links now point at the project pages. The summaries reuse the projects' excerpts, which are already translated.

| Cause | Was | Now |
| --- | --- | --- |
| `dignity-housing` | unchanged | unchanged |
| `restoration` | Landscape restoration | The Olchani Project, linking to `/projects/olchani-project` |
| `enterprise` | Community enterprise | Ubuntu Smiles, linking to `/projects/ubuntu-smiles`; the tailoring and beadwork items stay |
| `education` | Education and youth | Scholarships, linking to `/projects/scholarships`; the items stay |
| `coexistence` | Coexistence and guarding | Living Safely With Wildlife, linking to the project; one item added |
| `emergency` | When nature needs us most | Drought relief and park clean-ups; items unchanged |
| `ubuntu-hay` | new | a bale of hay in store (6), a day of harvesting and baling (120), a season's upkeep of the hay barn (250) |
| `elephant-den` | new | a place at the summit (60), tools for the Embu nursery (90), seed capital for a youth enterprise (250) |
| `outdoor-classroom` | new | a field kit for one child (15), a class visit to a nursery (120) |
| `nanare` | new | art materials for one participant (30), a day of the challenge (400) |

**Every new amount is an estimate**, `estimate: true` in the data, set on the same basis as the originals: plausible for Kenya and consistent with the existing list, not from any budget of the foundation's. The added coexistence item, a place on a toolbox training, is 75 on the same basis. The four new causes carry the projects' placeholder image until the foundation supplies photographs. Not given a cause: the Walk for Elephants, the Nairobi tree planting, the mangroves, the Lake Nakuru clean-up, the boots handover and the COVID-19 work, which are told as history in the archive rather than as open needs; the emergency cause covers water, hay and clean-ups for the relief projects. Add these ten new amounts to item 1 of the list above for the foundation to confirm or replace.

## The data model

In `data/data.json`, under `donate`:

```
rates: { USD: 1 }                                    // units per US dollar for any extra currency the account may charge
presetsUSD: [25, 50, 100, 250]                       // suggested general gifts
causes: [{
  id, slug?, title, summary,                         // slug: page at /donate/<slug>; the general fund has none
  image, itemsImage?, gallery?, link?,               // photographs; itemsImage stands beside the item ledger
  progress?: { done, total, unit },                  // reported units, e.g. homes built
  items: [{ id, title, description, amountUSD, estimate, plaque? }]
}]
```

Every string is translated through the tables in `scripts/locale-copy.py`. Adding an item means adding one object and its two translations; adding a cause means one object with a slug, and the page appears in all three languages.

## Payments

The site is a static export with no server, so Paystack runs in the donor's browser with the public key, and the record of truth is the transaction in the foundation's Paystack dashboard. Configuration lives in `.env.local` (see `.env.example`); nothing secret is needed. Until the key is set, the gift chapter shows the chosen items and total and asks donors to write to the foundation.

**How it works.** The page loads Paystack's own Inline popup (version 2) from Paystack, asks the donor for first name, last name and email (Paystack requires the email), and opens the popup with the total in the currency's subunit, a reference of the form `LFF-…`, and metadata: a "Gift for" field naming the projects, an "Items" field listing each line, and the raw lines for any future backend. The popup handles the card payment; on success the page shows the confirmation with the reference and what the gift supports, and the gift is cleared. Cancelling leaves the gift intact. The figure charged is the figure shown: every total is the sum of each line's converted unit amount times its quantity, to the cent.

To go live the foundation needs to provide or decide:

1. The Paystack public key (live and, for testing, test), from Paystack Dashboard → Settings → API Keys & Webhooks. The site never needs the secret key.
2. Confirmation that the account charges US dollars (the default). Any further currency goes in `NEXT_PUBLIC_PAYSTACK_CURRENCIES` with a rate in the data; the currency switch appears only when there is more than one.
3. Channels are enabled per account in the Paystack dashboard; the page does not restrict them.
4. Customer email receipts switched on in Paystack (Settings → Preferences), since the page tells the donor Paystack will email the receipt.
5. Optionally a webhook or a small verification endpoint later, so successful payments are confirmed server-side and recorded outside the dashboard. Not needed for the popup to work.
6. A test payment with a `pk_test_` key before going live, and one live payment of a small amount after.

Monthly giving is not implemented; a Paystack plan has to exist in the account first, and can then be offered as a second button.

## Journey

Donate page: hero, opening line, choose a project (six cards, progress where reported), give where it is needed most, your gift. Cause page: hero, one line on the project with the reported progress beside it and two ways on (down to the items, or out to the project's own page for the full story), field photographs, the item ledger, or give any amount, your gift. The gift persists in the browser across these pages. Payment happens in the your-gift chapter of any of them: the total, the donor's details, the Paystack button. The same chapter becomes the confirmation, listing what the gift supports, the total and the payment reference.

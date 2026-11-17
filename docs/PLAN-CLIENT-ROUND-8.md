# Client round 8 — plan and what shipped

> Source: [`prompts/clientv3.md`](../prompts/clientv3.md) + the new hero image `prompts/hero.webp` (4939×3301; a photograph of a logistics park that dissolves into a pencil drawing of the same scene). Date: 2026-11-14.
> Scope rule: change only what the feedback names. Round 7 (`PLAN-CLIENT-ROUND-7.md`) is already on `main` (`ab248c3`).

## 1. Feedback, how it was read, and the plan

| # | Client feedback | Reading | Plan |
|---|---|---|---|
| 1 | Front page image is dull. Change the image **and** the animation, using `hero.webp` | Two causes of "dull": the pale porcelain wash that lay over the whole photograph, and motion that was only a slow drift + a cursor lens (nothing happened by itself). The new image already tells a story — *drawing → built* | **New hero.** Photo on the left, the client's own sketch on the right; **no wash over the photo** (the headline moves onto the white paper side). New motion: a pencil-sketch of the whole scene sits underneath and the photograph **develops across it, left to right, behind a gold scan edge**; then a slow scan keeps passing, and a lens (cursor on desktop, finger on phones, **an autopilot path when nobody is touching it**) shows the sketch through the photo. Headline words rise line by line, with a gold rule drawing under it. Old reticle removed (the new photo is not the site, so a pin saying "India's largest MMLP" on it would be a false claim) |
| 2 | Yellow in the Enquire button and other parts brighter | One token, `--color-yellow-400`, drives every button, rule, route comet and marker. It was `#ffca00` (amber). Move it to a brighter, cleaner yellow and lift the tints and the hard-coded glows to match | `--color-yellow-*` and the `rgb(255 202 0 / …)` glows in `globals.css`, `HubOpener`, `ConnectivityMap`, `EnquiryForm`, `Footer` |
| 3 | Scale section, right side: previews only appear when the mouse moves there; open **automatically, one by one** | Round 7 added an autoplay, but it only ran at ≥1024 px **and** with "reduce motion" off, ran once and stopped for good after the first hover, and hid each preview again so nothing stayed "open". Reworked: starts when the list comes into view, opens the four one by one on a steady beat, **keeps looping**, hands control to the pointer while it is over the list and **resumes when it leaves**; the reveal no longer depends on the reduced-motion flag (it is a fade/wipe, not travel) but stays slow and pausable; on phones each point now opens its own photo as it scrolls into view | `components/stats/ScaleIndex.tsx` |
| 4 | "In association with" logos: slow left → right scrolling wherever they appear | Logos appear in the **footer** and the **Gati Shakti band**. The marquee only ran above four logos (we now have three) and ran right → left. Now: always scrolls, **left to right**, slowly (~45 s a lap), pauses on hover/focus, enough copies to fill any width, and under reduced motion shows one still row (no duplicates) | `components/ui/PartnerLogos.tsx`, `.marquee-track` in `globals.css` |
| 5 | Motions that only play on hover should play by themselves on reaching the section — not all at once, a flow | Audit of hover-only motion (section 2). One small shared hook, `useFlow`, lights the items of a group **one after another** while the group is on screen (pauses off-screen, yields to the pointer, resumes after it leaves). Applied to the card groups whose hover effect carried the motion | `lib/motion/useFlow.ts` + Amenities, PATH verticals, Sustainability initiatives, Space availability cards, Gati Shakti tiles and map points |

## 2. Hover-only audit (point 5)

| Section | Hover-only before | After |
|---|---|---|
| §01 Hero | cursor lens, letter lift | lens runs on autopilot, cursor/finger take over; letter hover removed |
| §02 Scale | previews | see point 3 |
| §03 Master plan, §06.1 At a glance, §09 Inside Logicity | zone highlight on hover — **already auto-toured** (`useZoneTour`) | unchanged |
| §07 Connectivity | route traces — **already auto-play**, click hands over | unchanged |
| §07.1 Gati Shakti map | emphasising a route/point | after the routes draw, the points are emphasised one by one (`useFlow`) |
| §06.2 Amenities | card lifts, photo zoom, icon fills, gold bar grows | wave via `useFlow` |
| PATH verticals | card lift, photo zoom, gold bar grows | wave |
| §08 Sustainability | initiative icon fills green | wave |
| §04.1 Space availability | card lift, gold bar grows | wave |
| Gati Shakti tiles | tile tint | wave |
| Buttons, links, nav, form fields | hover feedback only — these are controls, not showpieces | unchanged |

Rule used: a wave lights **one item at a time**, never the whole group, and only on devices where the section is on screen; it stops for good once the visitor interacts with that group. Off under reduced motion (the cards are fully readable without it).

## 3. Things to know / questions for the client

- **Q1 — the image is not the site.** The photograph shows a European logistics park (trucks and buildings are not Path Logicity). The hero is labelled **"Illustrative image"**; the Warehouse 17 site photograph is no longer used on the front page (the files stay in `public/client/`). Confirm that is intended.
- **Q2 — the sketch half.** The pencil layer under the photograph is **generated** from the client's image (`scripts/make-hero-sketch.py`): the photograph side is converted to pencil lines, the client's own drawing is kept on the right. If the studio has the original line-art file for the whole scene, it can replace `public/client/hero-v3-sketch.webp`.
- **Q3 — yellow.** `#ffca00` → a brighter yellow (see section 4). If the client has an exact value, it is one line in `globals.css`.
- **Q4 — "all the logos".** Only three marks exist (NHLML, Bengaluru MMLP Private Limited, IGBC). They scroll as a loop of those three. The Bengaluru MMLP chip is still a name (no logo supplied).

## 4. What shipped, and how it was checked

| # | Status | Files |
|---|---|---|
| 1 Hero | **Done** | `components/hero/Hero.tsx`, `app/globals.css` (`hero-develop`, `hero-scan`, `hero-word`, `hero-rule`, `.hero-lens`), `content/home.ts`, `lib/content/index.ts`, `app/page.tsx`; `lib/content/server.ts` removed; assets `public/client/hero-v3.webp`, `hero-v3-sketch.webp`; `scripts/make-hero-sketch.py` |
| 2 Yellow | **Done**: `#ffca00` → `#ffd60a`, tints `#ffe040` / `#ffea7a` / `#fff9d6`, glows `rgb(255 214 10 / …)` | `app/globals.css`, `HubOpener`, `ConnectivityMap`, `EnquiryForm`, `Footer`, `RouteSpine`, `Route`, `SiteTourPreview`, `Sustainability` |
| 3 Scale | **Done** | `components/stats/ScaleIndex.tsx` |
| 4 Logos | **Done** | `components/ui/PartnerLogos.tsx`, `app/globals.css` |
| 5 Hover → automatic | **Done** | `components/ui/Flow.tsx` (new); `Amenities`, `PathVerticals`, `Sustainability`, `SpaceAvailability`, `GatiShaktiBand`, `GatiShaktiMap` |

Checked (Chromium, dev server, scripted; then a production build):
- Hero at 1024, 1440, 1920 and 390×844 touch: sweep, headline, lens ring and the see-through lens render; a mouse takes the lens over; no console errors.
- Scale with no mouse: previews 0 → 1 → 2 → 3 in order; hover takes over (only the hovered one is open); after the pointer leaves, the beat resumes.
- Footer logos: `translateX` increases (moves left to right); under reduced motion only one set (3 items) is visible.
- Amenities with no mouse: cards light one at a time (only those on screen).
- `npm run typecheck` clean; `npm run build` passes.
- Lighthouse (production build, local): desktop **98** performance / 100 accessibility / CLS 0 / LCP 0.4 s. Mobile **53–59** over four runs (HANDOVER records 57–72 for earlier rounds; a baseline re-run from `HEAD` could not be completed, so this is not proven to be a regression), CLS 0, TBT 700–960 ms, accessibility 97 (the known PATH-verticals label issue, unchanged). One regression was found and fixed on the way: the gold scan edge animated `left`, which Lighthouse counted as layout shifts (CLS 0.1); it now animates `transform` (CLS 0).
- **Not done:** a physical-device pass (phone drag, the lens under a finger, the rail flow on touch).

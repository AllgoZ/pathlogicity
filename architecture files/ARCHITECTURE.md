# Path Logicity — Architecture

> Technical architecture of the Path Logicity marketing site.
> **Last updated: 2026-10-23** — reflects client round 5 (Manrope + Inter, hero banner motion, Lorem phases, PATH Group
> figures/About/verticals, Constra space availability) plus the Warehouse 17 photographs (hero and milestone 03) and the connected Constra URL.
> Design sources, newest first:
> 0. [`docs/PLAN-CLIENT-ROUND-5.md`](../docs/PLAN-CLIENT-ROUND-5.md) — the latest client feedback and what changed
> 1. [`docs/REDESIGN-PLAN-R4.md`](../docs/REDESIGN-PLAN-R4.md) — current direction: light theme, one typeface, no opening animation
> 2. Feature plans: [`PLAN-OFFICIAL-MAP-REUSE`](../docs/PLAN-OFFICIAL-MAP-REUSE.md) · [`PLAN-MOBILE`](../docs/PLAN-MOBILE.md) · [`PLAN-GATI-SHAKTI-MAP`](../docs/PLAN-GATI-SHAKTI-MAP.md)
> 3. [`docs/CLIENT-CHANGES-PLAN.md`](../docs/CLIENT-CHANGES-PLAN.md) — client round 2 · [`docs/REDESIGN-PLAN.md`](../docs/REDESIGN-PLAN.md) — round 3 (largely superseded) · [`docs/UI-PLAN.md`](../docs/UI-PLAN.md) — original spec
>
> Status and open items: [`HANDOVER.md`](./HANDOVER.md). QA: [`docs/redesign/QA-REPORT-R4.md`](../docs/redesign/QA-REPORT-R4.md).

---

## 1. Overview

A marketing site for **Path Logicity**, India's largest Multimodal Logistics Park (MMLP): a
~400-acre hub at Dobbaspet, Bengaluru, built by PATH Group. The site is **homepage-first**: one long
scrolling homepage of 16 sections plus the footer, and six real inner pages built from the same sections.

**The core idea.** A thin **route line** threads the page. It starts in the hero, draws across the
render, carries down into the Scale section and then runs down the left margin as a "spine" with a node at
every section, ending at the enquiry block. The page behaves like the hub it describes.

**Visual direction — light and brand-coloured** (client "Changes V2"):
- White with a faint brand tint (`porcelain` / `stone`) throughout. The only dark surface is the footer
  (deep ink, about 4% of the scroll length).
- **Gold** is the action accent; **indigo** (headings, numerals), **blue** and **green** carry roles.
  The client's four-colour pinwheel is a 3px stripe and appears in data and legends.
- **Two typefaces (round 5): Manrope** for headlines and numerals, **Inter** for body and labels. Accent words are colour, not italics.
- **No preloader or intro reveal.** The hero banner has quiet ambient motion (slow drift, headline rise, bar fade, reticle ping: CSS only, off under reduced motion). Everything else is earned by scrolling or interacting.

**Fact-safety.** Only client-supplied facts appear as claims. Every unverified fact (coordinates,
dates, ESG metrics, news, blog posts) is `null`/empty in the content layer and renders a review-only
placeholder or a designed empty state. Placeholders are hidden from visitors and shown only with
`?annotations=on`. Stock imagery is always labelled "Illustrative" and credited (see §9).

---

## 2. Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 16.4** (App Router, Turbopack) | ⚠️ Breaking changes vs. older Next. Read `node_modules/next/dist/docs/` before coding (see [`AGENTS.md`](../AGENTS.md)) |
| UI runtime | **React 19.3** | Server Components by default, with islands marked `"use client"`. Uses React's native `<ViewTransition>` for route changes |
| Language | **TypeScript 5.9** | `strict`; the `@/*` alias maps to the project root |
| Styling | **Tailwind CSS v4** | CSS-first `@theme` tokens in [`app/globals.css`](../app/globals.css); there is no `tailwind.config` |
| Scroll scenes | **GSAP 3 + ScrollTrigger** | Route draws, the hero pin, odometers, map cameras, reveals |
| Smooth scroll | **Lenis** | Mouse and trackpad only; off on touch devices and under reduced motion |
| Micro-interactions | CSS keyframes + GSAP `quickTo` + the Web Animations API | No second animation library |
| Fonts | `next/font/google` | **Manrope** (`--font-display`, `--font-serif`) + **Inter** (`--font-sans`, `--font-mono`) |
| Images | `next/image` | AVIF/WebP ([`next.config.ts`](../next.config.ts)) |
| Server | One route handler | `POST /api/enquiry` (see §4) |

Dependencies are only `gsap`, `lenis`, `next`, `react`, `react-dom` (+ Tailwind and TypeScript as dev).
Scripts: `dev` · `build` · `start` · `typecheck` (`tsc --noEmit`). Preview configs live in
[`.claude/launch.json`](../.claude/launch.json): `dev` on port 3000, `prod` on port 3100.

---

## 3. Directory structure

```
site/
├─ app/
│  ├─ layout.tsx          Font · head script (annotations) · SmoothScroll · SurfaceMorph · MobileMotion · Nav ·
│  │                      <ViewTransition> main · EnquireBlock · Footer · RouteSpine · JourneyRail · MobileActionBar
│  ├─ page.tsx            Homepage — composes the section components (server component)
│  ├─ globals.css         @theme tokens · utilities (type, card, grain, pinwheel-stripe, img-grade, lift) ·
│  │                      keyframes · route-node + rail-dim styles · reduced-motion rules
│  ├─ icon.svg            Favicon
│  ├─ path-group/ logicity-advantage/ sustainability/ site-tour/ news/ blogs/   Inner pages (page.tsx each)
│  └─ api/enquiry/route.ts   POST: validate + forward the enquiry to ENQUIRY_WEBHOOK_URL
│
├─ components/
│  ├─ navigation/   Nav (+ MobileMenu), MobileActionBar, JourneyRail, RouteSpine, Logo,
│  │                useHeroThreshold (useHeroThreshold / useScrolledPast / useHideOnScroll)
│  ├─ hero/         Hero — full-bleed render under a porcelain wash; desktop pin + route; separate phone line
│  ├─ stats/        ScaleIndex — 400 odometer → 4 branching nodes with hover image previews
│  ├─ master-plan/  MasterPlan (§03), OfficialPlanMap + useZoneTour (shared), officialZones (GENERATED)
│  │                PlanSvg + planGeometry — the old schematic, UNUSED
│  ├─ project-status/ ProjectStatus — sticky viewer + milestone timeline (Lorem ipsum phases); SpaceAvailability (§04.1: leased/available space + Constra links)
│  ├─ path-group/   PathGroup (highway photo, metrics, About PATH, track record), PathVerticals (PATH Legacy: the group's verticals)
│  ├─ gallery/      RendersGallery — native Rail of client renders; phone full-screen viewer
│  ├─ advantage/    HubOpener, SpecDrawing (§06.1), Amenities (§06.2), GatiShaktiBand (§07.1),
│  │                GatiShaktiMap (the §07.1 map), MmlpNetwork — the old schematic, UNUSED
│  ├─ connectivity-map/ ConnectivityMap (§07) + mapGeometry — client location map, traced routes (shared with §07.1)
│  ├─ sustainability/ Sustainability (IGBC ring), BusinessValue
│  ├─ site-tour/    SiteTourPreview — official plan under a gliding camera
│  ├─ news/         NewsPreview — ARIA tabs, featured + rows
│  ├─ blogs/        BlogsIndex — featured + list, or a designed empty state
│  ├─ contact/      EnquireBlock (image panel, contact rows), EnquiryForm
│  ├─ footer/       Footer — deep ink, grain, pinwheel stripe, partner marquee
│  ├─ layout/       PageHero — the inner-page header (the one h1, intro, "On this page")
│  ├─ providers/    SmoothScroll (Lenis), SurfaceMorph, MobileMotion
│  └─ ui/           Route, Rail, ImageViewer, Counter, Metric, AssetSlot, RevealMedia, ContentSlot,
│                   Button/ArrowLink, Magnetic, SectionHeader, Reveal/RevealLines, Icon, PartnerLogos,
│                   SurveyGrid (UNUSED)
│
├─ content/home.ts        Typed seed content — the ONLY place facts live
├─ lib/
│  ├─ accent.tsx          `*word*` → <em> accent words (colour, same typeface)
│  ├─ contours.ts         Generative contour art for AssetSlot placeholders
│  ├─ enquiry.ts          Enquiry types, industries, `validateEnquiry` — shared by the form and the API
│  ├─ content/
│  │  ├─ server.ts        getHomepageWithAssets: the only place that touches `node:fs` (Warehouse 17 hero photo check); server components only
│  │  ├─ index.ts         getHomepage / getSettings / getNavigation / getEnquiry / getBlogs / getPartners, telHref — CMS swap point
│  │  └─ types.ts         Content models (mirror the future CMS schema)
│  └─ motion/
│     ├─ gsap.ts          GSAP + ScrollTrigger registration, MQ media-query presets
│     ├─ hooks.ts         useMotion (lazy, shared IntersectionObserver), useSize, useIsoLayoutEffect …
│     ├─ route.ts         scalePath() + applyRouteProgress() (cached path lengths)
│     └─ useLinks.ts      boxIn / curve / useLinks — measured leader and branch lines
│
├─ scripts/generate-plan-zones.py   Traces the 7 zones from the official plan → master-plan/officialZones.ts
├─ public/
│  ├─ client/             Client assets from pathlogicity.com (+ MANIFEST.md): logos, renders, 345.webp map,
│  │                      image-1731136566206.webp (official plan), hero-main.webp (hero), partners/,
│  │                      amenities/ (illustrative stock + CREDITS.md)
│  ├─ constra/            Drop folder for Constra timelapses/photos (awaited — parked)
│  └─ construction/       Representative stock progress images (labelled as such) + CREDITS.md
├─ reference/             Concept note PDF, client-site/BRAND-EXTRACT.md, images/main.webp (hero source)
├─ docs/                  UI-PLAN · CLIENT-CHANGES-PLAN · REDESIGN-PLAN · REDESIGN-PLAN-R4 · PLAN-* · redesign/ (QA reports + screenshots)
├─ .env.example           ENQUIRY_WEBHOOK_URL
└─ architecture files/    ARCHITECTURE.md (this) · HANDOVER.md
```

Unused leftovers (safe to delete): `PlanSvg.tsx`, `planGeometry.ts`, `MmlpNetwork.tsx`, `SurveyGrid.tsx`,
and the files `public/client/hero-gate.webp`, `main2.webp`, `logo-lockup-indigo.webp`.

---

## 4. Rendering & routing

- **Homepage** ([`app/page.tsx`](../app/page.tsx)) is a **Server Component**. It calls the content
  getters at build time and renders the sections in order. Interactive sections are Client Components
  that receive typed props; there is no client-side data fetching.
- **Shared chrome** ([`app/layout.tsx`](../app/layout.tsx)): Nav (solid after the hero), RouteSpine and
  JourneyRail (homepage only), MobileActionBar, the shared EnquireBlock (the final CTA on every page),
  Footer, and the providers (SmoothScroll, SurfaceMorph, MobileMotion).
- **Route transitions:** `<main>` is wrapped in React's `<ViewTransition default="page-wipe">`. The old
  page lifts away and the new one wipes up over a light curtain (CSS in `globals.css`); off under reduced
  motion.
- **Inner pages** (`/path-group`, `/logicity-advantage`, `/sustainability`, `/site-tour`, `/news`,
  `/blogs`): a `layout/PageHero` plus the same section components the homepage uses, wrapped in
  `<div data-inner>` so the homepage chapter numbers are hidden (`body:has([data-inner]) [data-idx]`).
  Anything else is a 404.
- **Enquiry:** `components/contact/EnquiryForm` → `POST /api/enquiry` → JSON to `ENQUIRY_WEBHOOK_URL`.
  The handler validates with the same rules as the form (`lib/enquiry.ts`), has a honeypot and a size cap,
  and answers `422` (invalid), `400`, `413`, `405`. With no webhook set, dev logs the payload and succeeds;
  **production answers `503`** so a missing destination is never mistaken for a sent enquiry, and the form
  shows a call/email fallback.
- **Sub-sections are anchors** (e.g. `/logicity-advantage#amenities`); `[id]` has `scroll-margin-top: 96px`.
- **All pages are statically generated** except the API route. CMS content will later arrive through ISR
  or on-demand revalidation.

---

## 5. Content layer (CMS readiness)

```
Components ──props──> lib/content/index.ts ──reads──> content/home.ts   (today)
                               └── later: CMS query (Sanity / Payload / Strapi)
```

- **Components never import `content/` directly.** Swapping in a CMS means changing only the getters in
  [`lib/content`](../lib/content/index.ts).
- **Models** ([`lib/content/types.ts`](../lib/content/types.ts)): `SiteSettings`, `MediaAsset` (`src` may
  be an image **or an MP4/WebM**, plus an optional `credit`), `MetricData`, `ScaleNode`, `Zone`,
  `Milestone`, `Destination`, `Initiative`, `Benefit`, `NewsItem`, `BlogPost`, `Amenity`, `EvolutionStep`,
  `NavItem`, `Partner`, `GalleryItem`.
- **Fact-safety by type:** every optional fact is nullable (or an empty list). The UI renders a
  `ContentSlot` or a designed empty state. `ContentSlot` and asset annotations carry `.slot-annotation`,
  hidden unless `html[data-annotations="on"]` (via `?annotations=on`).
- **Accent words:** headline strings may wrap 1–2 words in `*asterisks*`; `lib/accent.tsx` turns them
  into `<em>`, which is styled by colour (`--accent-color`), not by a second typeface.

---

## 6. Design system

### 6.1 Tokens ([`app/globals.css`](../app/globals.css) `@theme`)

| Group | Tokens | Role |
|---|---|---|
| Light surfaces | `porcelain` #f9fafd · `stone` #eff2f9 | Section backgrounds (alternate) — white with a faint brand-blue tint |
| Cards | `paper` #fff · `paper-2/3` | Cards, panels, tiles |
| Text | `ink` #111233 · `steel-700` #4a4c5e · `steel-500` #646678 | Headings · body · muted (≥ 4.5:1 on stone) |
| Deep | `ink` / `midnight` #0d0e35 | The footer (`bg-ink`) and viewer overlays; `midnight` is no longer a section colour |
| Brand indigo | `indigo-700` #201f85 (+ 500/400/300/50) | Labels, links, numerals, accent words, hover wipes |
| **Gold** | `yellow-400` #e7ac00 (+ 300/200/50) | **Action accent**: CTAs, rules, route comet and spine, markers. Never small text on white |
| Pinwheel | `green-500` #449e35 · `blue-500` #0066b1 · `orange-500` #ff6600 | Stripe, map legends and route modes, sustainability (green), status dots |

`:root` also holds `--margin`, `--gutter`, `--line-*` and `--shadow-card`.

### 6.2 Typography (`@utility`) — Manrope + Inter
- Headlines in Manrope, weight 800 on the big sizes and 700 below, tight tracking: `t-hero` (≤ 3.625rem) · `t-xl` (≤ 2.75rem) · `t-l` (≤ 2rem)
  · `t-m` · `t-s`; `t-xxl` is the big numeral. Body in Inter, 16px (`t-body-l` 16–17px).
- Labels (`t-label` 13px, `t-micro` 12px) are **sentence case** with light tracking — no tracked all-caps eyebrows.
- Accent words: `em` takes `--accent-color` (indigo by default; gold inside `.on-dark`), normal style and weight.

### 6.3 Surfaces and utilities
- `shell` (max 1600px), `grid-12` (4 → 8 → 12 columns), `card` (white, 2px radius, soft shadow).
- `section-pad`: generous on desktop, **tighter below 640px**.
- **Footer** is the only dark surface: `bg-ink` + `on-dark` (gold focus ring, gold accent words) + `grain` +
  a soft gold radial glow + `data-surface="dark"` (for SurfaceMorph).
- `pinwheel-stripe` (3px, four colours): under the solid nav, at the top of Gati Shakti and the footer, at
  the foot of the hero and inner-page headers.
- `img-grade` (one colour grade for every photo); `.lift` (hover lift for tiles); `.rail` (phone focus effect).

### 6.4 The signature device — `Route` ([`components/ui/Route.tsx`](../components/ui/Route.tsx))
- Paths are written in **normalised 0–100 space**; `scalePath()` rescales them to the measured container;
  `applyRouteProgress()` drives a dormant hairline, a trail and a gold comet head (path lengths cached).
- Props: `tone` (surface), `trail="blue"` (the hero route), `auto="scrub" | "enter"` or an imperative
  `ref.set(p)`. It renders fully drawn for SSR, no-JS and reduced motion.
- **`RouteSpine`** (`navigation/RouteSpine.tsx`) is the page-wide line: it is positioned in the document from
  the real section tops (starts at §03, ends at the enquiry block), draws gold with scroll and lights a
  node per section. Imperative, so it never re-renders React per frame.

---

## 7. Motion system

**Setup:** [`lib/motion/gsap.ts`](../lib/motion/gsap.ts) exposes the `MQ` presets (`motion`, `desktop`,
`mobile`). Scenes run inside `gsap.matchMedia()`, so **nothing animates under reduced motion**.

**Lazy scenes:** [`useMotion`](../lib/motion/hooks.ts) sets up scenes within 1.5 viewports of the fold
immediately and the rest within one viewport, through a **single shared IntersectionObserver**. A
coalesced `ScrollTrigger.refresh()` runs only when a late scene creates a pin.

| ID | Motion | Where |
|---|---|---|
| M1/M2 | ~~Preloader, hero window reveal, word rise~~ — **removed**: the page is complete on first paint | — |
| M3 | Surface morph: an entering light/dark section blends from the previous colour (only the footer is dark now) | `providers/SurfaceMorph` |
| M4 | Image reveal: wipe up behind a gold leading edge, settle from 1.2×, ±5% parallax | `ui/RevealMedia` (inside `AssetSlot`) |
| M5 | ~~Pinned gallery~~ — replaced by a native scroll-snap **Rail** (drag, arrows, ←/→, progress); the page is never captured | `ui/Rail`, `gallery/RendersGallery` |
| M6 | Magnetic CTAs (fine pointers only) | `ui/Magnetic` |
| M7 | Odometer reels; final value stays in the DOM. `spins` makes each digit whirl through several 0–9 turns and decelerate (used for the 400 acres) | `ui/Counter` |
| M8 | Connectivity map: establishing shot (site → region), gold route traces, any click hands control to the user | `connectivity-map/ConnectivityMap` |
| M9 | Partner logo marquee (pauses on hover; static under reduced motion) | `ui/PartnerLogos` |
| M10 | Hub showpiece: routes converge, the pinwheel spins in, gold pulse | `advantage/HubOpener` |
| M11 | Section intro paragraphs fade up | `ui/Reveal`, `ui/SectionHeader` |
| M12 | Route transitions (`<ViewTransition>`) | `app/layout.tsx` + CSS |
| M13 | **Route spine** — the page-wide margin line | `navigation/RouteSpine` |
| M20 | **Hero banner motion**: slow drift on the image, headline lines rise through their masks, the bottom bar fades up, the reticle pings. CSS classes `hero-drift` / `hero-rise` / `hero-fade` / `hero-ping` (no flash before hydration; drift and ping off under reduced motion) | `hero/Hero` + `globals.css` |
| M21 | **Phone hero: look around** (≤1023px, motion allowed): the photograph is wider than a phone, so a finger drags it sideways (`object-position`, clamped 15–85%, with momentum; vertical scroll is untouched via `touch-action: pan-y`). A first slow sweep shows it moves; a "Drag to look around" pill with a position track fades out on the first drag. The headline also drifts up and fades as you scroll off the banner | `hero/Hero` (`MQ.mobile` scene) + `hero-nudge` in `globals.css` |
| M14 | **Hero route** (desktop): the hero pins for 140% of a viewport; the headline lifts, the reticle shrinks and the blue route (gold comet) draws across the image and down into §02, where `ScaleIndex`'s incoming route carries it on | `hero/Hero` |
| M15 | **Official-plan zones**: hover/tap washes out the rest, re-reveals the zone and redraws its outline; first-view tour through the zones (`useZoneTour`: pauses off-screen, stops on first interaction) | `master-plan/OfficialPlanMap`, `MasterPlan`, `SpecDrawing`, `SiteTourPreview` |
| M16 | **Site-tour camera**: the plan glides and zooms onto the chosen zone (CSS variables + transition), with a slow breathing drift | `site-tour/SiteTourPreview` |
| M17 | **Gati Shakti map**: the site pops, routes draw out one by one, each point lands with its route; hover/focus/tap emphasises one | `advantage/GatiShaktiMap` |
| M18 | **Phone only:** blocks (milestones, initiatives, glance figures, PATH sectors, footer link groups) rise and fade in as they arrive (Web Animations API, staggered, leaves no inline styles) | `providers/MobileMotion` |
| M19 | **Phone only:** the master plan pans sideways and glides to the lit zone; rails dim non-current cards; the hero has its own short line in the clear part of the image | `MasterPlan`, `ui/Rail` + CSS, `hero/Hero` |

**Pinned scenes:** only the **hero on desktop** (one ScrollTrigger, killed on unmount). Phones and reduced
motion have none.

**Scroll state:** the nav, rail and action bar use `useScrolledPast` / `useHideOnScroll`, which re-render
only when a threshold is crossed, never per frame.

---

## 8. Homepage sections (order and data flow)

| # | Section | Component | Content | Surface |
|---|---|---|---|---|
| 01 | Hero | `hero/Hero` | `hero`, `settings` | Render under a porcelain wash |
| 02 | Scale | `stats/ScaleIndex` | `scale` | Porcelain |
| 03 | Master plan | `master-plan/MasterPlan` | `zones` | Stone (official drawing, interactive) |
| 04 | Project status | `project-status/ProjectStatus` | `milestones`, `statusLastUpdated` | Porcelain |
| 04.1 | Space availability | `project-status/SpaceAvailability` (inside §04) | `leasing`, `constra` | Porcelain |
| 05 | PATH Group | `path-group/PathGroup` (+ `PathVerticals`) | `pathGroup` (metrics, about, verticals) | Stone |
| 05.5 | Renders | `gallery/RendersGallery` | `renders` | Stone |
| 06 | Hub opener | `advantage/HubOpener` | — | Porcelain |
| 06.1 | At a glance | `advantage/SpecDrawing` | `glance` | Stone (official plan + figures) |
| 06.2 | Amenities | `advantage/Amenities` | `amenities` | White |
| 07 | Connectivity | `connectivity-map/ConnectivityMap` | `destinations` | Porcelain |
| 07.1 | PM Gati Shakti + partners | `advantage/GatiShaktiBand` (+ `GatiShaktiMap`) | `gatiShakti`, `partners`, `destinations` | Stone |
| 08 | Sustainability | `sustainability/Sustainability` | `sustainability` | Porcelain + green glow |
| 08.1 | Business value | `sustainability/BusinessValue` | `benefits` | Stone |
| 09 | Inside Logicity | `site-tour/SiteTourPreview` | `siteTour` | Porcelain (official plan) |
| 10 | News | `news/NewsPreview` | `news` | Porcelain |
| 11 | Enquire | `contact/EnquireBlock` | `enquiry`, `settings` | Stone |
| 12 | Footer | `footer/Footer` | `navigation`, `settings`, partners | **Deep ink** |

The **official master plan** (`/client/image-1731136566206.webp`, 2774×1583) is the one map for §03, §06.1
and §09. `scripts/generate-plan-zones.py` traces seven zones from the drawing's own colours into
`officialZones.ts` (GENERATED — re-run the script, do not edit). The legend → zone mapping is our reading of
the drawing and is **pending client confirmation**. The **location map** (`/client/345.webp`, 1320×1232) with
its traced routes (`mapGeometry.ts`) is shared by §07 and §07.1.

---

## 9. Client integration history and assets

- **Round 1 (2026-10-12):** recoloured onto the client pinwheel; real logo, imagery and verified facts.
  See [`reference/client-site/BRAND-EXTRACT.md`](../reference/client-site/BRAND-EXTRACT.md) and
  [`public/client/MANIFEST.md`](../public/client/MANIFEST.md).
- **Round 2 (2026-10-15):** light theme, Open Sans, the location map, partner and IGBC logos,
  Constra-ready status viewer, real contact details ([`docs/CLIENT-CHANGES-PLAN.md`](../docs/CLIENT-CHANGES-PLAN.md)).
- **Round 3 (2026-10-15):** quiet-luxury system with midnight sections ([`docs/REDESIGN-PLAN.md`](../docs/REDESIGN-PLAN.md)) — superseded by round 4.
- **Round 4 (2026-10-16):** the client's V2 feedback (light, one font) plus the audit: light page, Open
  Sans only, new hero, no opening animation, free-scrolling gallery, interactive official plan, Amenities,
  Gati Shakti map, route spine, inner pages, enquiry API, mobile polish ([`docs/REDESIGN-PLAN-R4.md`](../docs/REDESIGN-PLAN-R4.md)).
- **Stock imagery** (never presented as the site, always labelled "Illustrative"): `public/construction/`
  (§04, Unsplash) and `public/client/amenities/` (five amenity photos: four CC0, one CC BY 2.0 credited on
  its card) — each folder has a `CREDITS.md`. The hero render is the client's own `main.webp`, labelled
  "Illustrative render".

---

## 10. Accessibility

- Semantic landmarks, one `h1` per page, sequential headings, a skip link, a visible focus ring (indigo on
  light, gold on the footer).
- Interactive diagrams have a **real control list** as the primary interface (zone index and chips, route
  planner, glance figures); the SVG/image overlay is an enhancement with pointer hit targets.
- ARIA tabs for News; disclosure buttons for dropdowns and the mobile menu; Esc closes menus and the image
  viewer (which also locks scroll and returns focus). The Rail is a labelled region with a focusable list and
  ←/→ keys.
- Odometers, reveals, tours and routes degrade to final, visible content without JS or under reduced motion
  (checked: no hidden text, no pins, spine fully drawn).
- Lighthouse accessibility is **100** on every page tested.

---

## 11. Performance

Measured on the production build ([`docs/redesign/QA-REPORT-R4.md`](../docs/redesign/QA-REPORT-R4.md)):

| | Score / metric |
|---|---|
| Lighthouse desktop (`/`) | **98** perf · 100 accessibility · 100 best practices · 100 SEO · LCP 1.0s · CLS 0 |
| Lighthouse mobile (`/`) | **~70** perf (57–72 across runs) · 100 / 100 / 100 · LCP 5.2–5.7s (simulated slow 4G) · CLS 0 |
| Cross-browser | Chromium, Firefox, WebKit: no console errors; no horizontal overflow from 320 to 1920px |

Key decisions: the hero render is the LCP (`preload` + `fetchPriority="high"`); scenes mount lazily (§7);
transforms/opacity only; Lenis is off on touch; the 160px logo mark is used inside SVG; the Next.js image
optimiser serves AVIF/WebP. The remaining mobile cost is React hydration plus GSAP set-up. HANDOVER lists
the next steps. The mobile polish was verified not to change desktop: 80 viewport frames at 1440 and 1024
wide are pixel-identical before and after.

---

## 12. Build, run, QA

```bash
npm run dev          # Next dev server (port 3000)
npm run build        # Production build (static generation)
npm run start        # Serve the production build (or launch config "prod" on :3100)
npm run typecheck    # tsc --noEmit
npx lighthouse http://localhost:3100/ --preset=desktop     # with the prod server running
```

Environment: `ENQUIRY_WEBHOOK_URL` (see [`.env.example`](../.env.example)) — required in production.

> ⚠️ Per [`AGENTS.md`](../AGENTS.md), this is Next.js 16.4 with breaking changes vs. older versions. Read
> the relevant guide in `node_modules/next/dist/docs/` before writing code that touches Next APIs (routing,
> `next/image` — e.g. `priority` is now `preload` — fonts, metadata, view transitions).

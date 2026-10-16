# Path Logicity — Architecture

> Technical architecture of the Path Logicity marketing site.
> **Last updated: 2026-10-16** (round 4: light theme, Open Sans only, new hero, free-scrolling gallery; see `docs/REDESIGN-PLAN-R4.md`).
> Design sources, in order of precedence:
> 1. [`docs/REDESIGN-PLAN-R4.md`](../docs/REDESIGN-PLAN-R4.md) — current direction (round 4, light theme). Where it is silent, round 3 ([`docs/REDESIGN-PLAN.md`](../docs/REDESIGN-PLAN.md)) still describes the system
> 2. [`docs/CLIENT-CHANGES-PLAN.md`](../docs/CLIENT-CHANGES-PLAN.md) — client round 2
> 3. [`docs/UI-PLAN.md`](../docs/UI-PLAN.md) — original spec: structure, content, accessibility
>
> Handover and status: [`HANDOVER.md`](./HANDOVER.md). QA: [`docs/redesign/QA-REPORT.md`](../docs/redesign/QA-REPORT.md).

---

## 1. Overview

A marketing site for **Path Logicity**, India's largest Multimodal Logistics Park (MMLP): a
~400-acre hub at Dobbaspet, Bengaluru, built by PATH Group. The site is **homepage-first**: one
long scrolling homepage of 13 chapters, plus holding templates for the inner pages.

**The core idea.** A single thin **route line** threads the page from the hero to the enquiry
button. Each section draws, bends, branches or ends it, so the page behaves like the hub it
describes.

**Visual direction — light and brand-coloured** (round 4; the round 3 notes below are partly superseded: midnight sections and the serif accent are gone):
- **Porcelain/stone** (white with a faint brand tint) light sections throughout. The only deep-indigo
  surface is the footer (about 5% of scroll length).
- **Gold** is the action accent; **indigo** (headings, numerals), **blue** and **green** carry roles.
  The client's pinwheel appears as a 3px signature stripe and in data and legends.
- **One typeface: Open Sans**, the client's brand font. Accent words are colour, not italics.

**Fact-safety.** Only client-supplied facts appear as claims. Every unverified fact (coordinates,
dates, ESG metrics, news) is `null` in the content layer and renders a review-only placeholder.
Placeholders are hidden from visitors and shown only with `?annotations=on`. Nothing is
fabricated.

---

## 2. Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 16.4** (App Router, Turbopack) | ⚠️ Breaking changes vs. older Next. Read `node_modules/next/dist/docs/` before coding (see [`AGENTS.md`](../AGENTS.md)) |
| UI runtime | **React 19.3** | Server Components by default, with islands marked `"use client"`. Uses React's native `<ViewTransition>` for route changes |
| Language | **TypeScript 5.9** | `strict`; the `@/*` alias maps to the project root |
| Styling | **Tailwind CSS v4** | CSS-first `@theme` tokens in [`app/globals.css`](../app/globals.css); there is no `tailwind.config` |
| Scroll scenes | **GSAP 3 + ScrollTrigger** | Route draws, pins, odometers, camera tweens, reveals |
| Smooth scroll | **Lenis** | Mouse and trackpad only; off on touch devices and under reduced motion |
| Micro-interactions | CSS keyframes + GSAP `quickTo` | No second animation library |
| Fonts | `next/font/google` | **Open Sans only** (round 4; `--font-display` and `--font-serif` alias it) |
| Images | `next/image` | AVIF/WebP ([`next.config.ts`](../next.config.ts)) |

Scripts: `dev` · `build` · `start` · `typecheck` (`tsc --noEmit`). Preview configs live in
[`.claude/launch.json`](../.claude/launch.json): `dev` runs on port 3000 and `prod` serves the
production build on port 3100.

---

## 3. Directory structure

```
site/
├─ app/
│  ├─ layout.tsx          Font · head script (annotations) · SmoothScroll ·
│  │                      SurfaceMorph · Nav · <ViewTransition> main · EnquireBlock · Footer ·
│  │                      JourneyRail · MobileActionBar
│  ├─ page.tsx            Homepage — composes the section components (server component)
│  ├─ globals.css         @theme tokens · utilities (type, card, grain, glow, pinwheel-stripe, img-grade)
│  │                      · keyframes (preloader, hero window, marquee, view transition, reveals)
│  ├─ icon.svg            Favicon
│  ├─ path-group/ logicity-advantage/ sustainability/ site-tour/ news/ blogs/   Inner pages (page.tsx each)
│  └─ api/enquiry/route.ts   POST: validate + forward the enquiry to ENQUIRY_WEBHOOK_URL
│
├─ components/
│  ├─ navigation/   Nav (+ MobileMenu), MobileActionBar, JourneyRail, Logo,
│  │                useHeroThreshold (useScrolledPast / useHideOnScroll)
│  ├─ hero/         Hero — midnight cinematic hero on the entry-gate render, window reveal, word rise
│  ├─ stats/        ScaleIndex — 400 odometer → 4 branching nodes with hover image previews
│  ├─ master-plan/  MasterPlan (the official drawing with traced, hoverable zones), officialZones (GENERATED), PlanSvg + planGeometry (schematic, now only the site-tour preview)
│  ├─ project-status/ ProjectStatus — sticky Constra viewer (image or MP4) + milestone timeline
│  ├─ path-group/   PathGroup (glass metrics strip, serif quote), EvolutionLine
│  ├─ gallery/      RendersGallery — midnight, pinned horizontal scroll of client renders
│  ├─ advantage/    HubOpener (midnight showpiece), SpecDrawing, GatiShaktiBand (midnight + partner marquee)
│  ├─ connectivity-map/ ConnectivityMap + mapGeometry — client location map, route overlays, establishing shot
│  ├─ sustainability/ Sustainability (IGBC ring), BusinessValue
│  ├─ site-tour/    SiteTourPreview — midnight perspective plan
│  ├─ news/         NewsPreview — ARIA tabs, featured + rows
│  ├─ contact/      EnquireBlock (image panel, contact rows), EnquiryForm
│  ├─ footer/       Footer — midnight, grain + glow, pinwheel stripe, partner marquee
│  ├─ providers/    SmoothScroll (Lenis), Preloader (M1), SurfaceMorph (M3)
│  └─ ui/           Route, Metric, Counter (odometer), AssetSlot, RevealMedia, ContentSlot,
│                   Button/ArrowLink, Magnetic, SectionHeader, Reveal/RevealLines, Icon,
│                   PartnerLogos, SurveyGrid
│
├─ content/home.ts        Typed seed content — the ONLY place facts live
├─ lib/
│  ├─ accent.tsx          `*word*` → <em> accent words (Instrument Serif italic)
│  ├─ contours.ts         Generative contour art for AssetSlot placeholders
│  ├─ content/
│  │  ├─ index.ts         getHomepage / getSettings / getNavigation / getEnquiry / getPartners, telHref — CMS swap point
│  │  └─ types.ts         Content models (mirror the future CMS schema)
│  └─ motion/
│     ├─ gsap.ts          GSAP + ScrollTrigger registration, MQ media-query presets
│     ├─ hooks.ts         useMotion (lazy, shared IntersectionObserver), useSize, useIsoLayoutEffect …
│     ├─ route.ts         scalePath() + applyRouteProgress() (cached path lengths)
│     └─ useLinks.ts      boxIn / curve / useLinks — measured leader and branch lines
│
├─ public/
│  ├─ client/             Client assets from pathlogicity.com (+ MANIFEST.md): logos, renders, 345.webp map,
│  │                      hero-gate.webp (graded hero), logo-mark-160.png, partners/ (NHLML, RVNL, KIADB, IGBC)
│  ├─ constra/            Drop folder for Constra timelapses/photos (awaited)
│  └─ construction/       Representative stock progress image (labelled as such) + CREDITS.md
├─ reference/             Concept note PDF + client-site/BRAND-EXTRACT.md
├─ docs/                  UI-PLAN · CLIENT-CHANGES-PLAN · REDESIGN-PLAN · redesign/ (phase screenshots, QA report)
└─ architecture files/    ARCHITECTURE.md (this) · HANDOVER.md
```

---

## 4. Rendering & routing

- **Homepage** ([`app/page.tsx`](../app/page.tsx)) is a **Server Component**. It calls the content
  getters at build time and renders the sections in order. Interactive sections are Client
  Components that receive typed props; there is no client-side data fetching.
- **Shared chrome** ([`app/layout.tsx`](../app/layout.tsx)): Nav, JourneyRail (homepage only),
  MobileActionBar, the shared EnquireBlock (the final CTA on every page), Footer, and the
  providers (Preloader, SmoothScroll, SurfaceMorph).
- **Route transitions:** `<main>` is wrapped in React's `<ViewTransition default="page-wipe">`.
  Next.js navigations are transitions, so the old page lifts away and the new one wipes up over a
  midnight curtain (CSS in `globals.css`). This is off under reduced motion.
- **Inner pages** (`/path-group`, `/logicity-advantage`, `/sustainability`, `/site-tour`, `/news`,
  `/blogs`) are real pages (round 4): a `layout/PageHero` (the one `h1`, intro, "On this page") plus the
  same section components the homepage uses, wrapped in `<div data-inner>` so homepage chapter numbers
  are hidden. Anything else is a 404.
- **Enquiry:** `components/contact/EnquiryForm` → `POST /api/enquiry` (`lib/enquiry.ts` holds the shared
  rules) → JSON to `ENQUIRY_WEBHOOK_URL`. Not set: dev logs and succeeds; production returns 503.
- **Sub-sections are anchors** (e.g. `/logicity-advantage#amenities`), so they are shareable.
- **All pages are statically generated.** CMS content will later arrive through ISR or on-demand
  revalidation.

---

## 5. Content layer (CMS readiness)

```
Components ──props──> lib/content/index.ts ──reads──> content/home.ts   (today)
                               └── later: CMS query (Sanity / Payload / Strapi)
```

- **Components never import `content/` directly.** Swapping in a CMS means changing only the
  getters in [`lib/content`](../lib/content/index.ts).
- **Models** ([`lib/content/types.ts`](../lib/content/types.ts)): `SiteSettings` (with `address`),
  `MediaAsset` (`src` may be an image **or an MP4/WebM**, plus an optional `credit`),
  `MetricData`, `ScaleNode` (optional `image`), `Zone`, `Milestone`, `Destination`, `Initiative`,
  `Benefit`, `NewsItem`, `NavItem`, `Partner`, `GalleryItem` (`fit: cover|contain`).
- **Fact-safety by type:** every optional fact is nullable. The UI renders a `ContentSlot` or hides
  the element. `ContentSlot` and asset annotations carry `.slot-annotation`, which CSS hides unless
  `html[data-annotations="on"]` is set (via `?annotations=on`).
- **Accent words:** headline strings in content may wrap 1–2 words in `*asterisks*`.
  `lib/accent.tsx` turns them into `<em>`, rendered in Instrument Serif italic. CMS fields can use
  the same convention.

---

## 6. Design system

### 6.1 Tokens ([`app/globals.css`](../app/globals.css) `@theme`)

| Group | Tokens | Role |
|---|---|---|
| Light surfaces | `porcelain` #f8f8f5 · `stone` #efeeea | Section backgrounds (alternate) |
| Cards | `paper` #fff · `paper-2/3` | Cards, panels, tiles, white text on dark |
| Text | `ink` #111233 · `steel-700` #4a4c5e · `steel-500` #646678 | Headings · body · muted (≥ 4.5:1 on stone) |
| Midnight | `midnight` #0d0e35 · `midnight-2` #16174a | Deep anchor sections, footer, hero |
| Brand indigo | `indigo-700` #201f85 (+ 500/400/300/50) | Labels, links, accent words on light, hover wipes |
| **Gold** | `yellow-400` #e7ac00 (+ 300/200/50) | **The one accent**: CTAs, rules, route comet, numerals and accent words on midnight. Never small text on white |
| Pinwheel | `green-500` #449e35 · `blue-500` #0066b1 · `orange-500` #ff6600 | Signature stripe, map legend and modes, sustainability (green), status dots |

`:root` also holds `--margin`, `--gutter`, `--line-*` and `--shadow-card` (a layered soft shadow).

### 6.2 Typography (`@utility`)
- `t-hero` (≤ 6rem) · `t-xl` · `t-l` · `t-m` · `t-s` use Plus Jakarta Sans at 500–600 weight,
  with tight tracking and slight word spacing. `t-xxl` is the big numeral.
- `t-body-l`: Open Sans at 17–19.5px, line-height 1.7. Labels (`t-label`, `t-micro`) are 12px,
  uppercase and wide-tracked.
- Accent words: `em` inside headings uses `font-serif` italic, coloured by `--accent-color`
  (indigo by default, gold inside `.on-dark`, overridable per line).

### 6.3 Surfaces and utilities
- `shell` (max 1600px), `grid-12` (4 → 8 → 12 columns), `section-pad` (generous), `card` (white,
  2px radius, soft shadow).
- **Dark surface (footer only):** `bg-indigo-700` + `on-dark` (gold focus ring, gold accent words) +
  `grain` + `glow-brand` + `data-surface="dark"` (for SurfaceMorph). The hero (porcelain panel and a
  diagonal image panel) and every other section are light.
- `pinwheel-stripe` (2px, four colours): under the solid nav, at the top of Gati Shakti and the
  footer, and in the preloader.
- `img-grade` (one colour grade for every photo). The hero grade is baked into
  `public/client/hero-gate.webp` for performance.

### 6.4 The signature device — `Route` ([`components/ui/Route.tsx`](../components/ui/Route.tsx))
- Paths are written in **normalised 0–100 space**. `scalePath()` rescales them to the measured
  container. `applyRouteProgress()` drives a dormant hairline, a trail and a gold comet head;
  path lengths are cached per geometry.
- `tone` is the surface the route sits on. Light (default) gives an indigo hairline and trail;
  dark gives white.
- There are three drive modes: imperative (`ref.set(p)`), `auto="scrub"` and `auto="enter"`. The
  route renders fully drawn for SSR, no-JS and reduced motion.

---

## 7. Motion system

**Setup:** [`lib/motion/gsap.ts`](../lib/motion/gsap.ts) exposes the `MQ` presets (`motion`,
`desktop`, `mobile`). Every scene runs inside `gsap.matchMedia()`, so **nothing animates under
reduced motion**.

**Lazy scenes:** [`useMotion`](../lib/motion/hooks.ts) sets up scenes within 1.5 viewports of the
fold immediately. Other scenes are set up when they come within one viewport, through a **single
shared IntersectionObserver**. A coalesced `ScrollTrigger.refresh()` runs only when a late scene
creates a pin.

| ID | Motion | Where |
|---|---|---|
| M1 | ~~Pinwheel preloader~~ **Removed in round 4** (no opening animation) | — |
| M2 | ~~Hero window reveal and word rise~~ **Removed in round 4.** The hero is complete on first paint; only a scroll-linked route draw and 5% parallax remain | `hero/Hero` |
| M3 | Surface morph: an entering light or dark section blends from the previous colour (`immediateRender:false`, completes before its text is readable) | `providers/SurfaceMorph` |
| M4 | Image reveal: wipe up behind a gold leading edge, settle from 1.2×, ±5% parallax | `ui/RevealMedia` (inside `AssetSlot`; `reveal={false}` opts out) |
| M5 | ~~Pinned gallery~~ **Replaced in round 4** by a native scroll-snap `Rail` (drag, arrows, ←/→, progress); the page is never captured | `ui/Rail`, `gallery/RendersGallery` |
| M6 | Magnetic CTAs (fine pointers only), via `display: contents` wrapper + `data-magnetic-inner` | `ui/Magnetic` |
| M7 | Odometer digits (reels; final value stays in the DOM for SSR and screen readers) | `ui/Counter` |
| M8 | Map establishing shot (site → region on scroll) + gold route traces; any click hands control to the user | `connectivity-map/ConnectivityMap` |
| M9 | Partner logo marquee (pauses on hover; static under reduced motion) | `ui/PartnerLogos marquee` |
| M10 | Hub showpiece: routes converge, the pinwheel spins in, gold pulse | `advantage/HubOpener` |
| M11 | Section intro paragraphs fade up (letter-spacing settle removed in round 4) | `ui/Reveal`, `ui/SectionHeader` |
| M13 | Route spine: the page-wide margin line with section nodes, gold drawn by scroll (round 4) | `navigation/RouteSpine` |
| M12 | Route transitions (`<ViewTransition>`) | `app/layout.tsx` + CSS |

**Pinned scenes:** the hero (desktop, scrubbed exit) and the renders gallery (desktop). Each is
one ScrollTrigger, killed on unmount.

**Scroll state:** the nav, rail and action bar use `useScrolledPast` / `useHideOnScroll`, which
re-render only when a threshold is crossed, never per frame.

---

## 8. Homepage sections (order and data flow)

| # | Section | Component | Content | Surface |
|---|---|---|---|---|
| 01 | Hero | `hero/Hero` | `hero`, `settings` | Midnight over the entry-gate render |
| 02 | Scale | `stats/ScaleIndex` | `scale` | Porcelain |
| 03 | Master plan | `master-plan/MasterPlan` | `zones` | Stone (official drawing, interactive) |
| 04 | Project status | `project-status/ProjectStatus` | `milestones`, `statusLastUpdated` | Porcelain |
| 05 | PATH Group | `path-group/PathGroup` | `pathGroup` | Stone |
| 05.5 | Renders gallery | `gallery/RendersGallery` | `renders` | Stone |
| 06 | Hub opener | `advantage/HubOpener` | — | Porcelain |
| 06.1 | At a glance | `advantage/SpecDrawing` | `glance` | Stone |
| 06.2 | Amenities | `advantage/Amenities` | `amenities` | White (cards on porcelain) |
| 07 | Connectivity | `connectivity-map/ConnectivityMap` | `destinations` | Porcelain |
| 07.1 | PM Gati Shakti + partners | `advantage/GatiShaktiBand` (+ `MmlpNetwork`) | `gatiShakti`, `partners` | Stone |
| 08 | Sustainability | `sustainability/Sustainability` | `sustainability` | Porcelain + green glow |
| 08.1 | Business value | `sustainability/BusinessValue` | `benefits` | Stone |
| 09 | Site tour | `site-tour/SiteTourPreview` | `siteTour` | Porcelain |
| 10 | News | `news/NewsPreview` | `news` | Porcelain |
| 11 | Enquire | `contact/EnquireBlock` | `enquiry`, `settings` | Stone |
| 12 | Footer | `footer/Footer` | `navigation`, `settings`, partners | **Deep indigo** |

---

## 9. Client integration history

- **Round 1 (2026-10-12):** recoloured onto the client pinwheel; real logo, imagery and verified
  facts. See [`reference/client-site/BRAND-EXTRACT.md`](../reference/client-site/BRAND-EXTRACT.md)
  and [`public/client/MANIFEST.md`](../public/client/MANIFEST.md).
- **Round 2 (2026-10-15):** light theme, font change, the location map on the client's own
  `345.webp` (route points in image pixel space, Catmull-Rom smoothed), partner and IGBC logos,
  Constra-ready status viewer, real contact details. See
  [`docs/CLIENT-CHANGES-PLAN.md`](../docs/CLIENT-CHANGES-PLAN.md).
- **Round 3 (2026-10-15, premium redesign):** quiet-luxury system, midnight anchors, renders
  gallery, motion M1–M12, QA. See [`docs/REDESIGN-PLAN.md`](../docs/REDESIGN-PLAN.md).

---

## 10. Accessibility

- Semantic landmarks, one `h1`, sequential headings, a skip link, and a visible focus ring:
  indigo on light, gold on `.on-dark`, including the nav while it floats over the hero.
- Interactive diagrams have a **real control list** as the primary interface (zone index, route
  planner); the SVG is an enhancement.
- ARIA tabs for News; disclosure buttons for dropdowns; Esc closes menus.
- Odometers, reveals and the preloader all degrade to final, visible content without JS or under
  reduced motion (verified: no hidden content).
- Lighthouse accessibility is **100**. Decorative dimming only touches `aria-hidden` numerals, at
  ≥ 3:1 contrast.

---

## 11. Performance

Measured on the production build ([`docs/redesign/QA-REPORT.md`](../docs/redesign/QA-REPORT.md)):

| | Score / metric |
|---|---|
| Lighthouse desktop | **98** perf · 100 accessibility · 100 best practices · 100 SEO · LCP 1.0s · CLS 0 (round 4) |
| Lighthouse mobile | **~70** perf (57–72 across runs) · 100 accessibility · 100 best practices · 100 SEO · CLS 0 |
| Real paint (412px, 4× CPU) | FCP 256ms · LCP 624ms |

Key decisions:
- The hero poster is the LCP (preloaded); its grade is baked into the file.
- The preloader is skipped on phones.
- Scenes mount lazily (§7).
- Hero reveal and parallax use transforms only.
- Lenis is off on touch.
- The 160px logo mark is used inside SVG.
- Instrument Serif is not preloaded.

The remaining mobile cost is React hydration plus GSAP set-up. HANDOVER lists the next steps.

---

## 12. Build, run, QA

```bash
npm run dev          # Next dev server (port 3000)
npm run build        # Production build (static generation)
npm run start        # Serve the production build (or launch config "prod" on :3100)
npm run typecheck    # tsc --noEmit
npx lighthouse http://localhost:3100/ --view    # with the prod server running
```

> ⚠️ Per [`AGENTS.md`](../AGENTS.md), this is Next.js 16.4 with breaking changes vs. older
> versions. Read the relevant guide in `node_modules/next/dist/docs/` before writing code that
> touches Next APIs (routing, `next/image`, fonts, metadata, view transitions).

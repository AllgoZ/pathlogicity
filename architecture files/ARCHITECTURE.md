# Path Logicity — Architecture

> Technical architecture of the Path Logicity marketing site.
> Last updated: 2026-10-12 · Source of design truth: [`docs/UI-PLAN.md`](../docs/UI-PLAN.md)

---

## 1. Overview

A marketing site for **Path Logicity** — India's largest Multimodal Logistics Park
(MMLP), a ~400-acre hub at Dobbaspet, Bengaluru, built by PATH Group. The site is
**homepage-first**: one long scrolling homepage composed of 12 chapters, plus holding
templates for inner pages (built after homepage sign-off).

**The core idea.** A single thin **route line** threads the whole page, from the hero to
the enquiry button. Each section draws, bends, branches, or ends that line — the page
behaves like the hub it describes. The visual language is a "technical survey drawing":
dark navy depth, hairline grids, mono labels, and animated line-work.

**Fact-safety.** Only client-supplied facts appear as claims. Every unverified fact
(coordinates, distances, dates, ESG metrics, news) is `null` in the content layer and
renders as a labelled placeholder slot — never fabricated.

---

## 2. Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 16.4** (App Router) | ⚠️ Breaking changes vs. older Next — read `node_modules/next/dist/docs/` before coding (see [`AGENTS.md`](../AGENTS.md)) |
| UI runtime | **React 19.3** | Server Components by default; islands marked `"use client"` |
| Language | **TypeScript 5.9** | `strict`; `@/*` path alias → project root |
| Styling | **Tailwind CSS v4** | CSS-first `@theme` tokens in [`app/globals.css`](../app/globals.css); no `tailwind.config` |
| Scroll scenes | **GSAP + ScrollTrigger** | Route draws, pinned scenes, counters, camera tweens |
| Smooth scroll | **Lenis** | Disabled under reduced motion |
| Micro-interactions | Plain CSS transitions/keyframes | No second animation library |
| Fonts | `next/font/google` | Manrope (display), Inter (text), JetBrains Mono (technical) |

Scripts: `dev` · `build` · `start` · `typecheck` (`tsc --noEmit`). Dev preview config in
[`.claude/launch.json`](../.claude/launch.json) (port 3000).

---

## 3. Directory structure

```
site/
├─ app/                         App Router entry
│  ├─ layout.tsx                Fonts, Nav, JourneyRail, EnquireBlock, Footer, SmoothScroll, MobileActionBar
│  ├─ page.tsx                  Homepage — composes the 12 section components (server component)
│  ├─ globals.css               @theme design tokens + utilities + keyframes
│  ├─ icon.svg                  Favicon
│  └─ [chapter]/page.tsx        Holding template for inner pages (static params, dynamicParams=false)
│
├─ components/                  One folder per section + /ui primitives
│  ├─ navigation/   Nav, NavDropdown(in Nav), MobileMenu, MobileActionBar, JourneyRail, Logo, useHeroThreshold
│  ├─ hero/         Hero (pinned scroll scene, video/poster slot, location HUD, reticle)
│  ├─ stats/        ScaleIndex (400 → 4 branching nodes)
│  ├─ master-plan/  MasterPlan, PlanSvg, planGeometry.ts (interactive zone plan + bottom sheet)
│  ├─ project-status/ ProjectStatus (sticky media + milestone timeline + scrubber)
│  ├─ path-group/   PathGroup, EvolutionLine (editorial paper chapter)
│  ├─ advantage/    HubOpener (converging routes), SpecDrawing (axonometric callouts), GatiShaktiBand
│  ├─ connectivity-map/ ConnectivityMap, mapGeometry.ts (SVG schematic + route planner + camera levels)
│  ├─ sustainability/ Sustainability (IGBC ring), BusinessValue (spec row of diagram-icons)
│  ├─ site-tour/    SiteTourPreview (perspective plan orbit)
│  ├─ news/         NewsPreview (ARIA tabs, featured + rows, graceful sparsity)
│  ├─ contact/      EnquireBlock, EnquiryForm (intent toggle, industry chips, validation)
│  ├─ footer/       Footer (link columns + oversized wordmark)
│  ├─ providers/    SmoothScroll (Lenis)
│  └─ ui/           Route, Metric, AssetSlot, ContentSlot, Button/ArrowLink, SectionHeader,
│                   Counter, Icon, Reveal, SurveyGrid
│
├─ content/
│  └─ home.ts                   Typed seed content — the ONLY place facts live
├─ lib/
│  ├─ content/
│  │  ├─ index.ts               getHomepage() / getSettings() / getNavigation() / getEnquiry() — CMS swap point
│  │  └─ types.ts               All content models (mirror future CMS schema)
│  ├─ contours.ts               Generative contour paths for AssetSlot placeholders
│  └─ motion/
│     ├─ gsap.ts                GSAP registration + MQ media-query presets
│     ├─ route.ts               scalePath() + applyRouteProgress() — the route maths
│     ├─ hooks.ts               useSize, useIsoLayoutEffect, …
│     └─ useLinks.ts            Smooth-scroll anchor link handling
│
├─ public/
│  └─ client/                   Client brand assets scraped from pathlogicity.com (+ MANIFEST.md)
├─ reference/                   Concept note PDF + client-site/BRAND-EXTRACT.md
├─ docs/UI-PLAN.md              Full design spec (source of truth)
└─ architecture files/          This document
```

---

## 4. Rendering & routing model

- **Homepage** ([`app/page.tsx`](../app/page.tsx)) is a **Server Component**. It calls the
  content getters at build time and renders the section components top to bottom. Interactive
  sections are Client Components (`"use client"`) that receive typed props — no client-side
  data fetching.
- **Shared chrome** lives in [`app/layout.tsx`](../app/layout.tsx): `Nav`, `JourneyRail`,
  `MobileActionBar`, the shared `EnquireBlock` (final CTA, on every page per the brief),
  `Footer`, and the `SmoothScroll` (Lenis) provider.
- **Inner pages** (`/path-group`, `/logicity-advantage`, `/sustainability`, `/site-tour`,
  `/news`, `/blogs`) are served by [`app/[chapter]/page.tsx`](../app/%5Bchapter%5D/page.tsx)
  as holding templates. `generateStaticParams()` enumerates them and `dynamicParams = false`
  404s anything else. Full templates follow homepage sign-off (UI-PLAN §6).
- Sub-sections are **anchors** (e.g. `/logicity-advantage#amenities`) so dropdown links scroll
  to them and are shareable.
- All pages are **statically generated**; CMS content will arrive via ISR / on-demand revalidation.

---

## 5. Content layer (CMS readiness)

The single most important architectural seam.

```
Components ──props──> lib/content/index.ts ──reads──> content/home.ts   (today)
                               │
                               └── later: CMS query (Sanity / Payload / Strapi)
```

- **Components never import `content/` directly.** They import getters from
  [`lib/content`](../lib/content/index.ts). Swapping the data source to a CMS means changing
  only those getters — the UI is untouched.
- **Models** are defined in [`lib/content/types.ts`](../lib/content/types.ts): `SiteSettings`,
  `MediaAsset`, `MetricData`, `ScaleNode`, `Zone`, `Milestone`, `Destination`, `Initiative`,
  `Benefit`, `NewsItem`, `NavItem`. These mirror the future CMS schema.
- **Fact-safety is enforced by types:** every optional fact (`distanceKm`, `coordinates`,
  `milestone.date`, `initiative.metric`, `news.*`) is nullable. The UI renders a `ContentSlot`
  or hides the element when the value is `null`, so a made-up value can never appear by accident.
- **`MediaAsset`** carries `slot`/`spec`/`alt` plus optional `src`/`poster`. When `src` is
  present, `AssetSlot` shows the real image; when absent, it shows the framed placeholder.

---

## 6. Design system

### 6.1 Tokens ([`app/globals.css`](../app/globals.css), `@theme`)
- **Depth:** `ink`, `navy-950/900/800/700`, `indigo-700…300` (map land, rail, data on dark).
- **Client brand accents** (scraped from the live site — see
  [`reference/client-site/BRAND-EXTRACT.md`](../reference/client-site/BRAND-EXTRACT.md)):
  - `yellow-400` = **gold `#e7ac00`** — **action only** (CTAs, focus ring, route head)
  - `green-500` = **`#449e35`** — sustainability + completed state
  - `blue-500` = **`#0066b1`**, `indigo-700` = **`#201f85`** — connectivity / data
  - `orange-500` = **`#ff6600`** — supporting pinwheel accent
- **Light:** `paper`, `paper-2`, `steel-700…300`. **Lines:** `--line-dark/-light` (hairlines).
- **Motion:** `--ease-out-expo`, `--ease-route`, `--animate-pulse-soft`.
- **Strict colour roles** are a design rule, not just convention: gold = action, green =
  sustainability/completed. The client recolour kept the roles and only remapped the hex.

### 6.2 Layout & type utilities (CSS `@utility`)
- `shell` (max 1600px + responsive margin), `grid-12` (4 → 8 → 12 cols), `section-pad`.
- Type scale: `t-hero`, `t-xxl`, `t-xl`, `t-l`, `t-m`, `t-s`, `t-body-l`, `t-label`, `t-micro`,
  `tnum` — all fluid `clamp()` with hand-tuned tracking/leading.
- Textures: `dot-field` / `dot-field-light` (survey grid), `SurveyGrid` component for section grids.

### 6.3 The signature device — `Route` ([`components/ui/Route.tsx`](../components/ui/Route.tsx))
One SVG primitive renders the moving "vehicle" line everywhere:
- Takes a path `d` in **normalised 0–100 space**; `scalePath()` ([`lib/motion/route.ts`](../lib/motion/route.ts))
  rescales it to the measured container size (via `useSize`), re-applied on resize.
- `applyRouteProgress(p, …)` drives a dormant hairline + a fading trail + a yellow comet head
  via `stroke-dashoffset` / `pathLength`.
- Three drive modes: **imperative** (`ref.set(p)` for scroll-synced scenes), `auto="scrub"`
  (ScrollTrigger scrub), `auto="enter"` (timed draw on entry). Defaults to fully drawn for
  SSR / no-JS / reduced motion.
- **Continuity hand-off:** each section's route exits at a named column "port" and the next
  enters at the same x, so the line reads as one unbroken path across section boundaries
  (UI-PLAN §3.4).

---

## 7. Motion system

- **Setup** ([`lib/motion/gsap.ts`](../lib/motion/gsap.ts)): registers `ScrollTrigger`, sets
  defaults, and exposes `MQ` media-query presets (`motion`, `desktop`, `mobile`).
- **`gsap.matchMedia()`** gates every scroll scene on `(prefers-reduced-motion: no-preference)`
  and on breakpoint — pinned desktop scenes become time-based reveals on mobile, and nothing
  animates under reduced motion.
- **Allowed motion:** line clip reveals, scrubbed route draws, counters (one pass), clip-path
  wipes, slow video zoom, pinned horizontal scroll, map camera viewBox tweens.
- **Pinned scenes** (only three): Hero, Master Plan, Amenities. Each uses one ScrollTrigger,
  killed on unmount.
- **Reduced motion** (global, enforced in CSS + JS): routes render fully drawn, counters show
  final values, no pinning/parallax, site-tour orbit stops, Lenis disabled. Counters keep the
  final number in the DOM so screen readers announce the real value, not "0".

---

## 8. Homepage sections (data flow)

| # | Section | Component | Key content | Interaction |
|---|---|---|---|---|
| 01 | Hero | `hero/Hero` | `hero` + `settings` | Pinned scroll scene; video/poster slot; location HUD + site reticle |
| 02 | Scale Index | `stats/ScaleIndex` | `scale` | 400 counter → route branches to 4 nodes |
| 03 | Master Plan | `master-plan/MasterPlan` | `zones` | Interactive SVG zones + index + detail panel / bottom sheet |
| 04 | Project Status | `project-status/ProjectStatus` | `milestones`, `statusLastUpdated` | Sticky media + milestone timeline + scrubber |
| 05 | PATH Group | `path-group/PathGroup` | `pathGroup` | Paper chapter; metric band; evolution line |
| 06a | Advantage opener | `advantage/HubOpener` | — | ~24 routes converge on the hub (scrubbed) |
| 06b | At a glance | `advantage/SpecDrawing` | `glance` | Axonometric plan + leader-line callouts |
| 07a | Connectivity | `connectivity-map/ConnectivityMap` | `destinations` | Route planner + 3 camera levels + mode legend |
| 07b | PM Gati Shakti | `advantage/GatiShaktiBand` | `gatiShakti` | Typographic equation resolving to the hub |
| 08a | Sustainability | `sustainability/Sustainability` | `sustainability` | IGBC ring (route closes into a circle) |
| 08b | Business Value | `sustainability/BusinessValue` | `benefits` | 5-col spec row of animated diagram-icons |
| 09 | Site Tour | `site-tour/SiteTourPreview` | `siteTour` | Perspective plan on a slow orbit |
| 10 | News | `news/NewsPreview` | `news` | ARIA tabs; featured + rows; graceful sparsity |
| 11 | Final CTA | `contact/EnquireBlock` → `EnquiryForm` | `enquiry`, `settings` | Intent toggle; industry chips; route ends at Submit |
| 12 | Footer | `footer/Footer` | `navigation`, `settings` | Link columns + oversized wordmark |

---

## 9. Client brand integration (2026-10-12)

The client asked to keep this UI/UX + animation but adopt their existing brand from
[pathlogicity.com](https://www.pathlogicity.com/). Approach: **recolour in place + real imagery
+ verified facts**, with zero structural/animation change.

- **Colours:** `@theme` token hex values remapped onto the client pinwheel (gold/green/blue/
  indigo/orange); hardcoded marker/route RGBs updated to match. Role system preserved.
- **Logo:** [`navigation/Logo.tsx`](../components/navigation/Logo.tsx) uses the client's official
  assets — pinwheel mark (`logo-mark.png`) + wordmark text (`logo-text{,-white}.png`, white keyed
  out, tone-matched: paper-white on dark, full colour on light). Layout unchanged.
- **Imagery:** `AssetSlot` extended with an optional `src` — a real client photo fills the same
  framed slot (registration corners kept) via `next/image`. Wired into Hero, PATH Group, zones,
  Sustainability, and News.
- **Facts:** `content/home.ts` updated with verified figures (27 yrs · 17+ states · ~5,000
  workforce · Phase 1 Q4 2026 · Mangalore 339 km · Chennai 376 km · KIA 55 km · Dodbele 3.5 km)
  and the real project updates in News.
- **Assets:** downloaded to [`public/client/`](../public/client) (served at `/client/*`),
  catalogued in [`public/client/MANIFEST.md`](../public/client/MANIFEST.md); full extract in
  [`reference/client-site/BRAND-EXTRACT.md`](../reference/client-site/BRAND-EXTRACT.md).

**Open reconciliations:** certification (our *IGBC Platinum* vs client *GRIHA*); official logo
file for a transparent/white version; whether to surface the real master-plan image anywhere.

---

## 10. Accessibility

- Semantic landmarks, one `h1` (hero), sequential headings, skip link, visible focus
  (2px gold on dark / navy on light, never removed).
- Every interactive map/diagram has a **real control list** as the primary interface (zone
  index, route planner); the SVG is a focusable enhancement with `aria-pressed`/`aria-selected`.
- ARIA tabs for News; disclosure buttons for dropdowns; bottom sheets trap focus and close on Esc.
- Counters keep the final value in the DOM; `AssetSlot` wrappers carry `role="img"` + label
  (the inner real image is decorative `alt=""`).
- Full `prefers-reduced-motion` support (see §7). Contrast verified per token pair (gold is
  never text on paper).

---

## 11. Performance

- Hero **poster is the LCP** (preloaded, `priority`); video starts after paint, skipped on
  Save-Data / slow / reduced motion.
- `next/image` (AVIF/WebP, responsive `sizes`, lazy below the fold) — configured in
  [`next.config.ts`](../next.config.ts).
- Heavy islands (master plan, connectivity map, site tour) mount on approach; animate only
  `transform` / `opacity` / `clip-path` / `stroke-dashoffset`; one ScrollTrigger per scene,
  killed on unmount.
- Targets (UI-PLAN §9): LCP < 2.0s (4G mobile), CLS < 0.05, INP < 200ms, initial JS < 180 KB gz.

---

## 12. Build & run

```bash
npm run dev        # Next dev server (port 3000)
npm run build      # Production build (static generation)
npm run start      # Serve the production build
npm run typecheck  # tsc --noEmit
```

> ⚠️ Per [`AGENTS.md`](../AGENTS.md), this is Next.js 16.4 with breaking changes vs. older
> versions. Read the relevant guide in `node_modules/next/dist/docs/` before writing code that
> touches Next APIs (routing, `next/image`, fonts, metadata).

# Path Logicity — Handover

> Living status document. **Update the "Status" and "Change log" sections whenever work lands**
> (newest first). How the system works is in [`ARCHITECTURE.md`](./ARCHITECTURE.md).
> **Last updated: 2026-10-22** — `main` is at `d1e37aa`; client round 5 is done in the working tree (not committed yet).

---

## 1. Status at a glance

| Item | State |
|---|---|
| Homepage | **Round 4 complete and live on `main`**: light theme, Manrope + Inter (round 5), no preloader (the hero banner has ambient motion), interactive official master plan (used in §03, §06.1 and §09), Amenities, Gati Shakti location map, route spine, mobile polish. Plan and audit: `docs/REDESIGN-PLAN-R4.md` |
| Inner pages | **Built:** `/path-group`, `/logicity-advantage`, `/sustainability`, `/site-tour`, `/news`, `/blogs` (each a `PageHero` plus the homepage sections). Blogs shows a designed empty state until real posts exist |
| Enquiry form | Wired to `POST /api/enquiry`. **Needs `ENQUIRY_WEBHOOK_URL`** (e.g. in Vercel) or production shows a call/email fallback instead of sending |
| Parked by decision | **Constra** project-status content (the viewer is built; the footage is not on the site) |
| Branch | `main` = `origin/main` = `c8c4086`. Also pushed: `client-round-2`, `mobile-polish`, `hero-line-mobile` (all fully merged — safe to delete) |
| Client round 5 | **Done, uncommitted**: plan in `docs/PLAN-CLIENT-ROUND-5.md`. Typecheck clean, build passes. Waiting on the Warehouse 17 photo and the Constra URL + figures (see §4) |
| Pull request | PR #1 (round 2) was merged earlier. Round 4 went to `main` by fast-forward/merge, with no PR |
| Uncommitted | Nothing, apart from these two docs while they are being updated |
| Quality | Typecheck clean · build passes · Lighthouse desktop **98**/100/100/100 · mobile **~70** (57–72)/100/100/100 · CLS 0 · Chromium, Firefox and WebKit clean · no overflow 320–1920px |
| Browsers | Edge, Firefox, WebKit (Safari engine) checked headless. **No physical-device pass yet** |

---

## 2. Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run start        # serve the build (the .claude/launch.json "prod" config uses port 3100)
npm run typecheck
```

- Add **`?annotations=on`** to any URL to see every placeholder slot and missing-content marker. They are
  hidden from visitors by default.
- Copy `.env.example` to `.env.local` and set **`ENQUIRY_WEBHOOK_URL`** to test delivery. Unset in dev, the
  API logs the enquiry and answers success (the form shows a review-only "not delivered" note).
- There is **no preloader any more** — nothing plays on load.
- ⚠️ This is **Next.js 16.4**. Read `node_modules/next/dist/docs/` before touching Next APIs (see `AGENTS.md`).

---

## 3. Where things are

| Need to change… | Go to |
|---|---|
| Any fact, copy, image or link | `content/home.ts` only. Components read it through `lib/content/index.ts` |
| A headline accent word | Wrap it in `*asterisks*` in the content string (rendered by `lib/accent.tsx`, colour only) |
| Colours, type scale, utilities | `app/globals.css` (`@theme` + `@utility`) |
| Hero image / copy / reticle label | `hero` in `content/home.ts` (`video.poster` is the render `/client/hero-main.webp`; `hero.photo.src` is the Warehouse 17 photo that replaces it when the file exists; set `video.src` for a film) |
| Fonts and type scale | `app/layout.tsx` (Manrope + Inter) · `@utility t-*` in `app/globals.css` · `ui/Metric.tsx` sizes |
| PATH Group verticals, About, figures | `pathGroup` in `content/home.ts` (`verticals`, `about`, `metrics`); images and sources in `public/client/path-group/` |
| Leased / available space and Constra links | `leasing` and `constra` in `content/home.ts`, shown by `project-status/SpaceAvailability.tsx` |
| Hero route (desktop) and phone line | `components/hero/Hero.tsx` (`HERO_ROUTE`, `MOBILE_ROUTE`, `MOBILE_PIN`) |
| The page-wide route line | `components/navigation/RouteSpine.tsx` |
| Motion for a section | `useMotion(ref, mm => mm.add(MQ.motion, …))`, lazy and reduced-motion safe |
| Official plan zones | `scripts/generate-plan-zones.py` — re-run after any new plan drawing (`pip install numpy opencv-python-headless pillow`); the legend colour → zone mapping is `ZONES`; output is `master-plan/officialZones.ts` (do not hand-edit) |
| Figures' places on the plan (§06.1) | `ANCHORS` in `components/advantage/SpecDrawing.tsx` (image pixel space 2774×1583) |
| Zone zoom levels / tour order (§09) | `ZOOM` and `TOUR` in `components/site-tour/SiteTourPreview.tsx` |
| Map routes / pins (§07 and §07.1) | `components/connectivity-map/mapGeometry.ts` (pixel space of `public/client/345.webp`, 1320×1232); label placement in `PLACE` in `advantage/GatiShaktiMap.tsx` |
| Amenities and their photos | `amenities` in `content/home.ts`; files and licences in `public/client/amenities/` (+ `CREDITS.md`) |
| Blog posts | `blogs` in `content/home.ts` (empty today — never invent posts) |
| Partner logos | `partners` in `content/home.ts` + files in `public/client/partners/` |
| Constra footage | Put files in `public/constra/` and point `milestones[].media.src` at them (MP4/WebM play inline) |
| Enquiry rules / destination | `lib/enquiry.ts` (shared validation) · `app/api/enquiry/route.ts` · `ENQUIRY_WEBHOOK_URL` |
| Phone-only behaviour | `providers/MobileMotion.tsx` (reveals) · `ui/ImageViewer.tsx` · `ui/Rail.tsx` · `Nav.tsx` (menu) · `MobileActionBar.tsx` · see `docs/PLAN-MOBILE.md` |
| Design rationale | `docs/REDESIGN-PLAN-R4.md` (current) · `docs/PLAN-*.md` (features) · `docs/CLIENT-CHANGES-PLAN.md` (round 2) · `docs/UI-PLAN.md` (original spec) |
| QA results and how to re-run | `docs/redesign/QA-REPORT-R4.md` · screenshots in `docs/redesign/r4/` |

**Unused leftovers** (safe to delete): `PlanSvg.tsx`, `planGeometry.ts`, `MmlpNetwork.tsx`, `SurveyGrid.tsx`;
`public/client/hero-gate.webp`, `main2.webp`, `logo-lockup-indigo.webp`.

---

## 4. Waiting on the client

These items are blocked on content or a decision. Each is usually a single `content/home.ts` edit or file
drop.

| # | Item | Where it goes |
|---|---|---|
| 1 | **Enquiry destination** — where leads should go (CRM, email relay, automation webhook) | `ENQUIRY_WEBHOOK_URL` in the host environment |
| 2 | **Constra collaterals** — timelapse / drone / progress photos with dates (parked; the milestone phases are Lorem ipsum by the client's instruction until then). Milestone 03 shows a labelled stock image. The Constra project holds ~12 edited comparison and aerial MP4s per capture round; confirm which may be published | `public/constra/` → `milestones` |
| 3 | **Confirm the official-plan zone mapping** — we read the legend as: Warehousing = warehouse + transit warehouse; Rail Terminal = railway terminal; Dry Port/ICD = CFS shed; Commercial = commercial area; Yards = open warehouse + surface parking; Roads; Green. A wrong mapping would mislabel the drawing | `ZONES` in `scripts/generate-plan-zones.py` |
| 4 | **PATH Group figures**: now the client's round-5 numbers (31 years · 18 states · 6,500 lane km · ~6,000 workforce); pathltd.com itself lists 30 / 18 / 6,100. The new "track record" strip (45 toll plazas, 30 wayside amenities, 26 EPC …) and the About text were taken from pathltd.com on 2026-10-22: **confirm them**, and the "more than three decades" wording | `pathGroup.metrics`, `pathGroup.about` |
| 5 | **Confirm IGBC Platinum Pre-Certification** (their site lists *GRIHA*) | `sustainability.certification` |
| 6 | **Real site photographs for the amenities** (five cards use illustrative stock) and for the **Commercial / Yards / Green** zones | `amenities[].image`, `zones[].media.src` |
| 7 | Leasing contact name, **WhatsApp number**, **brochure PDF** | `settings` |
| 8 | YouTube and X links | `settings.socials` |
| 9 | Privacy notice and terms pages; consent wording for the form | Footer + `EnquiryForm` |
| 10 | Milestone dates (01, 03), "last updated" date, two news dates, and **years for the PATH Group timeline** | `milestones`, `statusLastUpdated`, `news`, `pathGroup.evolution[].year` |
| 11 | Verified site coordinates (hero HUD, directions) | `settings.coordinates` |
| 12 | Sustainability initiative details / metrics | `sustainability.initiatives[]` |
| 13 | Hero **drone video** (the hero is an illustrative render) and the Logicity360 3D tour embed. A higher-resolution original of the hero render (currently 1462px wide) would look sharper on large screens | `hero.video.src`, `siteTour` |
| 14 | A real PATH project photo — the current PATH Group aerial appears to be a non-PATH warehouse park | `pathGroup.photo` |
| 15 | High-resolution, transparent **wordmark** (the current PNG is 109×42) | `public/client/logo-text*.png` |
| 16 | **Approve the copy we wrote**: the hero location line, the inner-page intros, the enquiry confirmation text, the blog empty state | `content/home.ts`, `EnquiryForm`, `layout/PageHero` usages |
| 18 | **Warehouse 17 site photograph** (round 5): drop it at `public/client/warehouse-17.webp` (~2000 px wide); the hero switches to it by itself and labels it "Warehouse 17 · site photograph". Then move the site reticle (`left-[76%] top-[31%]` in `Hero.tsx`) onto the building | `public/client/warehouse-17.webp` |
| 19 | **Constra** (round 5): the project/dashboard URL, leased / available / total sq. ft. (and the unit list), and which collaterals to link (site progress, drone, reports …). Until then visitors see an enquiry card | `leasing`, `constra` in `content/home.ts` |
| 20 | **Approve the Manrope + Inter pairing**, and a full-resolution highway photo for the PATH Group banner (the pathltd.com original is 800 px wide) | `app/layout.tsx`, `public/client/path-group/highway.webp` |
| 17 | The footer address is PATH's Indore registered office — confirm what should show | `settings.address` |

---

## 5. Open engineering work

| Priority | Item | Notes |
|---|---|---|
| High | **Set `ENQUIRY_WEBHOOK_URL`** in production once the client names a destination | Until then the live form shows the call/email fallback |
| Medium | **Mobile performance** ~70 → 85+ | Convert animation-only below-the-fold sections to server components with CSS reveals; dynamic-import the GSAP scenes for the maps, plan and site tour. The Advantage page is the heaviest (63–66). See QA-REPORT-R4 "Remaining" |
| Medium | **Real-device pass** | Physical iPhone (Safari) + mid-range Android: plan pan, image viewer swipe, rail focus, the route spine in the margin, the phone hero line, the Gati Shakti map taps |
| Medium | **Constra section** | Parked. Build the viewer modes (timelapse / before-after / drone) once the client confirms which files may be published (`docs/REDESIGN-PLAN-R4.md` §3.4) |
| Low | Delete the unused leftovers listed in §3 | |
| Low | CMS integration | Swap the getters in `lib/content/index.ts`; models in `lib/content/types.ts` mirror the schema |
| Low | Google Maps "directions" link | Needs verified coordinates (client item 11) |
| Low | Lighthouse for inner pages beyond `/logicity-advantage` and `/blogs` | They reuse the same components |

---

## 6. Known quirks

- **Hero pin on desktop:** the hero holds for 140% of a viewport so the route can draw down into §02. This is
  the only pinned scene; phones and reduced motion have none. The nav turns solid after the hero.
- **Route spine:** it is measured from real section tops and re-measured on resize and shortly after load
  (lazy sections). If a section is added or reordered, it adapts; it starts at `#explore` (§03) and ends at
  `#enquire`.
- **Page-transition wipe:** implemented with React `<ViewTransition>`. Navigation works, but the visual wipe
  was never captured in headless tests. Confirm it in a real Chromium browser.
- **Official-plan zones** are traced by colour. If the client supplies a new drawing, re-run the script and
  re-check each zone (the QA overlay approach is described in `docs/PLAN-OFFICIAL-MAP-REUSE.md`).
- **§09 camera:** on desktop the map responds to clicks and the chips, **not hover** — the camera moves, so a
  hover target would chase the cursor.
- **Gati Shakti map and §07 share route geometry.** Routes are schematic traces of the roads on the client's
  map, not survey-accurate; the map says "not to scale". No map of India is drawn on purpose.
- **Stock imagery** is always labelled "Illustrative" and credited (`public/client/amenities/CREDITS.md`,
  `public/construction/CREDITS.md`). The repair photo is **CC BY 2.0 and must keep its credit**.
- **Renders:** the client's renders have strong yellow and green casts; `img-grade` and washes compensate.
- **Dev-only noise:** the Next dev badge appears in screenshots; `reactStrictMode` double-runs effects (all
  scenes use reverting contexts, so this is safe).
- **Local tooling:** Playwright (Chromium, Firefox, WebKit) is installed in `%LOCALAPPDATA%\ms-playwright`
  and was used for QA; Lighthouse runs via `npx` with `CHROME_PATH` pointing at a Playwright Chromium.
  The Unsplash site blocks scripted access, so stock images were sourced through the Openverse API.

---

## 7. Change log (newest first)

| Date | Change |
|---|---|
| 2026-10-22 | **Client round 5** (`docs/PLAN-CLIENT-ROUND-5.md`, uncommitted): **fonts** Manrope + Inter and a smaller type scale; **hero** "Phase 1" tag replaced by "India's largest MMLP", Warehouse 17 photo slot (auto-detected in `public/client/`, server check in `lib/content/server.ts`) and banner motion (`hero-drift/rise/fade/ping`); **§06.1** Phase 1 band replaced by an MMLP-concept band; **§04** milestones are Lorem ipsum, Yashobhoomi removed everywhere; **PATH Group** highway photograph from pathltd.com, new figures, expanded About (overview, mission, vision, track record), **PATH Legacy** now shows the eight verticals (`PathVerticals`, `EvolutionLine` deleted); **Constra** leasing/availability block and collateral links (`SpaceAvailability`, empty until supplied). `MobileMotion` now targets only `#path-group [data-mobile-rise]` |
| 2026-10-16 | **Docs brought up to date** (this file and `ARCHITECTURE.md`) |
| 2026-10-16 | **Amenity images** (`c8c4086`): the five amenity cards without a photo now show open-licensed stock in `public/client/amenities/` — four CC0 (rawpixel), the repair photo CC BY 2.0 by Shixart1985 (credited on its card). "Illustrative", logo-free, sources in `CREDITS.md` |
| 2026-10-16 | **§07.1 PM Gati Shakti on the location map** (`8c72d53`): new `advantage/GatiShaktiMap` replaces the abstract network with the client's `345.webp` and the §07 traced routes — Path Logicity as the pulsing hub, seven points (NH 648, STRR, NH 48, Dodbele, Kempegowda Airport, Mangalore and Chennai ports), mode-styled routes drawing out from the site, per-point label placement, distances only where supplied, legend, hover/focus/tap. Plan: `docs/PLAN-GATI-SHAKTI-MAP.md` |
| 2026-10-16 | **Mobile hero line** (`02d4ee7`): on phones/tablets the hero route no longer crosses text; a separate short line runs in the clear window of the render with a gold site marker. Desktop unchanged |
| 2026-10-16 | **Footer** (`f032959`): deep ink (`#111233`) with a soft gold glow instead of bright indigo |
| 2026-10-16 | **Mobile polish** (`39f4095`): tighter section spacing; top-to-bottom hero wash; pannable master plan that glides to the chosen zone; full-screen swipeable image viewer (`ui/ImageViewer`); rail focus effect; scroll-in reveals (`providers/MobileMotion`); business-value row aligned to the margin; no oversized tag in §09; quieter hamburger menu; the Enquire bar hides while the menu is open and on scroll down. Desktop verified pixel-identical (80 frames at 1440/1024). Plan: `docs/PLAN-MOBILE.md` |
| 2026-10-16 | **Hero + counter + official map reuse** (`576387d`): hero matched to the approved reference (full-bleed render, bottom bar, reticle, pinned route into §02); odometer `spins` for the 400 acres; the official plan is now the map in §06.1 (figures anchored to real places, leader lines kept, tour, two-way hover) and §09 (gliding camera, zone tour, chips/click/keyboard) via `master-plan/OfficialPlanMap`. Plan: `docs/PLAN-OFFICIAL-MAP-REUSE.md` |
| 2026-10-16 | **R4-7 QA** (`c585ece`): Lighthouse, three engines, eight widths, reduced motion, keyboard; accessibility back to 100 after fixing Rail list semantics and a heading level; hero image uses `preload` + `fetchPriority`. Report and 31 screenshots in `docs/redesign/` |
| 2026-10-16 | **R4-6 inner pages + enquiry** (`a269828`): the six inner pages replace the holding template; enquiry form wired to `/api/enquiry` (shared validation, honeypot, size cap, webhook forward, 503 + fallback when unset); Blogs model and empty state |
| 2026-10-16 | **R4-3 to R4-5** (`2510f33`): interactive official plan (`scripts/generate-plan-zones.py` → `officialZones.ts`); new Amenities section; Gati Shakti points + "The impact"; PATH Group timeline captions; `RouteSpine`; gold leading edge on image reveals; `.lift` hover |
| 2026-10-16 | **R4-1 + R4-2** (`02d22dd`): white/light page (midnight retired, footer the only dark surface), **Open Sans only**, new type scale and sentence-case labels, new hero on `main.webp`, preloader and intro animations removed, renders gallery as a native `Rail` (no pin), hub opener / Gati Shakti / site tour / PATH Group strip recoloured light |
| 2026-10-16 | **Audit and plan** (`docs/REDESIGN-PLAN-R4.md`): confirmed the gallery pin locked ~5 screens of scroll; set the light/one-font direction after the client's V2 feedback; Constra parked |
| 2026-10-15 | **Round 3 premium redesign** (`93f402e`): quiet-luxury system with midnight sections, motion M1–M12, QA — largely superseded by round 4 |
| 2026-10-15 | **Client round 2** (`af81901`, merged via PR #1): light theme, Open Sans, location map, partner and IGBC logos, Constra-ready status, contact details |
| 2026-10-12 | **Client round 1** (`9a4fc49`): brand recolour, real logo, imagery and verified facts |

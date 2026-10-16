# Path Logicity — Handover

> Living status document. **Update the "Status" and "Change log" sections whenever work lands**
> (newest first). How the system works is in [`ARCHITECTURE.md`](./ARCHITECTURE.md).
> **Last updated: 2026-10-16**

---

## 1. Status at a glance

| Item | State |
|---|---|
| Homepage | Round 4 **R4-1 to R4-5 done** (light theme, Open Sans only, new hero, free-scrolling gallery, interactive official master plan). Next: R4-6 inner pages and form, R4-7 QA. Plan: `docs/REDESIGN-PLAN-R4.md`. **Constra section is parked for later by decision** |
| Inner pages | Holding templates only (`app/[chapter]/page.tsx`); full builds follow homepage sign-off |
| Branch | `client-round-2` (cut from `main`) |
| Commits | `af81901` client round 2 → then *Premium redesign: Phases 1–4* (both pushed to `origin/client-round-2`; see `git log`) |
| Uncommitted | Round 4 R4-1/R4-2 changes (not committed yet) |
| Pull request | Not opened yet. The GitHub CLI isn't installed on this machine, so open it from https://github.com/AllgoZ/pathlogicity/pull/new/client-round-2 |
| Quality | Typecheck clean · production build passes · Lighthouse desktop 96/100/100/100 · mobile ~70/100/100/100 · CLS 0 |
| Browsers | Edge, Firefox and WebKit (Safari engine) checked headless. No physical-device pass yet |

---

## 2. Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run start        # serve the build (the .claude/launch.json "prod" config uses port 3100)
npm run typecheck
```

- Add **`?annotations=on`** to any URL to see every placeholder slot and missing-content marker.
  They are hidden from visitors by default.
- The **preloader** plays once per browser session on desktop. To see it again, clear
  `sessionStorage['pl-intro']` or open a new private window.
- ⚠️ This is **Next.js 16.4**. Read `node_modules/next/dist/docs/` before touching Next APIs
  (see `AGENTS.md`).

---

## 3. Where things are

| Need to change… | Go to |
|---|---|
| Any fact, copy, image or link | `content/home.ts` only. Components read it through `lib/content/index.ts` |
| A headline accent word | Wrap it in `*asterisks*` in the content string (rendered by `lib/accent.tsx`) |
| Colours, type scale, utilities | `app/globals.css` (`@theme` + `@utility`) |
| Make a section dark | `bg-midnight on-dark grain` + `data-surface="dark"` on the section |
| Motion for a section | `useMotion(ref, mm => mm.add(MQ.motion, …))`, which is lazy and reduced-motion safe |
| Official plan zones | `scripts/generate-plan-zones.py` (re-run after any new plan drawing; mapping of legend colours → zones is in `ZONES`) |
| Map routes / pins | `components/connectivity-map/mapGeometry.ts` (pixel space of `public/client/345.webp`, 1320×1232) |
| Partner logos | `partners` in `content/home.ts` + files in `public/client/partners/` |
| Constra footage | Put files in `public/constra/` and point `milestones[].media.src` at them (MP4/WebM play inline) |
| Design rationale | `docs/REDESIGN-PLAN.md` (round 3) · `docs/CLIENT-CHANGES-PLAN.md` (round 2) · `docs/UI-PLAN.md` (original spec) |
| QA results and how to re-run | `docs/redesign/QA-REPORT.md` · screenshots in `docs/redesign/phase-1…4/` |

---

## 4. Waiting on the client

These items are blocked on content. Each one is a single `content/home.ts` edit or file drop
unless noted.

| # | Item | Where it goes |
|---|---|---|
| 1 | **Constra collaterals:** timelapse MP4s or progress photos, with a date for each milestone. Milestone 03 currently shows a labelled stock image | `public/constra/` → `milestones` |
| 2 | **Confirm IGBC Platinum Pre-Certification.** Their site lists *GRIHA* | `sustainability.certification` |
| 3 | High-resolution, transparent **wordmark** (the current PNG is 109×42) | `public/client/logo-text*.png` |
| 4 | **Commercial** zone image (the solar stock photo was removed); **Yards** and **Green** zone images | `zones[].media.src` |
| 5 | Leasing contact name, WhatsApp number, brochure PDF | `settings` |
| 6 | YouTube and X links | `settings.socials` |
| 7 | Privacy notice and terms pages; consent wording for the form | Footer + `EnquiryForm` |
| 8 | Milestone dates (01, 03), "last updated" date, two news dates | `milestones`, `statusLastUpdated`, `news` |
| 9 | Verified site coordinates (needed for the hero HUD and directions) | `settings.coordinates` |
| 10 | Sustainability initiative details / metrics | `sustainability.initiatives[]` |
| 11 | Hero drone video and the Logicity360 3D tour embed | `hero.video.src`, `siteTour` |
| 12 | The PATH Group aerial (`image-1729245444632.webp`, taken from the client's site) appears to be a non-PATH warehouse park. Ask for a real PATH project photo | `pathGroup.photo` |

---

**Added 2026-10-16 (round 4):** real site photographs for the seven amenities (only Truck Facilities and Green & Open Spaces have client renders; the other five are icon tiles); legend → zone mapping on the official plan; Path Group years for the timeline; the dates and figures conflict on Path Group numbers.

## 5. Open engineering work

| Priority | Item | Notes |
|---|---|---|
| High | **Wire the enquiry form** to a CRM or email endpoint | `components/contact/EnquiryForm.tsx` (`TODO`). It currently simulates sending |
| High | **Open the PR** `client-round-2` → `main` | See §1 |
| Medium | **Mobile performance** ~70 → 85+ | Convert animation-only below-the-fold sections to server components with CSS reveals; dynamic-import the GSAP scenes for the map, gallery and site tour. See QA-REPORT "Remaining" |
| Medium | **Real-device pass** | Physical iPhone (Safari) + mid-range Android; check pins, the gallery swipe and the marquee |
| Medium | Inner page templates | Follow homepage sign-off (UI-PLAN §6) |
| Low | CMS integration | Swap the getters in `lib/content/index.ts`; models in `lib/content/types.ts` mirror the schema |
| Low | Google Maps "directions" link | Needs verified coordinates (client item 9) |

---

## 6. Known quirks

- **Strict-mode double effects (dev only):** the preloader uses a reverting `gsap.context`, so it
  is safe. Keep that pattern for any one-shot intro.
- **Page-transition wipe:** implemented with React `<ViewTransition>`. Navigation works, but the
  visual wipe wasn't captured in headless tests. Confirm it in a real Chromium browser.
- **Renders:** the client's renders have strong yellow and green casts. CSS grades and an indigo
  wash compensate; the hero grade is baked into `public/client/hero-gate.webp`. If the source
  render changes, regenerate it (the grade values are in the QA notes and REDESIGN-PLAN).
- **One-off 404** seen once in testing, and not reproducible on reruns. It was likely a dev-server
  chunk request.
- **Local tooling:** Playwright's Firefox and WebKit (~600 MB) are installed in
  `%LOCALAPPDATA%\ms-playwright` and were used for cross-browser QA. Lighthouse runs via `npx`.

---

## 7. Change log (newest first)

| Date | Change |
|---|---|
| 2026-10-16 | **Round 4, R4-5 (motion pass).** New `navigation/RouteSpine`: one thin route line in the left margin that leaves the hero, passes a node at every section and ends at the enquiry block; gold draws down it on scroll (full and static under reduced motion). Hero route no longer exits the hero and the old Scale incoming route is gone (the spine replaces both). Image reveals gain a gold leading edge; headline letter-spacing settle removed; `.lift` hover for partner tiles. No pins anywhere |
| 2026-10-16 | **Round 4, R4-4.** New **Amenities** section (§06.2: seven amenities in a free-scrolling rail; photo only where the client supplied one, otherwise a branded icon tile). **PM Gati Shakti** now has the six "growth story" points and "The impact" statement verbatim from the concept note, plus a schematic MMLP network (35 nodes, Bengaluru as the largest) in place of a map. **PATH Group** timeline gained client-worded captions and year slots (null until dates arrive). No map of India is drawn on purpose: national boundary depiction is legally sensitive and we have no approved outline |
| 2026-10-16 | **Round 4, R4-3.** The official master plan is now the interactive layer: zones traced from the drawing by `scripts/generate-plan-zones.py` into `master-plan/officialZones.ts`; schematic and toggle removed. Legend → zone mapping needs client confirmation |
| 2026-10-16 | **Round 4, R4-1 + R4-2.** White/light page throughout (midnight retired; footer is the only dark surface, ~5% of scroll); **Open Sans only** (Plus Jakarta and Instrument Serif removed; accent words are colour, not italics); new type scale and sentence-case labels; new light split hero on `main.webp` with no opening animation (preloader, hero window, word rise, hero pin removed); renders gallery is now a native `Rail` (no pin, drag/arrows/keys); hub opener, Gati Shakti, site tour and PATH Group strip recoloured light; nav turns solid after 24px. Page length 27 → 21 viewports, zero pinned sections. Constra left for later |
| 2026-10-15 | **Committed and pushed** the premium redesign (Phases 1–4) and docs to `client-round-2` |
| 2026-10-15 | **Phase 4 QA.** Lighthouse fixes: lazy motion set-up, threshold-only scroll hooks, baked hero grade, composited hero reveal, desktop-only preloader, Lenis off on touch, cached route lengths, smaller assets. Accessibility 97 → 100, desktop performance 83 → 96, mobile ~56 → ~70. Docs: QA-REPORT, ARCHITECTURE, HANDOVER |
| 2026-10-15 | **Phase 3 motion.** M1–M12: preloader, hero window, surface morph, image reveals, gallery pin, magnetic CTAs, odometers, map establishing shot, logo marquee, hub showpiece, text polish, view transitions |
| 2026-10-15 | **Phase 2 sections.** Midnight hero on the gate render; renders gallery; midnight hub, Gati Shakti and site tour; restyled light sections |
| 2026-10-15 | **Phase 1 foundations.** Porcelain/stone/midnight tokens; Jakarta + Instrument Serif + Open Sans; gold-only accent; hidden placeholders; image grade and swaps; midnight footer |
| 2026-10-15 | **Client round 2** (commit `af81901`, branch `client-round-2`, pushed): light theme, fonts, location map, partner and IGBC logos, Constra-ready status, contact details |
| 2026-10-12 | **Client round 1** (commit `9a4fc49`, `main`): brand recolour, real logo, imagery and verified facts |

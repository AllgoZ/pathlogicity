# Client round 5 — audit of `prompts/client.md`

**Audited:** 2026-10-23 · `main` at `e3876bb` · production build (`next build` + `next start`, port 3100) · Chromium headless at 1440×900 and 390×844 (mobile, touch) · reduced-motion run.
**Method:** read the content layer and components, then drove the real build with Playwright and measured computed styles, text, requests and screenshots. **No source code was changed.** The git tree was clean before and after.
Evidence: [`docs/audit-r5/`](./audit-r5/) — `audit.mjs` (re-runnable test), `audit-results.json` (raw output), screenshots.

> To re-run: build and start the site (`npm run build && npx next start -p 3100`), then `node docs/audit-r5/audit.mjs` (it uses `playwright-core` and the Chromium in `%LOCALAPPDATA%\ms-playwright`; adjust the `exe` and `OUT` paths at the top).


---


## 1. Verdict

| Result | Count | Items |
|---|---|---|
| ✅ Done | 8 | Home 2, Home 3, Phases 1, Phases 2, PATH Group 1, 2, 3, PATH Legacy 1 |
| ⚠️ Partly done | 1 | Home 1 (Phase 1 is gone and the MMLP concept is highlighted, but there is **no Warehouse 17 photograph**) |
| ❌ Not done | 2 | Constra 1 and Constra 2 (the blocks exist but nothing is linked to Constra; both wait on client data) |

Overall: **the client's feedback is not fully closed.** Three of the twelve asks are not visible to a visitor today. All three are blocked on material the client has not sent, but the site should not claim more than it delivers in the meantime (see F-3).

---

## 2. Item-by-item

### Home Page

| # | Client ask | Status | Evidence |
|---|---|---|---|
| H1a | Remove "Phase 1" | ✅ Done | Zero matches for `phase 1` in the rendered text and HTML of all 7 pages. The hero tag now reads "India's largest MMLP"; the §06.1 band is "The MMLP concept" |
| H1b | Replace with an **actual site photograph of Warehouse 17** | ❌ **Not done** | `GET /client/warehouse-17.webp` → **404**. The hero still shows the illustrative render (`/client/hero-main.webp`, alt "Illustration of multimodal freight…") with the label "Illustrative render". The wiring exists (`hero.photo` in `content/home.ts`, auto-detect in `lib/content/server.ts`) but there is no file |
| H1c | Highlight the MMLP concept | ⚠️ Partly | Desktop shows the reticle tag "India's largest MMLP", and §06.1 has an MMLP band. **Below 1024px the reticle is hidden**, so on phones/tablets the hero never mentions MMLP (headline says "Multimodal Logistics Hub"; the acronym is not spelled out anywhere in the hero). See F-2 |
| H2 | Change font style and size throughout | ✅ Done | Open Sans is gone (0 matches in any page's HTML). Computed fonts: headings Manrope, body/labels Inter; **no element on `/` uses any other family**. Type scale at 1440: hero 58px, xl 44, l 32, m 21.6, body 16, label 13, micro 12. At 390: hero 34px, xl 30, l 24. Fonts load (`document.fonts`: Manrope, Inter). No console errors. *Subjective: the client should still confirm the pairing* (HANDOVER item 20) |
| H3 | Motion/animation on the top banner | ✅ Done | Computed animations present: `hero-drift` (26s, image scales ~1.043 → 1.050 and shifts over 3s, measured), `hero-rise` (headline), `hero-fade` (bottom bar), `hero-ping` (reticle). Same on desktop and mobile. Under `prefers-reduced-motion`, drift and ping are `none` and the headline is still visible. See F-5 (it is very subtle) |

### Phases section

| # | Client ask | Status | Evidence |
|---|---|---|---|
| P1 | Remove the Yashobhoomi reference | ✅ Done | 0 matches in the HTML of all 7 pages, and 0 in `app/ components/ content/ lib/ public/` |
| P2 | Keep all phases as Lorem Ipsum | ✅ Done | All 4 milestones show "Lorem ipsum" as the phase label and a Lorem title; dates are empty (5 occurrences of "lorem ipsum" in the homepage text, none elsewhere). *Note:* milestone 03 still shows a stock construction photo labelled "Representative imagery · Constra site capture to follow", and the section intro says "Milestones from approval to operations…" (not Lorem). Neither contradicts the ask, but confirm the client is happy with both |

### PATH Group

| # | Client ask | Status | Evidence |
|---|---|---|---|
| G1 | Photo from the main PATH Group site, ideally a road/highway | ✅ Done | `/client/path-group/highway.webp` — a multi-lane highway, shown in the banner (screenshot `pg-highlight-d.png`). **Quality caveat:** the file is 800×580 px (84 KB) and is stretched across a ~1310px-wide, 21:9 banner, so it is soft on large and retina screens (F-4) |
| G2 | Change the four figures | ✅ Done | Rendered: **31** Years of infrastructure · **18** States, presence across India · **6,500** Lane KMs of highways · **~6,000** Workforce, approximately. Nav note also says 31 years · 18 states · 6,500 lane km. No old figures remain (searched for 30 years / 6,100 / "nearly"). The wording is not word-for-word ("Presence Across 18 States" is shown as "18 States / presence across India") — fine, but flag it if the client wants exact phrasing |
| G3 | Expand About PATH with more from the main site | ✅ Done | Quote, three overview paragraphs, **Our mission**, **Our vision**, a **Track record** strip (45 toll plazas, 30 wayside amenities, 26 EPC, 11 BOT, 7 OMT, 6 HAM, 7 rail over bridges, 3 multi-storey parkings) and a "Read the full overview on pathltd.com" link. Rendered on desktop and mobile with no overflow. The track-record numbers were copied from pathltd.com and are **unconfirmed by the client** (HANDOVER item 4) |

### PATH Legacy

| # | Client ask | Status | Evidence |
|---|---|---|---|
| L1 | Show the verticals: Wayside Amenities, Majhi Mumbai, Drone Manufacturing, etc. | ✅ Done | "One group, many verticals": 8 cards — Highway Construction, Toll Operations, **Wayside Amenities** (PATH Recharge), Logistics Parks (Path Logicity, "You are here"), Road Engineering, **Drone Manufacturing** (VU Dynamics), **Sports (Majhi Mumbai)**, IT Solutions. 7 external links to pathltd.com resolve to the right vertical pages; 0 broken images. The section label still reads "PATH Legacy" |

### Constra integration

| # | Client ask | Status | Evidence |
|---|---|---|---|
| C1 | Link leased and available space with Constra | ❌ **Not done** | `leasing` has every figure `null`, `units: []`. Visitors see "Current leased and available space is shared on request" plus an enquiry button. No leased/available numbers, no bar, no unit table, **no Constra link** (`constra.url = null`) |
| C2 | Link other relevant collaterals with Constra | ❌ **Not done** | All four collateral links (availability, site progress, drone, reports) have `href: null`, so none render. Across the whole homepage, **0 anchors point to Constra** |

The code is ready for both: set `leasing` and `constra` in `content/home.ts` and the block fills itself in. What is missing is the client's data (URL, sq. ft. figures, which collaterals may be linked).

---

## 3. What needs fixing / doing

Ordered by what the client will notice first. "Needs client" = cannot be finished without material from them.

| ID | Priority | Item | Type | What to do |
|---|---|---|---|---|
| F-1 | **High** | **Warehouse 17 site photograph missing** (H1b) | Needs client | Obtain a site photograph of Warehouse 17 (about 2000 px wide) and save it as `public/client/warehouse-17.webp`; the hero switches automatically and relabels to "Warehouse 17 · site photograph". Then move the reticle (`left-[76%] top-[31%]` in `components/hero/Hero.tsx`) onto the building and check the washes (the porcelain gradients were tuned for the render, so re-check headline contrast). Ask the client for a higher-resolution original than the current 1462 px render for the fallback too |
| F-2 | **High** | **MMLP is not highlighted on phones/tablets** (H1c) | Code | The only hero mention of MMLP is the reticle tag, which is `hidden` below `lg`. Add the concept to something visible at every width (e.g. an eyebrow or sub-line above/below the headline: "MMLP · Multimodal Logistics Park"). Spell the acronym out at least once in the hero |
| F-3 | **High** | **Constra: the page promises it, nothing is linked** (C1, C2) | Needs client + small code | Get from the client: the Constra project/dashboard URL, leased / available / total sq. ft. (and unit list if any), and which collaterals may be linked (site progress, drone, reports). Enter them in `leasing` and `constra` in `content/home.ts`. **Meanwhile:** the heading "Leased and available space, tracked with Constra" and the §04 intro ("captured through Constra construction monitoring") imply a live link that does not exist. Either supply the URL or soften the copy until then |
| F-4 | Medium | **Highway photo is low-resolution** (G1) | Needs client / asset | The pathltd.com original is 800×580. Ask for the full-size file and replace `public/client/path-group/highway.webp` (target ≥ 2560 px wide for a 21:9 banner). Also: the content declares a credit ("Photo: PATH Group · pathltd.com") but the page does not display it — decide whether it should |
| F-5 | Medium | **Banner motion is subtle** (H3) | Review | Technically present and measured, but the drift is ~1% over 3 s and the entrance plays once. If the client expects obvious "motion or animation", consider a stronger treatment (a visible parallax, a looping route/vehicle animation, or the drone video once supplied: `hero.video.src`). Confirm with the client before changing |
| F-6 | Medium | **Unconfirmed content copied from pathltd.com** (G3) | Needs client | Track-record counts, mission/vision and the "more than three decades" wording. The client's own figures (31 / 18 / 6,500 / ~6,000) differ from pathltd.com's (30 / 18 / 6,100) — get a written OK so the two sites do not contradict each other |
| F-7 | Low | Mobile hero legibility | Code | At 390 px the "Location" micro-label sits over the ship and is faint (see `hero-mobile.png`). Cosmetic |
| F-8 | Low | Milestone wording | Review | Confirm the client is happy that milestone 03 keeps a stock photo and that the §04 intro is not Lorem ipsum |
| F-9 | Low | Docs drift | Docs | ARCHITECTURE and HANDOVER still say round 5 is "uncommitted / `main` at d1e37aa"; it is committed at `e3876bb` |

---

## 4. Checks that passed (no action)

- No horizontal overflow on any of the 7 pages at 390 and 1440 px; no console or page errors on any page; no failed requests on the homepage (apart from the missing Warehouse 17 file, which is requested only by the probe, not by the page).
- Broken images on `/path-group`: 0.
- The placeholders for missing Constra data are hidden from visitors (`?annotations=on` reveals them: "Constra sync date", "Constra project URL", "Constra links to supply: …").
- Production build passes; the build is static apart from `/api/enquiry`.

## 5. Not covered by this audit

- Real-device checks (iPhone Safari, Android) and Firefox/WebKit — Chromium only this time.
- Lighthouse / performance after the font change.
- Subjective sign-off on the fonts and on how noticeable the banner motion is — both need the client's eyes.
- Whether the texts copied from pathltd.com match the client's current wording (cannot be verified from here).

## 6. Side note for the maintainer

While building for this audit, `next build` stopped once with a message saying this Next.js version (16.4.0) is affected by a known security vulnerability, recommending `next upgrade --agent=security`. A retry then passed. I did not upgrade anything because this task is audit-only. Worth scheduling separately.

# Client round 6 — plan

Source: the client's "Website Structure" and "Visuals & Interactivity" feedback (2026-10-30):

> **1. Website structure** — Replace numbered pointers (01, 02, etc.) with bullets; retain numbering for main
> sections. Move the PATH Group section below.
> **2. Visuals & interactivity** — Ensure all images are HD in 05 / PATH Group. Match the yellow tones of the
> website to the Bengaluru map's highlight yellow shade.

**Status: IMPLEMENTED 2026-10-30 (uncommitted), with two revisions from the client reply.** Scope is exactly these points;
nothing else changed (no copy, motion, layout or behaviour outside what is listed below).

### Revisions after the plan (client reply, 2026-10-30) — these override the decisions below

| Was | Now |
|---|---|
| D1/D3: main section numbers stay (02–11) | **Main section numbers are removed too.** "02 / Scale" is now just "Scale", on every main section (Scale, Explore, Project status, PATH Group, The Logicity Advantage, Connectivity, Sustainability · ESG, Inside Logicity, Newsroom, Enquire). `SectionHeader` no longer takes an `index`. No renumbering is needed |
| D2: move PATH Group below Sustainability | **Not moved at first; then moved (later the same day, client: "above the news and below Inside Logicity").** PATH Group is now between Inside Logicity and News in `app/page.tsx`; no renumbering is needed because the main numbers were removed |
| Sub-section decimals and item counters → bullets | Done as planned: the five labelled sub-sections (The park, Project at a glance, Amenities, PM Gati Shakti, Business value; Space availability never had a number) show a `•`; card/row counters show a `•`. Left as real numbers: carousel and image-viewer position (`Rail`, `ImageViewer`), the Project-status milestone numerals and counts, "Asset slot 09" review labels |

### What shipped

- **Numbering:** see above. Files: the ten section components, `ui/SectionHeader.tsx`, and the counters in `PathVerticals`, `Amenities`, `GatiShaktiBand`, `BusinessValue`, `Sustainability`, `RendersGallery`, `ScaleIndex`, `PageHero`, `Nav` and `MasterPlan` (zone list).
- **Yellow:** `--color-yellow-400` is now `#ffca00` (sampled from the Bengaluru fill in `345.webp`); 300/200/50 are `#ffd633` / `#ffe066` / `#fff8dc`; every hard-coded `rgb(231 172 0 / α)` glow is now `rgb(255 202 0 / α)` (`PlanSvg.tsx` is unused and left alone).
- **HD images (PATH Group):** pathltd.com does publish larger files than the 800 px ones we had. The banner is now `2025/11/img-heighwat.jpg` (1200×750, was 800×580, a different highway photograph: an aerial junction); "Highway Construction" is now a 800×600 crop of `2025/08/bg-22.jpg` (was a 476×625 excavator image); all eight files were re-encoded from the JPEG originals at WebP q90 (they were about q65). `content/home.ts` alt/spec text updated. **Still not full HD:** pathltd.com has nothing larger for the banner (1200 px is its maximum clean file; the 1920 px sliders carry text overlays), `it-solutions` (476×625) and the brand artwork. Those go to the client (see the end of this file).
- Verified: `npm run typecheck` clean, `npm run build` passes, 1440 px screenshots of the kickers, the banner, the verticals and Amenities, no console errors. Not yet done: Lighthouse, 390 px phone pass, Firefox/WebKit.

---

## Original plan (kept for the record; superseded where marked above)

## Findings (what the code does today)

| Topic | Finding |
|---|---|
| Numbering | Main sections are labelled `NN /` in the section kicker (`<span data-idx>`): 02 Scale, 03 Master plan, 04 Project status, 05 PATH Group, 06 Logicity Advantage, 07 Connectivity, 08 Sustainability, 09 Inside Logicity, 10 News, 11 Enquire. **Sub-sections also carry decimal numbers:** 04.1, 05.5 (The park), 06.1 (At a glance), 06.2 (Amenities), 07.1 (PM Gati Shakti), 08.1 (Business value). Separately, many cards and rows carry two-digit item counters (`String(i + 1).padStart(2, "0")`) |
| Section order | `app/page.tsx`: Hero → Scale → Master plan → Project status → **PATH Group** → Renders → Hub opener → At a glance → Amenities → Connectivity → Gati Shakti → Sustainability → Business value → Site tour → News. The page-wide route spine and mobile motion find sections by id/measurement, so reordering does not break them |
| PATH Group images | All sourced from pathltd.com at **800 px wide** (banner `highway.webp`, 800×580, shown at up to 1600 px wide and 500 px tall, so it is upscaled about 2×) and the vertical cards at **476×625 to 924×1215** (`path-group/SOURCES.md` already notes "soft above about 1000 px"). This is the HD problem |
| Yellow | Site gold is `--color-yellow-400: #e7ac00` (231,172,0), an ochre. The Bengaluru highlight on the client's location map (`public/client/345.webp`) measures **#FFCA00 (255,202,0)** (sampled from the fill; the dominant colour of 1,014 of 1,200 sample pixels). The site yellow is visibly darker and browner than the map |

## Decisions I took (please confirm the ones marked ❓)

| # | Question | Decision |
|---|---|---|
| D1 | Which numbers become bullets? | ❓ **Recommended:** the sub-section decimals (04.1, 05.5, 06.1, 06.2, 07.1, 08.1) and the per-item counters on cards and list rows become bullets (`•`). The ten **main section numbers stay**. Counters that are *functional* stay as they are (carousel position "03 / 07", image-viewer position, milestone count, the Milestone numeral in the status viewer, the distance table), as they tell you where you are, not what to read next. If the client meant only the decimals, skip step 1b |
| D2 | Where does PATH Group move? | ❓ **Recommended:** after Sustainability + Business value (end of the "believe" chapter), before Inside Logicity and News. It reads as the credibility close before the site tour and news, and only four main sections renumber. Alternative: directly after Renders (a smaller move). Tell me if the client means a specific spot |
| D3 | Renumbering after the move | Keep main numbers contiguous: Hub opener **05**, Connectivity **06**, Sustainability **07**, PATH Group **08**, Inside Logicity 09, News 10, Enquire 11 (unchanged). *The park* (renders) was 05.5, so it becomes a bulleted sub-section of 04 |
| D4 | The yellow | Use **#FFCA00** as the base gold, taken from the client's own map, and derive the lighter tints and the translucent glows from it. Anything darker (hover/pressed) is derived, not invented |
| D5 | HD images | Do **not** fake HD by upscaling. Re-source from pathltd.com at the largest size it serves; where it has nothing larger, ask the client for the originals (see 2a) |

## Work items

### 1. Website structure

**1a. Bullets for sub-section pointers** — in each of the six sub-section kickers replace the `06.1 /` number text with a bullet marker, keeping the same label and spacing, and keep the main numbers exactly as they are.
Files: `gallery/RendersGallery.tsx` (05.5), `advantage/SpecDrawing.tsx` (06.1), `advantage/Amenities.tsx` (06.2), `advantage/GatiShaktiBand.tsx` (07.1), `sustainability/BusinessValue.tsx` (08.1), and the 04.1 label in `project-status/SpaceAvailability.tsx` (check: it may have no visible number today, in which case nothing changes). One shared bullet style (a small `@utility` or a tiny `Bullet` span) so all six look the same. `data-idx` is kept on them, so the inner pages, which hide index numbers, behave as before (`globals.css:128`).

**1b. Bullets for item counters (D1)** — the decorative `01, 02, 03…` tags become bullets:
`path-group/PathVerticals.tsx` (vertical photo tabs), `advantage/Amenities.tsx` (amenity photo tabs), `advantage/GatiShaktiBand.tsx`, `sustainability/BusinessValue.tsx`, `sustainability/Sustainability.tsx` (initiatives list and the circled step), `gallery/RendersGallery.tsx` (render captions), `stats/ScaleIndex.tsx` (node captions), `layout/PageHero.tsx` ("On this page" list), `navigation/Nav.tsx` (dropdown and mobile menu rows). **Left alone:** `ui/Rail.tsx` and `ui/ImageViewer.tsx` position counters, `ProjectStatus` milestone counts and viewer numeral, `MasterPlan` zone index (`z.index` from content) pending the answer to D1.

**1c. Move PATH Group (D2/D3)** — in `app/page.tsx`, move `<PathGroup …/>` to after `<BusinessValue …/>`. Renumber the four affected main kickers: `HubOpener` 06→05, `ConnectivityMap` `index="07"`→06, `Sustainability` 08→07, `PathGroup` 05→08. Update the "§" labels in code comments so they stay true.
Checks to make while doing it:
- **Surface alternation:** PATH Group is `bg-stone`; it would sit right after Business value (also stone). Give PATH Group the porcelain surface (and re-check the Site tour that follows) so the stone/porcelain rhythm and the section-edge morph stay intact.
- `RouteSpine` measures real section tops, `JourneyRail`/nav link by id (`#path-group`), `MobileMotion` selects by `#path-group`: expected to work unchanged; verify by scrolling, since `JourneyRail` order may need a look.
- The hero "Legacy" journey card and the nav "PATH Group" menu keep their `#path-group` / `/path-group` links.
- `/path-group` (inner page) is unaffected apart from the images and yellow.

### 2. Visuals and interactivity

**2a. HD images in 05 / PATH Group** — covers the highway banner, the eight vertical cards and anything else rendered in that section.
1. Re-fetch each asset from pathltd.com looking for a larger original than the 800 px copies (the WordPress uploads usually keep the full-size file; the `-800` crops are the thumbnails). Record sources and sizes in `public/client/path-group/SOURCES.md`.
2. Convert to WebP at high quality (≈ q85+), banner at least **2560 px wide**, cards at least **1400 px** on the long side for 4:5 / 4:3 crops (about 2× the displayed width).
3. In `content/home.ts` update the `spec` strings if the dimensions change. The `sizes` attributes already request the right widths; check `AssetSlot` and `PathVerticals` do not cap the quality or width.
4. **Where nothing larger exists** (the brand artwork `majhi-mumbai.webp` and `vu-dynamics.webp`, `it-solutions.webp`, and `toll-operations.webp` are the likely ones): list them for the client as an ask ("please send the original artwork / photographs"), keep the current file meanwhile, and say so in HANDOVER. I will not upscale with filters or AI, so the result stays honest.
5. Check each image at 1440 and 1920 wide and on a 2×–3× phone for visible softness.

**2b. Yellow matched to the map (D4)**
- `app/globals.css` `@theme`: `--color-yellow-400 #e7ac00 → #ffca00`; derive `yellow-300` (#ffd633-ish), `yellow-200` (#ffe066-ish), `yellow-50` (#fff8dc-ish) from the same hue (final values picked by eye against the map and checked for contrast).
- Every `rgb(231 172 0 / α)` glow or ring is the old yellow and must move to `rgb(255 202 0 / α)`: `globals.css` (lines 308, 588), `ConnectivityMap.tsx`, `EnquiryForm.tsx`, `HubOpener.tsx`, `SiteTourPreview.tsx`, `Footer.tsx`, `RouteSpine.tsx`, `Sustainability.tsx`, `ui/Route.tsx`. (The unused `PlanSvg.tsx` is left alone.)
- The 122 `yellow-*` class usages (buttons, rules, the route comet, spine, markers, hero) follow the token, so they need no edits.
- **Contrast:** `#ffca00` is lighter than the old gold, so it is *better* behind ink text (buttons, tags) and on the deep-ink footer, but it is weaker as text or a thin line on white. The existing rule is "never small text on white": re-check the few yellow-on-light uses (the quote marks in PathGroup, the underline wipes, the 3px rules) and the Lighthouse accessibility score (must stay 100).
- Use of the map PNG itself is untouched; the master-plan zone colours come from the client drawing and are not retinted.

## Out of scope (not touched)

Copy, fonts, hero and motion, Constra, the enquiry form, the master-plan/zones data, the Gati Shakti map, any other section's layout or behaviour, and the unused leftovers.

## Verification

`npm run typecheck`; `npm run build`; scroll the homepage at 1440 and 390 wide and check the six sub-section kickers, the item counters, the new order and the renumbered kickers; compare the yellow against the map; check `/path-group` and the other inner pages; check route spine, hero route and mobile motion in the PATH Group section after the move; Lighthouse (accessibility stays 100, performance no worse than the ~98 / ~70 baseline, larger PATH Group images are lazy-loaded below the fold); confirm desktop screenshots outside the touched areas are unchanged.

## Waiting on the client after this round

1. Confirm D1 (bullets for item counters as well as sub-section numbers?) and D2 (where PATH Group goes).
2. Full-resolution **PATH Group photographs and brand artwork** for anything that pathltd.com only serves small (highway banner, Majhi Mumbai, VU Dynamics, IT solutions, toll operations).
3. Confirm #FFCA00 (the map's yellow) as the brand yellow everywhere.

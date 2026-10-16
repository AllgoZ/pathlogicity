# Path Logicity — Audit and clean redesign plan (round 4)

> 2026-10-16 · Follows round 3 (`docs/REDESIGN-PLAN.md`). **Plan only: no code has changed.**
> Sources audited: the live homepage (dev build, 1440×900 and 390×844, captured with Playwright),
> the code, `reference/Concept Note for Path Logicity.pdf`, the client's "Path Website Changes V2"
> list, `content/home.ts`, and the new hero image `reference/images/main.webp`.
> Not verified: frame-by-frame motion quality (judged from code and stills), real devices, and
> anything on pathlogicity.com beyond what earlier rounds recorded.

---

## 0. Summary

The site has a good spine (route line, content layer, fact-safety, one strong section), but round 3
over-corrected towards "dark and cinematic" and added effects the client never asked for, while real
client requirements are still unmet.

| | Finding |
|---|---|
| **Gallery bug is real** | `RendersGallery` pins for **5.0 viewports (≈4,500 px of scroll)** to slide the track 3,607 px sideways. A visitor is locked in until every render has passed. The pinned frame is also taller than a 900 px screen, so its heading and progress bar are clipped |
| **Still too dark** | About **45% of the scroll length is dark** (≈11 of 27 viewports; the gallery pin alone is 5). The client said "too dark" in V2, and the plan now targets a **white/light page throughout** (§2, §3.1) |
| **Client V2 not finished** | Constra collateral: still unused (`public/constra/` is empty; the Constra project link needs a login, see §3.4). Fonts: round 3 reopened the complaint by adding Plus Jakarta Sans and serif italics, so the plan returns to **Open Sans only** (§3.1). IGBC, partner logos and map: done |
| **Large content gaps vs the Concept Note** | No Amenities section, no Blogs, five inner pages are empty templates, PM Gati Shakti is stats-only, Path Group numbers disagree with the PDF |
| **Official master plan** | It is the default view, but it is a static image. The "interactive zones" are an invented schematic, not the official drawing |
| **Motion** | Many effects, but most are subtle (letter-spacing settle, ±5% parallax) and the page mostly sits still between them. The preloader and hero intro are unwanted |
| **Keep** | §07 Connectivity ("Road. Rail. Air. Ports."), the route-line idea, the content layer, the Scale branching section, accessibility and performance work |

---

## 1. Audit

### 1.1 Your latest requests

| Request | Finding | Plan |
|---|---|---|
| Use `reference/images/main.webp` as the hero | It is a bright daylight render: crane, truck, container ship, aircraft and a rail line. It is the same file as `public/client/main.webp`, 1462×825. It literally shows Road · Rail · Air · Ports, so it fits the concept. Two risks: at 1462 px wide it will look soft if stretched full-bleed on a 1920+ screen; and the bright sun glare top-left makes white text unreadable without a scrim | §3.2 |
| §05.5 The park is "stuck" | Cause: pin length is tied to the number of images (§1.3). Second defect: the pinned frame (`h-svh` plus header, 504 px images, captions, progress bar) is taller than 900 px, so the label and bar are cut off. Third: scroll-linked drift on every image adds work for no gain | §3.5 — remove the pin |
| Hero opening animation not needed | Removes: preloader (M1, plus its head script), hero window reveal and word rise (M2), staggered intro fades | §3.2 |
| Official master plan over interactive zones | Official view is already the default but has **no interaction**; the "Interactive zones" tab is a hand-drawn layout that is not the real plan | §3.3 |
| Clean redesign, keep §07 | Agreed. §07 is kept as is (see §4) | all |

### 1.2 Client "Changes V2" scorecard

| # | Client ask | State | Evidence / note |
|---|---|---|---|
| 1 | Fonts changed; sizes too big or too small | **Partly reopened** | Round 2 moved to Open Sans (their site's font). Round 3 then added **Plus Jakarta Sans display + Instrument Serif italic accents**, which the client never asked for. The Concept Note asks for a "contemporary sans … bold, architectural headlines"; light headlines with serif italics point the other way. Eyebrow labels are 12 px, uppercase, wide-tracked on nearly every block, against 80–96 px headlines: the "too small / too big" problem remains. Your own brief (`reference/initial.md`) also says no all-caps eyebrows everywhere |
| 2 | Too dark: light with brand colours | **Not met** | ≈45% dark by scroll length. `midnight #0d0e35` is near-black, not a brand colour. Dark: hero, renders, hub opener, Gati Shakti, site tour, footer |
| 3 | Constra collaterals not used | **Not met** | `public/constra/` is empty. Milestone 03 shows labelled stock. This is blocked on client files, but the *viewer* can be built now |
| 4 | IGBC logo | Done | Ring, partner strip, footer. Certification wording still unconfirmed (client's site says GRIHA) |
| 5 | Other logos from the main site | Done | NHLML, RVNL, KIADB, IGBC. Presentation is weak: white tiles on dark, uneven sizing, one crop |
| 6 | Map to show location | Done, and good | Client map `345.webp`, region/site zoom, route tracing |

### 1.3 Page rhythm (measured)

| Measure | Value |
|---|---|
| Document height | ≈27 viewports |
| Pinned (scroll-locked) | Hero **2.4 vh**, renders gallery **5.0 vh** (≈7.4 vh, over a quarter of the page) |
| Gallery | track scroll distance 3,607 px, pin length ≈4,507 px (wheel flicks needed: ~15) |
| Dark sections | hero, renders, hub opener, Gati Shakti, site tour, footer |

### 1.4 Concept Note coverage

| Concept Note requirement | State |
|---|---|
| Hero: full-screen video of the real site; "highlight the location aggressively" | Still image only. Location is a small block bottom-left |
| Scale as interactive icons | Done (branching nodes) |
| Explore: interactive master plan, 7 zones | Schematic only; official plan is static |
| Project Status with **Constra** timelapse, drone, milestones | Layout exists; no Constra content |
| Path Group: 30+ yrs, 18 states, 70+ locations, ~6,100+ workforce, concise timeline, "Know more about Path" | **Numbers differ**: site shows 27 / 17+ / 70+ / ~5,000 (from pathlogicity.com). No timeline. Wrong imagery (see HANDOVER item 12) |
| Logicity Advantage: glance, interactive icons | Done (oblique drawing + callouts) |
| PM Gati Shakti: maps, route networks, **six** "growth story" points, "The Impact" statement | Stats and 3 points; **no map or network visual**; 3 points missing |
| **Amenities: 7 items, image-led scroll of real site pictures** | **Missing entirely** (only a nav link) |
| Solutions: interactive connectivity map | Done and strong |
| Sustainability: IGBC highlighted + 5 initiatives + story | Done structurally; initiative details empty (needs client data) |
| Business value in icon form | Done |
| Logicity360 3D tour (React Three Fiber) | Placeholder schematic only |
| News with 4 tabs | Done; only Project updates has content |
| **Blogs** | **Missing** (template) |
| Final CTA, form, call / WhatsApp / brochure / social | Form is simulated (no endpoint); WhatsApp and brochure are null |
| 7 pages with sub-tabs | Five of six inner pages are holding templates, so most nav items lead to an empty page |

### 1.4a Facts to reconcile with the client

1. **Path Group numbers:** PDF says 30+ / 18 / 70+ / ~6,100+; live site (round 2 crawl) says 27 / 17+ / 70+ / ~5,000. The PDF's own story text says "nearly three decades", which fits the live site. Do not publish either until the client confirms.
2. **IGBC Platinum Pre-Certification** vs GRIHA on their site.
3. **Footer address** is Path's Indore registered office, not the site. Confirm what should show.
4. **Legend → zone mapping** on the official plan (§3.3) needs the client's sign-off so no zone is mislabelled.
5. **`main.webp` is a generic illustrative render**, not footage of the site. It must be labelled "illustrative" so it is not mistaken for the real project.

### 1.5 Section audit

Severity: **A** blocks the client's asks · **B** quality gap · **C** polish.

| # | Section | Verdict | Issues |
|---|---|---|---|
| 01 | Hero | **Rebuild (A)** | Dark entry-gate image; preloader and intro unwanted; location not aggressive; "Phase 1 · 138 acres" HUD tag is tied to the old image; scrubbed pin exit |
| 02 | Scale | **Keep (C)** | Strong composition. Gentle polish only; labels too small and tracked |
| 03 | Master plan | **Rebuild (A)** | Official drawing has no interaction; schematic is invented; zone panel hides behind the toggle |
| 04 | Project status | **Rebuild (A)** | No Constra media; one stock image; timeline is long (2.2 vh) for 4 items |
| 05 | Path Group | **Fix (B)** | Wrong photo; numbers unconfirmed; no timeline; no "Know more" CTA |
| 05.5 | Renders gallery | **Rebuild (A)** | Pin lock, clipped frame, dark |
| 06 | Hub opener | **Keep concept, recolour (B)** | Good showpiece; near-black |
| 06.1 | At a glance | **Fix (B)** | Works; the 138-acre row is weakly composed |
| — | **Amenities** | **Add (A)** | Missing |
| 07 | **Connectivity** | **Keep** | Client-approved; the route planner and map work well. Only recolour any dark chrome and bring labels to the new type scale |
| 07.1 | Gati Shakti + partners | **Rebuild (B)** | Needs a map/network visual and the six points; partner strip needs a calmer treatment |
| 08 | Sustainability | **Keep, enrich (B)** | Ring is good; awaiting initiative data |
| 08.1 | Business value | **Fix (B)** | Heading is oversized next to its content; weak icons |
| 09 | Site tour | **Fix (B)** | Placeholder; near-black |
| 10 | News | **Fix (C)** | Featured image crops two faces badly; 3 of 4 tabs empty states |
| 11 | Enquire | **Fix (B)** | Form not wired; WhatsApp / brochure missing |
| 12 | Footer | **Fix (C)** | Partner marquee repeats logos visibly; nav groups uneven |
| — | **Blogs, inner pages** | **Add (A)** | Missing |

### 1.6 Motion audit

What exists: M1–M12 (see ARCHITECTURE §7). What is wrong:

1. **Wrong emphasis.** The heaviest choreography is at the start (preloader, hero reveal, word rise, pinned exit), where the client wants none, and the longest scroll-lock is a gallery.
2. **Too subtle elsewhere.** Letter-spacing settle and ±5% parallax are nearly invisible. Between the set-pieces the page is static.
3. **The signature is under-used.** The route line is strongest in Scale and Connectivity; elsewhere it is a decorative hairline. It should *connect* sections, not decorate them.
4. **Interactions lack feedback.** Master plan zones do not respond on the official drawing; the status viewer does not scrub; amenities do not exist.
5. **Scroll capture.** Two pins plus Lenis make the page feel heavy.

---

## 2. Redesign principles

1. **White/light throughout, brand-coloured.** This is the client's V2 ask ("keep it white/light with brand colours"), and it overrides the Concept Note's "deeper navy" direction because V2 came later. Every content section is white or a faint brand tint. Brand colour comes from indigo, blue, green and gold used as accents, stripes, icons, numerals and small panels. The only deep-indigo areas are the footer and, at most, one short band.
2. **Never trap the scroll.** No pin longer than ~1 viewport; none whose length depends on content count. Horizontal content scrolls natively (drag, arrows, keys, trackpad), never by hijacking the wheel.
3. **No opening show.** The page is fully visible on first paint. Motion begins when you scroll or interact.
4. **Motion that explains.** Every effect shows *movement, connection, progress or scale* (Concept Note). Cut anything that does not.
5. **One signature, used on purpose.** The route line physically links section to section.
6. **Real over invented.** Only client facts; clear "illustrative" labels; hidden placeholders.
7. **Bold, readable type.** Fewer sizes, sentence case, proper contrast.

---

## 3. Plan

### 3.1 Design system changes

**Colour**

| Role | Now | Plan |
|---|---|---|
| Base | porcelain / stone | Keep: porcelain `#f8f8f5`, white cards. Add a faint brand tint (`#f1f4fb`) as the alternate instead of grey-beige |
| "Dark" sections | midnight `#0d0e35` (near-black) | Retire `midnight` entirely. Hero, gallery, hub opener, Gati Shakti and site tour all become **light**. Only the footer is deep **brand indigo `#201f85`**; the hub opener may use a short indigo band if it needs the contrast. Target: **dark ≤ 10% of scroll length** |
| Accent | gold only | Keep gold for actions and the route comet. Bring back **green** (sustainability, "completed"), **blue** (connectivity, links) and **indigo** (headings, numerals) with clear roles, so the page reads as the brand pinwheel on white, not gold-on-navy |
| Stripe | 2px pinwheel | Keep, thicker (3 px) at section hand-offs |

**Typography** (decision D1)

- Decided: **Open Sans only** (the font on the client's own site and the last one they have seen). **Remove Plus Jakarta Sans and Instrument Serif.** Emphasise accent words with colour and weight (700 vs 600), never a second typeface.
- Scale (desktop): hero 56–64 px max, section titles 40–48, sub-titles 22–26, body **17–18**, small UI 14–15, labels **14 px sentence-case** (uppercase only for tiny tags and nav buttons).
- Drop the extreme size ratio (96 px headline vs 12 px label) that creates the "too big / too small" feel.

**Components:** reuse Route, Counter, AssetSlot, PartnerLogos, SectionHeader (restyled). Add: `Rail` (native horizontal scroller with drag, arrows, progress), `ZoneHotspots` (SVG overlay on an image), `BeforeAfter` (Constra scrubber), `AmenityCard`, `Timeline`.

### 3.2 Hero (01) — rebuild

- **Image:** `main.webp` (copy to a hero path, no baked dark grade). Full-bleed on the right ~60%, left panel porcelain with the headline in ink, so no scrim is needed and the V2 "light" ask is met. The route line crosses the seam (from the left panel into the image) and exits down into §02.
- **Location, aggressively:** large "Dobbaspet, Bengaluru" lockup, NH 648 · NH 48 · STRR chips, and a small map chip (client `345.webp` crop with the site pin) that links to §07. Coordinates appear once verified.
- **Actions:** Explore the project · Enquire leasing now (unchanged).
- **Remove:** Preloader (+ head script and `html[data-preload]`), hero window reveal, word-rise, site reticle HUD, pinned scrubbed exit.
- **Motion kept (tiny):** slow 4% parallax on scroll; the route comet draws once, after load, as a quiet hint.
- **Label** "Illustrative render". Swap in drone footage when the client sends it (the MP4 slot stays).
- **Nav:** transparent over the hero, solid on scroll (Concept Note), dark ink text over the light panel.
- **Asset risk:** 1462 px source. Ask the client for the original; until then cap the displayed width and check on a 1920 screen.

### 3.3 Master plan (03) — official plan, interactive  ✅ built 2026-10-16 (R4-3)

> **Done:** the schematic and view toggle are gone. `scripts/generate-plan-zones.py` traces the 7 zones from the official drawing by colour into `components/master-plan/officialZones.ts`; `MasterPlan` overlays them (hover/tap washes out the rest, redraws the zone outline, drops a name tag), with a first-view tour through the zones and the zone list as the keyboard control. The legend → zone mapping below is **still unconfirmed by the client**; edit `ZONES` in the script and re-run if it differs. The route-comet-to-zone idea was dropped (a line across the drawing would not follow the real roads).

- The **official drawing is the interface**. Remove the schematic and the view toggle.
- Build `ZoneHotspots`: an SVG overlay (viewBox = 2774×1583) with one region per zone. Regions are **traced from the drawing's own legend colours** (colour-key the image to get pixel-accurate masks), not hand-drawn guesses.
- Hover / focus / tap: the zone lights up, the rest dims, a route comet draws from the main entry to it, and a detail card shows name, verified facts and image.
- Keep the zone list as the accessible primary control (keyboard order, screen readers).
- Mobile: plan fits width with pinch-zoom; zone chips below; card as a bottom sheet.
- **Needs client confirmation (§1.4a #4):** which legend entries make up each of the 7 zones. Proposed starting point, not to ship unconfirmed: Warehousing = Warehouse + Transit + Open warehouse; Rail Terminal = Railway terminal; Dry Port / ICD = CFS shed; Commercial = Commercial area; Yards = Surface parking; Roads = access roads; Green = green belts.
- "Explore the site" CTA goes to the Logicity Advantage page, per the Concept Note.

### 3.4 Project status (04) — Constra viewer

- Two-column: a **viewer** (left) and a compact 4-step timeline (right), about one viewport tall instead of 2.2.
- Viewer modes, driven by whatever Constra supplies: timelapse video · before/after scrubber across dates · drone clip · progress photos. A mode that has no asset is hidden, not faked.
- Until files arrive: the existing labelled representative image, with a visible "Constra capture to follow" state in review mode only.
- **Constra inventory (read 2026-10-16, project "PATH India Limited / PATH Logicity", read-only; nothing downloaded):**
  - **Five capture rounds**, each with an aerial survey (Land Survey 01–05: 09 Jun, 30 Jun, 10 Aug, 04 Sep, 01 Oct 2026; ~2,200 images each) and a Smart Media folder (Media 01–05).
  - **Publishable candidates (edited MP4s):** `Path_Site_Progress_Comparison_Q2-vs-Q3_FY2026-27`, `…Sep-vs-Oct_2026`, `…Aug-vs-Sep_2026` (+`_v2`), `…Jun-vs-Aug_2026`, `Construction_Comparison_09June_30June`, `Path_Aerial_Progress_Oct_2026`, `…Sep 2026`, `…2026-08-10_Waypoint`, `…2026-06-30_Waypoint`, `Path_Logicity_Video_Walkthrough_1`, `Path_Logicity_Video Walkthrough 2`, `Path Logicity Walkthrough`. These are the before/after comparisons and aerial progress videos the §3.4 viewer needs.
  - **Not for the site:** DJI raw survey data (`.OBS/.NAV/.MRK/.RTK/.pbk`), `PANORAMA.zip` files, the Documents folders (reports), defect/safety reports.
  - **Not available in Constra:** the Time-lapse Video module says "Coming Soon", so there is no timelapse yet; Live View was not checked.
  - **Gaps:** the list view shows no file sizes or thumbnails, and I have not played the videos, so quality, length and whether they contain people/branding are unchecked. Dated pairs map cleanly to milestone dates (the same dates the client's "milestone dates" item is waiting on).
  - Before any file goes on the site: confirm with the client that each may be published, then list name + size + source for approval before saving.
- Request list for the client is in §6.

### 3.5 Renders gallery (05.5) — fix

- **No pin.** Becomes a calm, normal-height section on **porcelain/white** with a native `Rail`: drag, arrow buttons, keyboard, trackpad swipe, snap, visible progress. Page scroll is never captured.
- Fix the clipped frame (no fixed `h-svh`), and remove the per-card scroll drift. Keep a gentle hover zoom.
- Large first card with the rest peeking, so the first view already shows there is more.
- Rename to "The park, in renders" and keep "Illustrative renders".

### 3.6 Other sections

| Section | Plan |
|---|---|
| 02 Scale | Keep. Labels to the new scale; sentence case |
| 05 Path Group | Add a 5-step timeline and the "Know more about Path" CTA; replace the non-PATH aerial when the client supplies one; numbers per §1.4a #1 |
| 06 Hub opener | Light version: white ground, indigo/blue/green/gold routes converging on the pinwheel mark; shorten the animation. May be the one short indigo band if it needs the contrast |
| 06.1 At a glance | Recompose the Phase 1 row as a proper feature row with a small progress bar |
| **Amenities (new, after 06.1)** | Seven image-led panels in a `Rail` ("Everything your business needs. And more."): Truck Facilities, Food & Retail, EV Charging, Fuel Station, Vehicle Repair & Service, ATMs & Essential Services, Green & Open Spaces. Copy is from the Concept Note. Photos: only real site pictures or the client's renders; panels without a real image show a typographic tile, not stock |
| 07 Connectivity | **Keep.** Only type-scale and colour-token alignment |
| 07.1 Gati Shakti | Light section. Add a **network map** (India outline with the site as a node and the route comets) and the full set of six points plus "The Impact" line. Partner strip becomes a quiet monochrome-on-white row |
| 08 Sustainability | Keep the ring; green becomes the section accent (Concept Note). Initiative text stays hidden until verified |
| 08.1 Business value | Five icon tiles on one row; smaller heading |
| 09 Site tour | Light panel (the plan drawing in brand colours); keep the placeholder; the architecture for a real model (R3F or an embed) is prepared in `site-tour/`, with no new dependency until a model exists |
| 10 News | Fix the crop; stronger empty states for the empty tabs |
| 11 Enquire | Wire the form (endpoint decision D4); add WhatsApp and brochure once supplied |
| 12 Footer | Static partner row (no repeated marquee); even columns |
| **Blogs and inner pages** | After homepage sign-off: Path Group, Logicity Advantage (with the 4 tabs), Sustainability (ESG, Business value), Site Tour, News (4 tabs), Blogs (featured + list, CMS-ready, no invented articles) |

### 3.7 Motion plan (v4)

**Philosophy:** nothing plays on load; motion is earned by scroll or hover; big moments are few and legible.

| Keep | Change | Remove |
|---|---|---|
| Odometer counters | **Route line links sections**: a continuous gold route is drawn as you scroll, passing through section edges and ending at the Enquire button | Preloader (M1) |
| Scale branching + hover previews | Image reveals: clearer (wipe + 1.1→1 settle), not ±5% parallax | Hero window + word rise (M2) |
| Map establishing shot + route traces | Master plan: zone light-up and route comet to the zone | Gallery pin (M5), per-card drift |
| Partner marquee → **static** on the footer, slow marquee only in one place | Constra scrubber and tab transitions | Hero pinned exit |
| Magnetic CTAs (fine pointers) | Section hand-offs: background colour crossfade (SurfaceMorph kept, tuned) | Letter-spacing settle (M11) |
| Page transition (verify in a real browser) | Stat panels: staggered count + underline draw | Staggered intro fades |
| Hub convergence (shortened) | Amenity rail: image scale on hover/active, progress thumb | |

**Rules:** at most one scroll-linked pin (none planned); all scenes inside `gsap.matchMedia`; nothing hidden without JS; reduced motion shows the final state; transforms and opacity only.

### 3.8 Content and data

- Keep `content/home.ts` as the single fact source. Add: `amenities[]`, `blogs[]`, `pathGroup.timeline`, `gatiShakti.points` (full six) and `impact`, `zones[].legend[]` (for §3.3).
- Types in `lib/content/types.ts` get matching models so a CMS can replace the getters.

---

## 4. What stays exactly as it is

- §07 Connectivity (copy, map, route planner, region/site zoom).
- The route-line idea, content layer, fact-safety rules, annotation mode.
- Scale branching section, IGBC ring, client map assets, logo handling.
- Accessibility and performance practices (lazy scenes, composited transforms, reduced-motion paths).

---

## 5. Phases and acceptance

| Phase | Scope | Done when |
|---|---|---|
| **R4-1 Foundations** | Light tokens (midnight retired), Open Sans-only type scale, remove Plus Jakarta and the serif accent, label rules, `Rail` component | Dark share ≤ 10% of scroll length (footer only, plus at most one band); one typeface; no uppercase eyebrow on body blocks; Lighthouse a11y still 100 |
| **R4-2 Hero + gallery** | New hero with `main.webp`; preloader and intro removed; gallery de-pinned | Hero fully visible at first paint; page reaches the next section after one normal scroll past the gallery; no clipped frame at 900 px and 700 px tall viewports; LCP ≤ 1.5 s desktop |
| **R4-3 Official plan + Constra viewer** | `ZoneHotspots`, zone mapping, status viewer modes | Every zone reachable by hover, tap and keyboard; no zone shown without client-confirmed mapping |
| **R4-4 Missing sections** ✅ 2026-10-16 (see HANDOVER) | Amenities, Gati Shakti network, Path Group timeline, business-value tidy | Every Concept Note homepage item present |
| **R4-5 Motion pass** ✅ 2026-10-16 (route spine, reveals, hover lift; see HANDOVER) | Route linking sections, reveals, hover feedback, tuning | No pin on the page; reduced motion verified; no CLS |
| **R4-6 Inner pages + forms** ✅ 2026-10-16 (destination webhook still to be named by the client) | The six pages; form endpoint | Every nav item has a real page |
| **R4-7 QA** | Cross-browser, real devices, Lighthouse, screenshots in `docs/redesign/r4/` | Scores at or above round 3 (desktop 96 / mobile ~70, target mobile 80+) |

Suggested order: R4-1 → R4-2 (these answer the immediate complaints) → R4-3 → R4-4 → R4-5 → R4-6 → R4-7.

---

## 6. Decisions and client needs

**Decisions for you (recommended default first)**

| ID | Question | Recommendation |
|---|---|---|
| D1 | Typeface | **Decided:** Open Sans only |
| D2 | Hero layout: split (light panel + image) or full-bleed image with scrim? | Split (light), in line with the white/light ask |
| D3 | Path Group numbers: PDF values or live-site values? | Ask the client; show neither until confirmed |
| D4 | Enquiry form destination (email, CRM, Formspree-style endpoint)? | Email/CRM endpoint to be named by the client |

**Needed from the client**

1. Constra collaterals (timelapse MP4, drone clip, dated progress photos) and any shareable Constra viewer link.
2. High-resolution `main.webp` (≥ 2400 px wide) and the drone / site video for the hero.
3. Real site photographs for each amenity.
4. Legend → zone mapping on the official plan; confirm the 7 zones.
5. Path Group figures, IGBC vs GRIHA, footer address, WhatsApp number, brochure PDF, and the earlier HANDOVER §4 items.

---

## 7. Risks

- The `main.webp` render is generic; without a label it could be read as the real site. Mitigation: caption and a later swap to drone footage.
- Hotspots built from colour-keying depend on the drawing staying fixed; a new plan from the client means regenerating the masks (scripted, so cheap).
- Going Open Sans-only and fully light changes the look signed off in round 3. That is deliberate: it follows the client's V2 feedback, and the round-3 serif accents and near-black sections were never client-requested.
- Pages that were designed as dark (hub opener, Gati Shakti, site tour, gallery) need a real light redesign, not a recolour, or they will look washed out (the problem round 3 was meant to fix). Give them strong imagery, brand-colour numerals and the pinwheel stripe.
- The inner pages are the largest remaining effort (R4-6) and are not required to fix the current complaints.

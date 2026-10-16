# Path Logicity — Premium redesign plan (round 3)

> 2026-10-15 · Follows client round 2 (`docs/CLIENT-CHANGES-PLAN.md`).
> Brief: the site is fine but **does not feel premium**, motion is thin, and it reads
> **washed out**. Keep the client's signature colours; make it elegant and premium.
> **Status:** decisions signed off with the recommended choices (§7). **Phase 1 done** (2026-10-15):
> tokens (porcelain / stone / midnight), Plus Jakarta Sans + Instrument Serif accents (`*word*` →
> `lib/accent.tsx`) + Open Sans body, gold-only accent, review-only placeholders
> (`?annotations=on`), survey grids removed, image grade + swaps, midnight footer with grain, glow and
> the pinwheel stripe. Screenshots: `docs/redesign/phase-1/`.
> **Phase 2 done** (2026-10-15): hero on the client's entry-gate render (midnight veils, nav switches to
> light text over it); midnight anchors — renders gallery (new, pinned horizontal scroll on desktop),
> hub opener (pinwheel mark as the hub), Gati Shakti + partner chips, site tour (`PlanSvg tone="dark"`);
> light sections restyled (official master plan by default, glass metrics strip + serif quote in PATH
> Group, serif milestone numerals, card shadows, Scale hover previews, enquire image panel).
> Screenshots: `docs/redesign/phase-2/`.
> **Phase 3 done** (2026-10-15): M1 `providers/Preloader` (head script → `html[data-preload]`, once
> per session) · M2 hero window reveal + word-by-word rise · M3 `providers/SurfaceMorph`
> (`data-surface="dark"`) · M4 `ui/RevealMedia` (in AssetSlot) · M5 gallery pin (P2) · M6
> `ui/Magnetic` on CTAs · M7 odometer `ui/Counter` · M8 map establishing shot + gold route traces ·
> M9 partner marquee · M10 pinwheel spins into the hub + pulse · M11 letter-spacing settle + body
> fade · M12 React `<ViewTransition default="page-wipe">` (midnight curtain rather than gold — calmer).
> All gated on reduced motion. Frames: `docs/redesign/phase-3/`.
> **Phase 4 done** (2026-10-15): Lighthouse desktop 96/100/100/100, mobile ~70/100/100/100, CLS 0; no
> overflow 320–1280px; reduced motion and keyboard verified; Edge, Firefox and WebKit pass. Fixes and
> remaining items: `docs/redesign/QA-REPORT.md`.

---

## 1. Why it feels washed out

| Symptom | Cause in the current build |
|---|---|
| Flat, pale, "all the same" | Every section is light mist on light mist. There is **no tonal contrast**: no deep sections, no strong anchors |
| Low contrast | Pale blue-grey backgrounds, pale blue labels, steel-grey body text and 10%-opacity hairlines |
| Busy, not elegant | The pinwheel colours are used **everywhere at once**: blue labels, green, gold and orange numerals, coloured dots. Premium brands use one accent with restraint |
| Generic type | Open Sans at weight 800 for every headline is a default corporate look. Heavy weight reads loud, not luxurious |
| Unfinished | `[ VERIFIED DETAIL TO BE SUPPLIED ]`, `[ DATE — CMS ]` and asset-slot labels are visible to visitors |
| Faded imagery | The PATH Group image fades into a pencil sketch. Renders have mixed yellow and green casts. The "Commercial" zone shows a solar-panel stock photo |
| Clutter | Survey grid lines, registration corners, micro-labels and boxed cards everywhere |
| Motion feels basic | Line reveals and counters only. No intro, no image reveals, no scroll-linked colour or scale changes, no showpiece moment |

## 2. Design direction: "Quiet luxury, brand-led"

What premium infrastructure and real-estate sites do well:
- **Contrast rhythm:** light editorial sections broken up by deep, cinematic brand sections.
- **One accent:** gold, used thinly (rules, numbers, the CTA).
- **Big imagery:** full-bleed photography, consistently colour-graded, revealed with motion.
- **Refined type:** a lighter weight at large size, generous space, few words.
- **Less chrome:** fewer boxes, borders and labels; let space do the work.

The route line, the client palette and the section order **stay**. This is a re-skin plus a
motion upgrade, not a restructure.

## 3. Design system changes

### 3.1 Colour: same signature hues, new roles

| Token | Hex | Role |
|---|---|---|
| `porcelain` | `#F8F8F5` | Main light background, neutral rather than blue-grey (fixes the washed-out tint) |
| `stone` | `#EFEEEA` | Alternate light background |
| `paper` | `#FFFFFF` | Cards only |
| `midnight` | `#0D0E35` | **New deep anchor**, derived from the brand indigo, for 4 cinematic sections |
| `indigo-700` | `#201F85` | Brand indigo: headings, links, footer |
| `ink` | `#111233` | Body text, darker than now for crisp contrast |
| `gold` | `#E7AC00` | **The one accent**: CTAs, thin rules, the route comet, key numerals on dark |
| green / blue / orange | as now | **Only** inside the pinwheel motif, map legend, sustainability (green) and status dots |

- **Pinwheel signature:** a 4-colour stripe (gold, green, blue, orange), 2px tall. It appears in
  exactly three places: under the nav on scroll, at section-opening rules on deep sections, and
  in the preloader. This is how the client's colours become a *signature* rather than confetti.
- Numerals become ink on light and gold on dark. The cycling pinwheel numbers are dropped.
- Deep sections get a subtle **film grain** (2% SVG noise) and soft radial **gold / indigo
  glows**. This depth is what separates a premium dark section from the old flat navy.

> Light vs dark balance: about **70% light / 30% deep**. The client rejected an *all-dark* site.
> Selective deep moments are what make the light sections feel premium.

### 3.2 Typography

- **Display:** a refined, modern sans at **weight 500–600**, not 800, with tight tracking and
  large sizes. Recommended: **Plus Jakarta Sans** (Google Fonts, geometric, premium feel).
- **Accent:** an italic serif for 1–2 words per headline. Recommended: **Instrument Serif**
  italic (e.g. "India's largest *multimodal* logistics hub"). This is a common luxury device
  and pairs well with indigo and gold.
- **Body:** stays **Open Sans**, the client's brand font, at 17–18px with leading 1.7.
- **Labels:** fewer of them. 12px, wide-tracked, used only for section indices.
- Scale: hero about 6rem desktop; section titles about 3.5rem; body 1.0625–1.125rem.

### 3.3 Layout and surfaces

- Section padding increases (`clamp(120px, 16vh, 220px)`), with editorial asymmetry on the 12-column grid.
- Remove the survey grid lines and registration corners from light sections. Keep one subtle dot field on deep sections only.
- Cards get a **2px radius**, a soft layered shadow and no hairline borders. The number of boxed elements is roughly halved.
- **All placeholder annotations are hidden by default.** They show only with `?annotations=on`, for internal review.

### 3.4 Imagery

- A unified **colour grade** on every photo and render (`contrast 1.06, saturate 0.92`, plus a
  faint indigo shadow overlay), so the mixed yellow and green renders read as one set.
- Replace the half-sketch PATH Group image with the clean aerial render. Replace the solar
  stock image on "Commercial" with a proper render (or a client-supplied image).
- Use the strong renders that are currently underused: the **entry gate**, the **container
  yard with gantry cranes**, and the **highway aerial**.

## 4. Motion system upgrades

All motion stays behind `gsap.matchMedia` with full reduced-motion fallbacks. It only animates
transform, opacity and clip-path.

| # | Motion | Where |
|---|---|---|
| M1 | **Preloader:** the four pinwheel petals fly in and lock into the mark, the wordmark fades, then a curtain wipes up to the hero. Once per session, ≤ 1.6s | Site entry |
| M2 | **Hero intro:** the image reveals with a clip-path (center → full) and a slow 1.15→1 scale; the headline rises word by word with a mask; the serif accent word fades in last | §01 |
| M3 | **Scroll colour morph:** the page background tweens between porcelain and midnight as deep sections enter, so there are no hard section edges | Global |
| M4 | **Image reveal:** every image wipes in (`inset(100% 0 0 0)` → 0) with a 1.2→1 inner scale and parallax drift (±6%) | Global |
| M5 | **Pinned horizontal gallery:** "The park, in renders" — 6 renders scroll sideways, with captions and a progress line | New, between §05 and §06 |
| M6 | **Magnetic buttons** and a subtle **cursor follower** (desktop only); the CTA fill sweeps on hover | Global |
| M7 | **Odometer numbers:** digits roll like a counter instead of plain counting | §02, §05, §06.1 |
| M8 | **Map on scroll:** routes draw one after another as the map enters; the camera eases from region to site as you scroll, then hands over to the interactive planner | §07 |
| M9 | **Logo marquee:** partner logos drift slowly and pause on hover | §07.1, footer |
| M10 | **Hub opener (showpiece):** on midnight, about 24 gold, green and blue routes converge on scroll into the pinwheel mark, which then spins into place | §06 |
| M11 | **Text polish:** section titles reveal by line with a slight letter-spacing settle; paragraphs fade up | Global |
| M12 | **Page transitions:** a gold curtain wipe between routes, using the View Transitions API with a fallback | Inner pages |

## 5. Section-by-section

| § | Section | Surface | Redesign |
|---|---|---|---|
| 01 | Hero | Image | Full-bleed **entry-gate or aerial render** with an indigo gradient at lower left; white display headline with a serif accent; one gold CTA plus a text link; small location chip; M1 + M2 |
| 02 | Scale | Porcelain | Huge "400" in ink with an odometer roll; the four nodes become a refined list with hover image previews |
| 03 | Master plan | Stone | Official plan by default on a large white card, with the interactive zones as an overlay toggle; detail panel as an elegant side sheet |
| 04 | Project status | Porcelain | Large media with a cinematic crossfade, and a timeline in an editorial style; Constra badge |
| 05 | PATH Group | Porcelain | Full-bleed clean aerial with metrics overlaid on a glass strip; quote in serif italic |
| 05.5 | **NEW: Renders gallery** | **Midnight** | Pinned horizontal scroll of 6 renders (M5) |
| 06 | Hub opener | **Midnight** | Showpiece M10, with grain and a gold glow |
| 06.1 | At a glance | Porcelain | Specification drawing kept, but cleaner: ink lines and gold anchors, no grid |
| 07 | Connectivity map | Stone | Map in a large card with soft shadow; M8; planner restyled as a premium list |
| 07.1 | Gati Shakti + partners | **Midnight** | National numbers in gold; logo marquee on white chips (M9) |
| 08 | Sustainability | Porcelain + green tint | IGBC ring kept; initiatives as elegant icon rows; placeholders hidden |
| 08.1 | Business value | Porcelain | Five columns, icon redraw on hover, no boxes |
| 09 | Site tour | **Midnight** | Cinematic perspective plan with glow; gold CTA |
| 10 | News | Porcelain | Magazine layout: large featured image plus list |
| 11 | Enquire | Stone | Split layout: an image panel on the left, the form card on the right |
| 12 | Footer | **Midnight → brand indigo** | Pinwheel stripe on top, giant wordmark with a gradient stroke |

## 6. Delivery phases

| Phase | Scope | Result |
|---|---|---|
| **P1 Foundations** | Tokens, fonts, porcelain/midnight surfaces, grain/glow utilities, image grade, hidden annotations, de-cluttering | Site immediately looks richer and calmer |
| **P2 Sections** | Re-skin all sections per §5; new renders gallery | Full visual redesign |
| **P3 Motion** | M1–M12 | Premium feel in motion |
| **P4 QA** | Mobile, reduced motion, contrast, Lighthouse (LCP < 2.0s, CLS < 0.05), cross-browser | Ship-ready |

Each phase ends with screenshots for your review before the next one starts.

## 7. Decisions needed before building

1. **Fonts:** Plus Jakarta Sans + Instrument Serif accents + Open Sans body (recommended), or all Open Sans in lighter weights (safer for the client's "brand font" expectation).
2. **Deep sections:** OK to bring back about 4 midnight sections for contrast, given the client called the old site "too dark"? (Recommended: yes. The old site was ~100% dark; this is ~30%.)
3. **Preloader:** yes (recommended, once per session) or no.
4. **Custom cursor:** yes or no (recommended: magnetic buttons only, no cursor follower).
5. **Images:** approve swapping the sketch-fade and solar-panel images for client renders.

## 8. Risks

- **Too dark again:** mitigated by the 70/30 balance and by keeping the hero light-leaning; reviewed at the end of P1.
- **Performance:** preloader and gallery could slow first load. The poster image stays the LCP element; the preloader never blocks it, and the gallery loads lazily.
- **Fonts:** a third family adds about 40 KB. Use subsets plus `display: swap`.

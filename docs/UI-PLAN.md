# PATH LOGICITY — UI Plan

> Website concept · Homepage-first · v1.0 · 7 Oct 2026
> Source of truth: `reference/Concept Note for Path Logicity.pdf` (The Friday Code) + `prompts/initial.md`

---

## 0. The idea in one line

**THE LOGIC OF MOVEMENT.** A single thin route line runs through the whole site, from the hero to the enquiry button. Every section either draws that line, bends it, branches it or ends it. The page works like the hub it describes: separate chapters linked into one system.

Quality bar for every section: *Does it say SCALE? Does it say MOVEMENT? Does it make me want to explore?* If a section could appear on any logistics site, redesign it.

---

## 1. Fact register (only these may appear as claims)

Everything below is supplied by the client. **Nothing else is stated as fact.** Anything missing renders as a labelled slot (§4.6).

| Group | Verified copy |
|---|---|
| Positioning | India's Largest Multimodal Logistics Hub · A connected logistics ecosystem at Dobbaspet, Bengaluru, built to move businesses faster · Dobbaspet, Bengaluru, the largest MMLP zone *(PDF p.6)* |
| Scale icons | SCALE: 400-acre integrated development · LOCATION: Strategic Dobbaspet, Bengaluru location · CONNECTIVITY: Road + Rail + Air + Ports · ECOSYSTEM: Warehousing + Dry Port + Logistics + Commercial · LEGACY: PATH Group's infrastructure experience |
| At a glance | ~400 Acres integrated logistics infrastructure · ~5.2 Mn sq. ft. Grade-A warehousing · ~1.76 Mn sq. ft. commercial space · ~40 Acres state-of-the-art rail terminal · 6 Railway Sidings · ~0.78 Mn sq. ft. customs-bonded infrastructure · Phase 1 \| 138 Acres, the first step towards a larger logistics ecosystem |
| Master plan zones | Warehousing · Rail Terminal · Dry Port/ICD · Commercial · Yards · Roads · Green Infrastructure |
| PATH Group | 30+ Years infrastructure experience · 18 States pan-India presence · 70+ Locations · ~6,100+ Workforce · Experience across infrastructure, highways and logistics · Brand story: *"With nearly three decades of experience in building India's infrastructure, PATH has evolved from developing critical infrastructure to creating integrated logistics ecosystems for the future."* |
| Connectivity | ROAD: NH 648 · NH 48 · STRR · RAIL: 6 railway sidings · AIR: Kempegowda International Airport · PORTS: Mangalore · Chennai |
| PM Gati Shakti | Tagline "Driving India's vision for integrated and efficient logistics." · 3 narrative paragraphs + 6 growth bullets + "The Impact" line *(PDF p.5–6)* |
| Amenities | 7 amenities **with their PDF descriptions** (Truck Facilities, Food & Retail, EV Charging, Fuel Station, Vehicle Repair & Service, ATMs & Essential Services, Green & Open Spaces) |
| Sustainability | IGBC Platinum Pre-Certification (hero claim) · Solar Energy · Rainwater Harvesting · Waste Management · EV Infrastructure · Resource Efficiency · Story: More efficient infrastructure → smarter logistics → more sustainable growth |
| Business value | Faster TAT · Lower Logistics Cost · Faster Connectivity · Greater Operational Efficiency · Scalability (each with its PDF one-liner) |
| Conversion | Form fields, 7 industries, SUBMIT LEASE ENQUIRY → / PLAN A SITE VISIT → / Call Leasing Team / WhatsApp / Download Brochure / Social |

**Never fabricate:** coordinates, distances, travel times, milestone dates, completion %, ESG metrics, news, blog posts, testimonials, client logos, awards, phone numbers.

---

## 2. Experience architecture

### 2.1 Journey → homepage chapters

| Stage | Feeling | Homepage section | Background |
|---|---|---|---|
| DISCOVER | WOW | 01 Hero (video) | Video + navy veil |
| DISCOVER | What is this? | 02 Scale Index (400 acres + 4 icons) | Navy 950 |
| EXPLORE | Let me explore | 03 Explore Path Logicity (interactive master plan) | Navy 900 + blueprint grid |
| EXPLORE | It's real and moving | 04 Watch the Project Take Shape | Navy 950 |
| BELIEVE | I trust who's building it | 05 PATH Group | **Warm off-white** (editorial break) |
| UNDERSTAND | I understand the scale | 06 The Logicity Advantage: One Hub. Every Route. (at-a-glance diagram) | Navy 950 (darkest) |
| UNDERSTAND | It connects everywhere | 07 Connectivity Map → India zoom + PM Gati Shakti band | Indigo 900 |
| BELIEVE | It's responsible *and* profitable | 08 Sustainability (IGBC) + Business Value | Off-white → Navy |
| EXPLORE (again) | Let me go inside | 09 Logicity360 preview | Black-navy full-bleed |
| BELIEVE | It's current | 10 In the News | Off-white |
| ENQUIRE | I want to enquire | 11 Final CTA + form → 12 Footer | Navy 900 → 950 |

PATH Group stays where the brief puts it, straight after Project Status. It answers "who is behind this?" at the moment the user has seen that the project is real. It also gives the only warm, light break between two long dark stretches. The four light/green sections (05, 08a, 10, form inputs) keep the site from feeling "overwhelmingly white" while stopping the dark from getting heavy.

### 2.2 Sitemap (from PDF)

```
/                     Home ── Explore Path Logicity · Project Status
/path-group           Highlight · About Path
/logicity-advantage   Project at a Glance · Amenities · Solutions (connectivity) · PM Gati Shakti
/sustainability       ESG · Business Value
/site-tour            Logicity360 (full-screen 3D viewport)
/news                 News · Media Coverage · Project Updates · Events  (+ /news/[slug])
/blogs                Listing (+ /blogs/[slug])
#enquire              Final CTA block, shared by ALL pages (PDF: "FOOTER for all pages")
```

Sub-sections are anchors (`/logicity-advantage#amenities`) so dropdown links scroll to them and can be shared.

### 2.3 Journey rail (wayfinding)

On desktop a fixed hairline rail at the right edge reads `DISCOVER · EXPLORE · UNDERSTAND · BELIEVE · ENQUIRE`. The current stage is yellow and a small dot travels the rail as you scroll. It makes the client's progression visible and doubles as a progress bar. Each label is a link that jumps to that stage. Hidden ≤1024px.

---

## 3. Design system

### 3.1 Color tokens

The exact brand hex values were **not supplied**. The values below are provisional and come from the logo (mustard-yellow / green / indigo pinwheel). Confirm them against the brand guidelines before build sign-off.

```css
@theme {
  /* Depth */
  --color-ink:        #04081A;  /* near-black navy: video veils, site tour */
  --color-navy-950:   #070E26;  /* dominant dark */
  --color-navy-900:   #0B1535;
  --color-navy-800:   #13204A;  /* raised surfaces, asset slots */
  --color-indigo-700: #26338A;  /* logo wordmark family: map land, data */
  --color-indigo-400: #6C78D6;  /* rail lines, data on dark */

  /* Accents: strict roles */
  --color-yellow-400: #F2B705;  /* ACTION ONLY: CTAs, active route head, focus */
  --color-yellow-200: #F8DA7A;
  --color-green-500:  #5BAA3C;  /* SUSTAINABILITY + "completed" state */
  --color-green-700:  #2F6B22;  /* green text on light (AA) */

  /* Light */
  --color-paper:      #F3EFE6;  /* warm off-white */
  --color-paper-2:    #E7E1D4;
  --color-steel-500:  #8891A7;  /* secondary text on dark */
  --color-steel-300:  #C4C9D6;
  --color-line-dark:  rgb(255 255 255 / 0.10); /* hairlines on dark */
  --color-line-light: rgb(7 14 38 / 0.12);     /* hairlines on light */
}
```

**Color rules**
- Yellow is a signal, not a decoration. It marks the next action and the "head" of the moving route. On any screen it covers less than 3% of pixels.
- Green belongs to Sustainability and to the *completed* state. Outside those it appears only in the logo.
- Do not use yellow or green-500 for text on paper (fails contrast). On light backgrounds use navy text, `green-700`, or a yellow *fill* with navy text.
- No gradients except (a) the dark veil over imagery and (b) the fading tail of the route line.

### 3.2 Typography

| Role | Family | Use |
|---|---|---|
| Display | **Manrope** 300–800 (variable) | Headlines, numbers |
| Text | **Inter** 400/500 | Body, UI |
| Technical | **JetBrains Mono** 400/500 *(optional, recommended)* | Coordinate tags, zone codes, labels, units, asset-slot labels. This is the "survey drawing" voice. |

| Token | Size (clamp) | LH | Tracking | Weight |
|---|---|---|---|---|
| `display-hero` | `clamp(3rem, 9.6vw, 11.5rem)` | 0.86 | -0.045em | 800 |
| `display-xxl` (numbers) | `clamp(6rem, 24vw, 26rem)` | 0.8 | -0.06em | 700 |
| `display-xl` | `clamp(2.75rem, 7vw, 8rem)` | 0.9 | -0.04em | 800 |
| `display-l` | `clamp(2.25rem, 4.6vw, 5rem)` | 0.95 | -0.035em | 700 |
| `display-m` | `clamp(1.75rem, 3vw, 3rem)` | 1.0 | -0.025em | 700 |
| `body-l` | `clamp(1.125rem, 1.4vw, 1.375rem)` | 1.45 | -0.01em | 400 |
| `body` | 1rem | 1.6 | 0 | 400 |
| `label` (mono) | 0.75rem | 1.3 | 0.08em, UPPERCASE | 500 |
| `micro` (mono) | 0.6875rem | 1.3 | 0.1em, UPPERCASE | 400 |

**Typesetting rules:** headlines are UPPERCASE and set tight, broken by hand at meaningful points (never left to auto-wrap). Body text stays under 52ch and 3 lines per block where possible. Numbers use `font-variant-numeric: tabular-nums` and follow the **Metric anatomy**:

```
 ~ 5.2          ← tilde at 0.45em, raised; value in display
   MN SQ. FT.   ← unit in mono label, baseline-aligned to the value's foot
   Grade-A warehousing      ← descriptor in body, steel colour
```

### 3.3 Grid and spacing

- 12 columns, max content width 1600px, page margin `clamp(16px, 4vw, 72px)`, gutter `clamp(16px, 1.6vw, 28px)`.
- **The visible survey grid:** dark sections can show the column lines as 1px `line-dark` hairlines plus a faint 8×8 dot field. This is what makes the page feel like a technical drawing. Used in sections 03, 06 and 07, never everywhere.
- Spacing on a 4px base: `4 8 12 16 24 32 48 64 96 128 192 256`. Section padding is `clamp(96px, 14vh, 192px)`.
- Corner radius is **0** by default and 2px for inputs and chips. Pills are allowed only for status chips. No rounded cards.
- Shadows: none. Depth comes from tone, hairlines and imagery.

### 3.4 Signature device: the route line

One SVG primitive, `<Route>`, with variants:

| Property | Spec |
|---|---|
| Stroke | 1.5px desktop / 1.25px mobile, `vector-effect: non-scaling-stroke` |
| Head | 6px yellow dot + 24px soft halo (the "vehicle") |
| Tail | Linear fade from yellow → indigo-400 → transparent over the last 30% |
| Dormant state | `line-dark` (white 10%) |
| Drawing | `stroke-dashoffset` tied to scroll (scrubbed) or to time (0.9–1.4s, `power2.inOut`) |

**Line style encodes transport mode.** This lets mode read without color (accessibility) and is reused in the legend everywhere:

```
ROAD   ━━━━━━━━━━━━   solid, yellow when active
RAIL   ┿┿┿┿┿┿┿┿┿┿┿┿   solid + sleeper ticks, indigo-400
AIR    ·  ·  ·  ·  ·   dotted arc, steel-300
PORT   ── ── ── ──     long dash, paper
```

**Continuity hand-off.** Each section's route exits at a named "port" on its bottom edge, and the next section enters at the same x. Ports sit on the column lines, so the line appears to run unbroken across section boundaries.

| Section | Enters | Route behaviour | Exits |
|---|---|---|---|
| 01 Hero | left edge, y 62% | Sweeps across the aerial video while the headline lifts away | col-line 2 ↓ |
| 02 Scale | col 2 | Drops into the "4" of **400**, then branches to 4 nodes | col 2 ↓ |
| 03 Master plan | col 2 | Becomes the internal road network; runs from the gate to the selected zone | col 6 ↓ |
| 04 Status | col 6 | Becomes the vertical timeline spine | col 6 ↓ |
| 05 PATH Group | col 6 | Navy on paper; becomes the evolution line Legacy → Logicity | col 6 ↓ |
| 06 Advantage | col 6 | Many routes converge on one central hub; then become leader lines to stats | col 8 ↓ |
| 07 Connectivity | col 8 | Splits into real routes by mode; zooms out into the national network | col 4 ↓ |
| 08 Sustainability | col 4 | Closes on itself into a **circle** (the ecosystem ring) | col 4 ↓ |
| 09 Site Tour | col 4 | Traces the plan perimeter in perspective | col 6 ↓ |
| 10 News | col 6 | Quiet: a hairline under the tabs only | col 6 ↓ |
| 11 CTA | col 6 | Final run; **ends at the Submit button**, which acts as the destination pin | — |
| 12 Footer | — | Logo wordmark sits on the end of the line | — |

### 3.5 Iconography

- A custom line set on a 24px grid with 1.5px strokes, square caps, and no fills except one accent node. Same weight as the route line.
- Core set: road, rail, air, port, warehouse, ICD/container, commercial, yard, green, crosshair (location), network (ecosystem), legacy (stacked strata), solar, rain, waste, EV, efficiency, TAT, cost, connectivity, ops-efficiency, scale, phone, WhatsApp, download, arrow-right.
- Icons draw themselves on (stroke animation, 600ms) the first time they enter view and run a small *meaningful* loop on hover (see §5).

### 3.6 Motion tokens

| Token | Value | Use |
|---|---|---|
| `dur-micro` | 160ms | hover color, underline |
| `dur-ui` | 280ms | dropdowns, tabs, chips |
| `dur-reveal` | 700ms | text/image reveals |
| `dur-route` | 1200ms | timed route draws |
| `ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | all reveals |
| `ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | routes, map camera |
| Stagger | 60ms (lines), 90ms (items) | |
| Parallax | at most 8% of element height | |
| Hover shift | 4–8px | |

**Allowed:** line-by-line clip reveals, scrubbed route draws, counters (one pass, 1.4s), clip-path image wipes, slow video zoom, horizontal pinned scroll, map camera tweens.
**Banned:** bounce or elastic easing, spins, auto-rotating carousels, preloader screens, custom novelty cursor, scroll-jacking beyond the three pinned scenes (Hero, Master Plan, Amenities).

### 3.7 Components inventory (reusable)

`Route` · `Metric` · `AssetSlot` · `ContentSlot` · `CoordTag` (mono `ZONE 03 / RAIL TERMINAL`) · `SectionHeader` (index `03 /`, kicker, headline, optional body) · `Button` (primary-yellow, outline-light, outline-dark, text-arrow) · `ArrowLink` · `Chip` · `Tabs` · `ModeLegend` · `Marker` (pulse, active, hollow) · `RevealText` · `Counter` · `HorizontalScroller` · `MediaFrame` (registration corners, parallax) · `BottomSheet` (mobile).

**Buttons**
- `primary`: yellow fill, navy text, 0 radius, 56px tall (desktop) / 52px (mobile), label in Inter 600 tracked 0.04em uppercase. The arrow slides 6px on hover and a navy wipe sweeps left→right under the label.
- `outline-light`: 1px paper border; on hover it fills paper and the text turns navy (outline → filled, per brief).
- `text-arrow`: label + `→`. On hover the underline grows from 0 to 100% from the left and the arrow moves 4px.

---

## 4. Global elements

### 4.1 Navigation

```
DESKTOP — over hero (transparent)
┌──────────────────────────────────────────────────────────────────────────────┐
│ [PATH LOGICITY]    HOME  PATH GROUP▾  LOGICITY ADVANTAGE▾  SUSTAINABILITY▾     │
│                    SITE TOUR  NEWS  BLOGS                     [ ENQUIRE  → ] │
└──────────────────────────────────────────────────────────────────────────────┘
  height 88px · links paper/80% · ENQUIRE = outline-yellow
```

- **States:** `transparent` (over hero) → `solid` once the hero is ~85% scrolled: navy-950 at 92% with `backdrop-filter: blur(12px)`, a 1px `line-dark` bottom hairline, height 88 → 64px (280ms), logo scales to 0.85. ENQUIRE becomes a yellow fill. After the hero the bar hides on fast downward scroll and returns on any upward scroll.
- **Links:** Inter 500, 13px, tracked 0.06em. Hover underline grows from the center (2px, yellow, 160ms). The current page gets a persistent 2px underline.
- **Dropdowns (not mega-menus):** a narrow navy-900 panel, 280px wide, 1px yellow top rule that draws left→right. It lists children with a mono index and one-line descriptor (`01  Project at a Glance — ~400 acres in numbers`). Opens on hover with a 120ms intent delay, or on click/Enter. `Esc` closes it. Arrow keys move between items.
- **Logo:** official SVG only (not supplied, so slot). The full-colour pinwheel sits on dark; a mono version on paper sections.

**Mobile (≤1024px)**
- The bar shows logo + `ENQUIRE` (compact yellow) + menu button (two hairlines → ✕).
- Full-screen navy-950 overlay. The background survey grid draws in, then items 01–07 rise line by line in `display-m` (40–48px). Items with children expand as accordions with mono sub-items. The bottom of the overlay is pinned: full-width yellow `ENQUIRE`, then `CALL` · `WHATSAPP` icon buttons, then social.
- **Persistent bottom action bar** after the hero: `[ ENQUIRE → ]  [☎]  [WhatsApp]`, 56px tall, safe-area aware, hidden while the footer form is in view.

### 4.2 Section header pattern

```
03 /  EXPLORE PATH LOGICITY                 ← mono label: index + chapter
INTERACTIVE                                  ← display-xl, hand-broken
MASTER PLAN
Short line, 1–2 sentences max.               ← body-l, steel
```
Headers are left-aligned on col 1–7 by default. Asymmetry comes from where the media sits, never from centered text. The only centered header is §06.

### 4.3 Final CTA + form (shared by all pages)

See §5.11. It sits above the footer on every page, per the PDF.

### 4.4 Footer

See §5.12.

### 4.5 Journey rail

See §2.3.

### 4.6 Asset and content slots (placeholder system)

Placeholders should look deliberate, so the client can see the art direction while knowing exactly what to supply.

```
┌ ─                                                     ─ ┐   ← registration corners
  ASSET SLOT 01                                  16 : 9
  PROJECT VIDEO
                 [ slow animated topographic contour field ]
  Drone aerial of site · 1920×1080 · MP4/WebM
  12–20s seamless loop · ≤ 6 MB                  CLIENT
└ ─                                                     ─ ┘
```

- `AssetSlot` props: `type` (PROJECT VIDEO · SITE AERIAL · MASTER PLAN · CONSTRUCTION PROGRESS · WAREHOUSING · RAIL TERMINAL · AMENITIES · CONNECTIVITY · 3D SITE TOUR · PATH GROUP PHOTOGRAPHY), `ratio`, `spec`, `id`. Rendered as a navy-800 fill + animated contour SVG (CSS-only, paused under reduced motion) + mono labels.
- `ContentSlot`: inline mono text in `steel-500` with a dashed underline, e.g. `[ DISTANCE — TO BE CONFIRMED ]`, `[ MILESTONE DATE — CMS ]`.
- **Presentation toggle:** `?annotations=off` hides the slot labels (the contour art stays) for clean client screenshots. `?annotations=on` (default) shows them.

---

## 5. Homepage, section by section

### 01 · HERO: "This is a massive piece of infrastructure"

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NAV (transparent)                                                             │
│                                                                               │
│  INDIA'S                                                 ┌───────────────┐    │
│  LARGEST                                          ⌖──────┤ PHASE 1       │    │
│  MULTIMODAL                                              │ 138 ACRES     │    │
│  LOGISTICS HUB                                           └───────────────┘    │
│                                                                               │
│ ─────────────────────────────────────────────────────────────────────────────│
│ ⌖ DOBBASPET              A connected logistics          [ EXPLORE THE PROJECT →]
│   BENGALURU              ecosystem at Dobbaspet,          ENQUIRE LEASING NOW → │
│   NH 648 · NH 48 · STRR  Bengaluru, built to move                             │
│                          businesses faster.                 ❚❚  SCROLL ─╮      │
└──────────────────────────────────────────────────────────────────────────────┘
          full-bleed site video · navy veil 0 → 70% bottom-up + 25% overall
```

- **Background:** full-bleed site video (ASSET SLOT 01). The veil is `linear-gradient(to top, navy-950 0%, navy-950/60 30%, transparent 65%)` plus a flat 25% navy wash, and nothing heavier. Until the client footage arrives, the slot renders as a "cinematic placeholder": slow drifting contour lines, a faint survey grid, and a soft light sweep every 8s, so the hero still feels alive in the concept presentation.
- **Headline:** the exact client message on 4 hand-set lines in `display-hero`, paper colour, ExtraBold, cols 1–9. On mobile it becomes 5 lines (`LOGISTICS / HUB`). Intro: lines rise from a clip mask with a 60ms stagger after the poster paints (total under 1s, no preloader).
- **Location anchor ("highlight aggressively"):** the bottom-left HUD block.
  - A yellow crosshair `⌖` icon, then **DOBBASPET** in `display-m` ExtraBold, then **BENGALURU** in `display-m` Light, then a mono line `NH 648 · NH 48 · STRR`. Those are verified road links and serve as the geographic proof.
  - A matching crosshair reticle sits *on the video frame* over the site's position, joined by a hairline leader to a mono tag `PHASE 1 · 138 ACRES`. The location becomes a place you are looking at, not just a label.
  - **Coordinates:** a `CoordTag` slot is wired up but **renders only when a verified lat/long exists in CMS**. Until then it is hidden, never shown as fake numbers or as a "TBC" in the hero.
- **Supporting copy:** body-l, cols 5–8, max 34ch.
- **CTAs:** `EXPLORE THE PROJECT →` (yellow primary, scrolls to §03) and `ENQUIRE LEASING NOW →` (text-arrow, paper, opens `#enquire`). Restrained: one filled button only.
- **Video control:** a ❚❚/▶ button bottom-right (required by WCAG 2.2.2 for motion longer than 5s). The scroll cue is a 1px vertical line with the route head dropping along it on a 2.4s loop, plus the mono label `SCROLL TO ENTER`.

**Scroll scene (pinned, ~140vh, scrubbed):**
| Progress | What happens |
|---|---|
| 0 → 35% | Video scales 1.00 → 1.12 (an aerial "descent"); the veil deepens to 60% |
| 10 → 45% | Headline lines lift −12vh and clip out, staggered top line first; HUD fades |
| 25 → 85% | **The route line draws** from the left edge across the frame, passing through the site reticle (yellow head, fading tail) |
| 70 → 100% | Video dissolves into navy-950; the route's end locks onto col-line 2 and continues straight down into §02 |
| 85% | Nav switches to the solid state |

Mobile: no pin. Video scale 1→1.06 on scroll, the route draws by time when it enters view, and a separate 4:5 vertical video encode is used.

---

### 02 · SCALE INDEX: "400 ACRES ↓ INTEGRATED LOGISTICS ECOSYSTEM"

The PDF calls for interactive icons. Here they become **nodes in a network diagram** branching from one number, not five stat cards.

```
 │ (route arrives)
 │
 4 0 0                                    ┌─○ LOCATION
 ┃                         ╭──────────────┤   Strategic Dobbaspet, Bengaluru location
 ACRES ────────────────────┤              │
 400-acre integrated       ├──────────────○ CONNECTIVITY
 development               │                  Road + Rail + Air + Ports
                           ├──────────────○ ECOSYSTEM
 INTEGRATED                │                  Warehousing + Dry Port + Logistics + Commercial
 LOGISTICS                 ╰──────────────○ LEGACY
 ECOSYSTEM                                    PATH Group's infrastructure experience
```

- **400** in `display-xxl` (up to 26rem), cols 1–6, paper. The route line runs *into* the top of the "4". The counter goes 0 → 400 once (1.4s, `ease-out-expo`) as the section reaches 40% of the viewport. `ACRES` is a mono label rotated 90° up the right side of the number.
- Under the number, `INTEGRATED / LOGISTICS / ECOSYSTEM` in `display-l` Light steel-300, reading as the "↓" result of the 400.
- From the base of the number, **the route branches into 4 lines** (drawn sequentially with a 150ms stagger) that end at 4 nodes on cols 8–12. Each node has a 48px icon in a 1px square frame, the label in mono, and the PDF line in body.
- **Interaction (hover/focus):** the branch brightens to yellow, other branches dim to 10%, the icon plays its loop, and an `ArrowLink` slides in.
  - LOCATION: the crosshair contracts and locks. → links to §07
  - CONNECTIVITY: the glyph cycles road → rail → air → port (one 2s cycle). → §07
  - ECOSYSTEM: 4 blocks assemble into one. → §03
  - LEGACY: strata lines stack. → §05
- **Mobile:** 400 spans the full width, and the nodes become a vertical "metro line" of 4 stations under it. Tapping a station expands its line of copy.
- Background: navy-950 with the dot field at 4% opacity.

---

### 03 · EXPLORE PATH LOGICITY: interactive master plan (visual highlight #1)

```
03 / EXPLORE PATH LOGICITY
┌───────────────┬───────────────────────────────────────────────┬──────────────┐
│ ZONES         │  A    B    C    D    E    F    G    H    I    J  │ (detail panel│
│               │1 ┌────────────────────────────────────────────┐ │  slides in)  │
│ 01 Warehousing│2 │                                            │ │ ZONE 02      │
│ 02 Rail Term. │3 │       [ MASTER PLAN SVG: zones as paths ]   │ │ RAIL         │
│ 03 Dry Port/  │4 │    ⌖ gate ━━━━━━━━━━━━━━━┓ route to zone    │ │ TERMINAL     │
│    ICD        │5 │                          ┃                 │ │ ~40 ACRES    │
│ 04 Commercial │6 │                      ████████ (active)     │ │ 6 SIDINGS    │
│ 05 Yards      │7 └────────────────────────────────────────────┘ │ [image slot] │
│ 06 Roads      │   N↑   SCHEMATIC · NOT TO SCALE   [◐ PHASE 1]    │ EXPLORE THE  │
│ 07 Green Infra│                                                │ SITE →       │
└───────────────┴───────────────────────────────────────────────┴──────────────┘
```

- **Canvas:** navy-900 with a blueprint survey grid, grid references A–J / 1–7 printed in mono on the edges (a design device, not a geographic claim), a faint contour texture, a north arrow, and the label `SCHEMATIC · NOT TO SCALE` until a scaled vector plan is supplied.
- **Data:** the master plan must be traced from the client's CAD/PDF into an SVG with one `<path>` per zone (`data-zone="rail-terminal"`) plus a separate `roads` layer used for the route animation and a `phase-1` boundary path. *Until it is supplied, the plan renders as ASSET SLOT "MASTER PLAN", an abstract zoned schematic clearly marked ILLUSTRATIVE, never presented as the real layout.*
- **Zone index (left, cols 1–3):** this is the primary control. Seven buttons with mono index, name, and a mode-style swatch, so the map is fully keyboard and screen-reader operable.
- **Hover a zone (desktop):** it fills indigo-700 at 70% with a 1px yellow outline, all other zones dim to 25%, and a floating `CoordTag` follows the zone's centroid (not the cursor) with `ZONE 02 / RAIL TERMINAL`.
- **Click/Enter:**
  1. The zone locks active and its index item turns yellow.
  2. **A route draws from the main gate along the roads layer to the zone** (1.2s).
  3. The detail panel (cols 10–12) wipes in from the right: zone code, name in `display-m`, verified facts only, image slot, `EXPLORE THE SITE →`.
- **Zone content mapping** (facts only; confirm mapping with client):
  | Zone | Panel copy |
  |---|---|
  | Warehousing | ~5.2 Mn sq. ft. of Grade-A warehousing |
  | Rail Terminal | ~40 acres dedicated to a state-of-the-art rail terminal · 6 railway sidings |
  | Dry Port / ICD | Inland Container Depot (ICD) within a single ecosystem · `[ confirm: ~0.78 Mn sq. ft. customs-bonded applies here? ]` |
  | Commercial | ~1.76 Mn sq. ft. of commercial space |
  | Yards | `[ CONTENT TO BE SUPPLIED ]` |
  | Roads | Internal network linking to NH 648 · NH 48 · STRR `[ confirm ]` |
  | Green Infrastructure | Links to Sustainability · `[ CONTENT TO BE SUPPLIED ]` |
- **Phase 1 overlay toggle:** `◐ PHASE 1 · 138 ACRES` hatches the Phase 1 boundary in yellow at 15%. It needs the boundary data, so the toggle is hidden until that is supplied.
- **Scroll behaviour (desktop):** the section pins for about 1 viewport. On first entry, zones light up in sequence 01→07 (a 2.5s "system boot") and then hand control to the user. No auto-cycling after that.
- **CTA:** `EXPLORE THE SITE →` goes to the "Logicity Edge" page (**open question: Site Tour or Logicity Advantage?**).
- **Mobile:** the plan fills the width at 4:5, a horizontal snap row of zone chips is sticky below it, and tapping a chip or zone opens a `BottomSheet` with the detail. Hover states are disabled. Pinch zoom is off; a `⤢` button opens the full-screen plan.

---

### 04 · WATCH THE PROJECT TAKE SHAPE

It should feel **current and alive**: a timelapse viewer plus a live timeline, not a progress bar.

```
04 / PROJECT STATUS                               LAST UPDATED · [CMS DATE]
WATCH THE PROJECT
TAKE SHAPE
┌──────────────────────────────────────┐   │
│                                      │   ●  COMPLETED
│   [ TIMELAPSE VIDEO / DRONE SLOT ]   │   │  [ Milestone — CMS ]
│        (sticky, crossfades by        │   │  [ Milestone — CMS ]
│         active milestone)            │   │
│                                      │   ◉  IN PROGRESS   (pulses)
├──────────────────────────────────────┤   │  [ Milestone — CMS ]
│ ▶  ──●───●────◉──────○──────○──  ⏵   │   │
└──────────────────────────────────────┘   ○  UPCOMING
   scrubber with milestone ticks           │  [ Milestone — CMS ]
```

- **Left (cols 1–7, sticky):** media viewer (ASSET SLOT "CONSTRUCTION PROGRESS"; Constra timelapse or drone footage). Under it, a **scrubber** styled as a route with milestone ticks. Ticks double as buttons and drive both the video time and the timeline.
- **Right (cols 9–12):** a vertical timeline. The spine *is* the route line, and it fills yellow down to the current milestone as you scroll.
  - `COMPLETED` = solid green node · `IN PROGRESS` = yellow node with a slow 2.4s pulse · `UPCOMING` = hollow steel node.
  - Each milestone has a phase label, title, date, and optional thumbnail, **all from CMS**. Placeholders read `[ MILESTONE — TO BE SUPPLIED ]`. No dates or percentages are invented.
- As a milestone reaches the viewport center, the media crossfades to that milestone's image or video segment using a vertical clip-path wipe (700ms).
- A `LAST UPDATED` mono timestamp (CMS) at top-right is the "alive" signal. If it is older than 90 days in CMS, editors get a warning (CMS rule, not UI).
- **Mobile:** the media goes on top (16:9, not sticky), the timeline becomes horizontally swipeable milestone panels with status colors, and the scrubber stays.

---

### 05 · PATH GROUP: the editorial, legacy chapter

Visual shift: **warm paper background, navy type**, larger photography, calmer motion. It should read like a printed annual review, not a futuristic interface.

```
05 / PATH GROUP
from building infrastructure                      ← display-l, Light, steel
TO CONNECTING INDIA'S                             ← display-xl, ExtraBold, navy
SUPPLY CHAINS
┌─────────────────────────────────────────────────────────────────────────────┐
│                [ PATH GROUP — INFRASTRUCTURE PHOTOGRAPHY  21:9 ]             │
│ 30+            18             70+             ~6,100+                        │
│ YEARS          STATES         LOCATIONS       WORKFORCE                     │
│ of infra-      pan-India      across the      ───────────                   │
│ structure exp. presence       country                                       │
└─────────────────────────────────────────────────────────────────────────────┘
"With nearly three decades of experience in building India's       Experience across
 infrastructure, PATH has evolved from developing critical          INFRASTRUCTURE ·
 infrastructure to creating integrated logistics ecosystems         HIGHWAYS · LOGISTICS
 for the future."
 PATH LEGACY ───────●─────── INFRASTRUCTURE ───────●─────── LOGISTICS ───────●─────── PATH LOGICITY ◆
                                                                     KNOW MORE ABOUT PATH →
```

- The headline's weight contrast *is* the evolution: light past ("from building infrastructure") → bold future.
- **Numbers over photography:** a 21:9 full-bleed image (slot) with a navy veil only on the bottom 40%. The four metrics sit in a hairline-divided band at the base and count up once.
- **Brand story:** the PDF quote verbatim in `display-m` Light at 28–36px, cols 1–8.
- **Evolution line:** the route line in navy on paper with 4 stations (no years, since none were supplied). The last station, PATH LOGICITY, is the only node in brand colors, with the pinwheel colours as a 3-segment ring. It draws left→right as you scroll.
- CTA: `KNOW MORE ABOUT PATH →` (text-arrow, navy) goes to `/path-group`.
- Mobile: headline, then image, then a 2×2 metric grid (hairline dividers, not boxes), then the quote, then a vertical evolution line.

---

### 06 · THE LOGICITY ADVANTAGE: ONE HUB. EVERY ROUTE.

The darkest chapter. It moves from storytelling to an *infrastructure intelligence system*.

**6a · Chapter opener (100vh).** On navy-950, about 24 route lines enter from every edge of the viewport and converge on one central hub node as you scroll (scrubbed). The hub is a yellow crosshair. `ONE HUB.` sits above it and `EVERY ROUTE.` below in `display-xl`, the only centered composition on the site. Mobile: 10 lines, drawn by time.

**6b · Project at a glance: specification drawing.**

```
                    ~5.2 MN SQ. FT. ────────┐
                    Grade-A warehousing      │
   ~400 ACRES ─────────┐                     ▼
   integrated logistics │       ┌────────────────────────┐        ~1.76 MN SQ. FT.
   infrastructure       └──────▶│  AXONOMETRIC MASTER     │◀────── commercial space
                                │  PLAN (same SVG, 30°    │
   ~40 ACRES ──────────────────▶│  iso transform)         │◀────── ~0.78 MN SQ. FT.
   rail terminal                │                         │        customs-bonded
                                └────────────────────────┘
   6 RAILWAY SIDINGS ─────────────────▲          ▲──────── PHASE 1 | 138 ACRES
   seamless multimodal movement                            first step towards a larger ecosystem
```

- The same master plan SVG from §03, rendered in axonometric (CSS 3D or a pre-transformed SVG). The seven metrics sit around it as **architectural leader-line callouts**: a dot on the zone, a 1px elbow leader, then the `Metric`.
- On scroll, the callouts draw one by one (leader first, then the number counts) and the linked zone lights up. Hover or focus a metric to highlight its zone, and the reverse.
- Callout → zone links: warehousing → Warehousing · commercial → Commercial · rail terminal + sidings → Rail Terminal · customs-bonded → ICD *(confirm)* · ~400 acres → full site outline · Phase 1 → phase boundary.
- **Mobile:** the axonometric is sticky at the top (45vh) and the metrics scroll beneath as a list. The active metric lights its zone.
- `EXPLORE THE ADVANTAGE →` goes to `/logicity-advantage`.

---

### 07 · CONNECTIVITY MAP + PM GATI SHAKTI (signature interaction)

This replaces the static map screenshot the audit criticised.

```
07 / SOLUTIONS · CONNECTIVITY
┌────────────────────────────────────────────────────┬─────────────────────────┐
│ [SITE] [REGION] [INDIA]        ← camera levels      │ ROUTE PLANNER           │
│                                                    │ MODE  [ALL][ROAD][RAIL] │
│             · · · · · · · · · · · ·               │       [AIR][PORT]       │
│      NH 48 ━━━━━━━━━━━━━━━━━━┓                    │ ─────────────────────── │
│                      ◉ PATH LOGICITY              │ ━ NH 648          ROAD  │
│      STRR ━━━━━━━━━━━━━━┛    ┃ NH 648             │ ━ NH 48           ROAD  │
│                               ·  ·  ·  ·  ✈ KIA   │ ━ STRR            ROAD  │
│                                                    │ ┿ 6 Railway Sidings RAIL│
│  MODE  ━ ROAD  ┿ RAIL  · AIR  ── PORT              │ · Kempegowda Intl  AIR ▸│
│  SCHEMATIC · NOT TO SCALE                          │ ── Mangalore Port  PORT │
│                                                    │ ── Chennai Port    PORT │
│                                                    │ ─────────────────────── │
│                                                    │ KEMPEGOWDA INT'L AIRPORT│
│                                                    │ MODE      AIR           │
│                                                    │ DISTANCE  [ COMING SOON]│
└────────────────────────────────────────────────────┴─────────────────────────┘
```

- **Map (cols 1–8):** a stylised, art-directed **SVG schematic** in the language of a transit diagram: dark indigo land, survey grid, and the site as a pulsing yellow origin marker. It is honest about being schematic (`SCHEMATIC · NOT TO SCALE`). It is lighter and more on-brand than a tile map, with no API cost. *Phase 2 option: swap the REGION level to MapLibre GL with a custom dark style once verified routes and distances exist.*
- **Three camera levels** (viewBox tween, 900ms `ease-in-out`):
  - `SITE`: rail terminal + 6 sidings + gate access.
  - `REGION`: NH 648, NH 48, STRR, Kempegowda International Airport.
  - `INDIA`: Mangalore and Chennai ports, with the network expanding outward. This is where *the route line expands into national infrastructure networks* and it hands off into the Gati Shakti band below.
- **Route planner (cols 9–12):** styled like a departure board in mono. Mode filter tabs, then destinations as a radio group (arrow keys move, Enter selects), then a detail readout.
- **On select:**
  1. The camera moves to the right level.
  2. The route draws from the origin to the destination in its mode style (yellow head).
  3. The other routes dim to 15% and the matching mode in the legend highlights.
  4. The readout fills in: name, mode, **distance (only if verified in CMS, else `DISTANCE — COMING SOON`)**, and a short note.
  - Road items are *corridors*, so selecting one highlights the full corridor rather than drawing to a point.
- **Data model** (per item): `{ id, name, mode: 'road'|'rail'|'air'|'port', kind: 'corridor'|'destination'|'onsite', level: 'site'|'region'|'india', pathId, distanceKm: number|null, durationText: string|null, note: string|null }`.
- **India level and map compliance:** do not draw a national boundary unless it comes from a Survey-of-India-compliant source. The default renders India as an abstract **dot-matrix field with a node network** (Bengaluru hub → Mangalore, Chennai), avoiding boundary risk while still reading as "India".
- **Mobile:** the map is on top at 60vh, mode tabs are sticky, destinations are horizontal snap chips, and the readout is a compact bar under the map. Camera levels switch automatically on selection.

**7b · PM Gati Shakti band (homepage teaser):**
```
CONNECTING INDIA'S LOGISTICS FUTURE
Driving India's vision for integrated and efficient logistics.

 ROAD  +  RAIL  +  WAREHOUSING  +  COMMERCIAL  +  ICD   =   ONE ECOSYSTEM
  ━        ┿          ▣              ▤             ⧈            ◉
```
- A typographic equation in `display-m`. Each term is joined to the next by a route segment, and the `=` resolves into the hub crosshair. Below are 3 of the 6 growth bullets from the PDF in a hairline-ruled row. `PM GATI SHAKTI →` goes to `/logicity-advantage#pm-gati-shakti`.
- **No quantitative impact figures** (none were supplied).

---

### 08 · SUSTAINABILITY + BUSINESS VALUE: "MOVING BUSINESS FORWARD. RESPONSIBLY."

The rhythm changes: **paper background, green accent, generous air.** It should read as infrastructure + efficiency + sustainability, not "eco leaf" imagery.

```
08 / SUSTAINABILITY
MOVING BUSINESS FORWARD.
RESPONSIBLY.
                        ◯ SOLAR ENERGY
              ╭───────────────────────╮
  RESOURCE    │                       │   RAINWATER
  EFFICIENCY ◯│       IGBC            │◯  HARVESTING
              │     PLATINUM          │
              │  PRE-CERTIFICATION    │
  EV INFRA-  ◯│                       │◯  WASTE
  STRUCTURE   ╰───────────────────────╯   MANAGEMENT
        (the route line closes into a ring: the ecosystem)

 MORE EFFICIENT INFRASTRUCTURE  ───▶  SMARTER LOGISTICS  ───▶  MORE SUSTAINABLE GROWTH
```

- **IGBC Platinum Pre-Certification gets the most visual weight in this section.** It is a typographic lockup inside a **ring formed by the route line closing on itself** (the brief's "route line becomes a circular ecosystem"). The ring draws 0→360° on entry in green-500 with a yellow head that comes to rest at 12 o'clock. `PLATINUM` is set in `display-xl`.
  - Do not imitate the IGBC logo or badge. Use the official mark only if the client supplies it with usage rights (slot provided beside the lockup).
- **Five initiatives** sit as nodes on the ring, each with an icon, label, one line `[ CONTENT TO BE SUPPLIED ]`, and an optional `Metric` that **renders only if a verified figure exists in CMS**. Hover makes the node's icon loop (sun rays extend, a raindrop fills a tank, a waste loop circulates, an EV plug connects, an efficiency gauge settles).
- **Story strip:** the 3-step chain on a horizontal route with green nodes. It reveals step by step on scroll.
- Imagery: ASSET SLOT "SUSTAINABILITY · SITE IMAGERY" (solar rooftops, green spaces) on the right at desktop, behind the ring at 8% on mobile.

**8b · INFRASTRUCTURE THAT DELIVERS BUSINESS VALUE** (background transitions paper → navy-950 with a clip-path wipe as you enter)

```
 INFRASTRUCTURE
 THAT DELIVERS
 BUSINESS VALUE
 ─────────────┬──────────────┬──────────────┬──────────────┬──────────────
 [⟲ shrink]   │ [⤓ step]     │ [⇉ converge] │ [⊕ collapse] │ [⊞ expand]
 FASTER TAT   │ LOWER        │ FASTER       │ GREATER      │ SCALABILITY
              │ LOGISTICS    │ CONNECTIVITY │ OPERATIONAL  │
              │ COST         │              │ EFFICIENCY   │
 Integrated…  │ Multimodal…  │ Strategic…   │ Multiple…    │ Infrastructure…
```
- A five-column **specification row** with hairline separators (no boxes). Each benefit has a 64px **animated diagram-icon** that shows the idea:
  - TAT: a loop path that shortens.
  - Cost: a stepped line descending.
  - Connectivity: scattered lines converging.
  - Efficiency: four nodes collapsing into one.
  - Scalability: a grid adding modules.
- Icons play once on entry and loop on hover. The PDF copy is used verbatim.
- Mobile: a horizontal swipe row (80vw panels) with a progress hairline.
- `EXPLORE SUSTAINABILITY →` goes to `/sustainability`.

---

### 09 · LOGICITY360: Site Tour preview

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ 09 / INSIDE LOGICITY                                           ⤢ FULL SCREEN │
│ LOGICITY360                                                                  │
│            [ 3D SITE TOUR SLOT: perspective master plan, slow orbit ]        │
│                 ◉ Warehousing        ◉ Rail          ◉ ICD                   │
│                                                                              │
│ [EXPLORE] [WAREHOUSING] [RAIL] [ICD] [COMMERCIAL] [ROADS] [GREEN AREAS]      │
│                                              [ ENTER THE 3D SITE TOUR → ]    │
└──────────────────────────────────────────────────────────────────────────────┘
```
- A full-bleed ink background. Until the 3D model exists, the preview is the master plan SVG in perspective (CSS `rotateX(55deg)`) on a very slow 40s orbit (paused under reduced motion and off-screen), with pulsing markers. It is labelled ASSET SLOT "3D SITE TOUR".
- The overlay chips are the brief's 7 nav items. In the preview they move the camera to that zone; on `/site-tour` they drive the real 3D model.
- CTA `ENTER THE 3D SITE TOUR →` goes to `/site-tour`.

---

### 10 · PATH LOGICITY IN THE NEWS

Paper background, editorial.

```
10 / NEWSROOM
PATH LOGICITY
IN THE NEWS
[ NEWS ]  MEDIA COVERAGE   PROJECT UPDATES   EVENTS                     VIEW ALL →
┌────────────────────────────────────┐  SOURCE · DATE
│                                    │  Headline in display-m, two lines max  →
│  [ FEATURED IMAGE — CMS ]          │  ───────────────────────────────────────
│                                    │  SOURCE · DATE
└────────────────────────────────────┘  Headline …                            →
 SOURCE · DATE                           ───────────────────────────────────────
 FEATURED HEADLINE — CMS                 SOURCE · DATE
 READ MORE →                             Headline …                            →
```
- ARIA tabs. One **featured item** (cols 1–7, image 16:10) plus up to 3 **typographic rows** (cols 8–12). On desktop, hovering a row reveals its thumbnail floating beside the cursor, offset 24px and moving with a lerp. Row arrows shift 6px.
- **Graceful sparsity:** 0 items shows a designed state, "Updates are on their way", with a link to Project Status (§04). 1 item shows the featured story spanning full width. 2 items shows featured + 1 row + a "Follow project updates" block. Empty cards never appear.
- All content comes from CMS. Placeholders read `[ SOURCE ]  [ DATE ]  [ HEADLINE — TO BE PUBLISHED ]` and the image is an AssetSlot. **No fake articles.**

---

### 11 · FINAL CTA: LET'S BUILD YOUR LOGISTICS ADVANTAGE

The route's destination.

```
┌─────────────────────────────────────┬────────────────────────────────────────┐
│ 11 / ENQUIRE                        │ I WANT TO   (●) LEASE SPACE  ( ) PLAN A │
│ LET'S BUILD                         │                              SITE VISIT│
│ YOUR                                │ NAME ______________  COMPANY __________│
│ LOGISTICS                           │ EMAIL _____________  PHONE +91 ________│
│ ADVANTAGE                           │ INDUSTRY                               │
│                                     │ [FMCG][E-commerce][Retail][Automotive] │
│ Tell us about your business         │ [Pharma][Logistics][Others]            │
│ requirements. Let's explore the     │ REQUIREMENT ___________________________│
│ right solution at Path Logicity.    │ ______________________________________ │
│                                     │ ☐ I agree to be contacted… (consent)   │
│ ☎ CALL LEASING TEAM                 │                                        │
│ ◍ WHATSAPP                          │ ━━━━━━━━━━━━━━━━━━━━━▶[ SUBMIT LEASE   │
│ ⤓ DOWNLOAD BROCHURE                 │  route line arrives     ENQUIRY →    ] │
│ in  ▶  ◎  (social)                  │                                        │
└─────────────────────────────────────┴────────────────────────────────────────┘
```
- **Headline** `display-xl`, hand-broken over 4 lines, with `LOGISTICS` in yellow. That is the only yellow headline word on the whole site.
- **Intent toggle:** a segmented control `LEASE SPACE | PLAN A SITE VISIT`. It switches the submit label between **SUBMIT LEASE ENQUIRY →** and **PLAN A SITE VISIT →** and adds a "Preferred visit date" field for visits. This gives both brief CTAs in one form instead of two competing submit buttons. Elsewhere on the site, `PLAN A SITE VISIT →` links preselect the toggle (`#enquire?intent=visit`).
- **Fields:** architectural underline inputs (1px `line-dark` → yellow on focus), mono floating labels, 56px touch targets. **Industry** is a radio chip group with the 7 options, faster than a dropdown. Requirement is a textarea with an auto-grow limit of 6 lines. Phone defaults to +91.
- **Consent:** a required checkbox plus a privacy notice link (India DPDP Act 2023). The wording is for the client's legal team to supply.
- **Validation:** inline on blur, with errors in text plus an icon, tied via `aria-describedby`, and focus moves to the first error on submit.
- **Submit moment:** the button is the end of the route. On success the line completes into the button, which becomes a ✓ crosshair, and the panel swaps to "ENQUIRY RECEIVED" + `[ next-steps copy — client ]` + `[ reference no. if CRM provides ]`.
- **Quick actions** (left column): Call Leasing Team (`tel:`), WhatsApp (`wa.me`), Download Brochure (PDF), and social icons. All numbers and links come from CMS (not supplied, so slots).
- Endpoint: **to be decided** (CRM / email service). Rate limiting plus a honeypot field, and no CAPTCHA wall unless spam appears.

---

### 12 · FOOTER: the conclusion of the story

```
─────────────────────────────────────────────────────────────────────────────────
 NAVIGATE           LOGICITY ADVANTAGE    SUSTAINABILITY     LEASING CONTACT
 Home               Project at a Glance   ESG                [ name / phone — CMS ]
 Path Group         Amenities             Business Value     [ email — CMS ]
 Site Tour          Solutions                                 [ ENQUIRE NOW → ]
 News · Blogs       PM Gati Shakti        Contact             in ▶ ◎ ✕
─────────────────────────────────────────────────────────────────────────────────
 DOBBASPET · BENGALURU                         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◉
 P A T H   L O G I C I T Y   ← wordmark spanning the full width, cropped at the baseline
 © [YEAR] PATH · Privacy · Terms · Cookies                      Back to top ↑
```
- Navy-950. Four link columns, then the leasing contact plus `ENQUIRE NOW →`.
- A full-width **wordmark** built from the official logo file (or `display-xxl` type if a wordmark file isn't supplied) sits at the bottom and is cropped by the page edge. That oversized sign-off gives the page a sense of scale.
- The route line runs one last time along the top of the wordmark and ends in a still yellow node. The journey ends here.
- `Back to top ↑` scrolls smoothly (an instant jump under reduced motion).

---

## 6. Inner page templates (after homepage sign-off)

| Page | Template | Key sections |
|---|---|---|
| Path Group | **Chapter Hero** (70vh, index + title + image slot + route entry) on paper | Highlights (metrics over photography, extended) · About PATH (story + evolution line) · CTA |
| Logicity Advantage | Chapter Hero on navy | One Hub opener · Project at a Glance (full spec drawing) · **Amenities** · Solutions (full connectivity map) · PM Gati Shakti (full) |
| — Amenities | **Pinned horizontal gallery** | 7 panels, each a 4:5 image (55vw wide) with the amenity name in `display-l` overlapping the image edge, the PDF description, an index `03/07`, and a 6px image drift on hover. Mobile: native swipe with snap. Images are ASSET SLOT "AMENITIES · [name]" (actual site photos requested). |
| — PM Gati Shakti | Long-form | Dot-matrix India network (Bengaluru hub, ports) · 3 PDF paragraphs as large-type editorial · 6 growth bullets as a numbered route list · "The Impact" statement full-bleed |
| Sustainability | Paper chapter hero | IGBC lockup (full) · 5 initiatives as alternating diagram + image (slots) · story strip · Business Value (full) |
| Site Tour | **Full-screen app shell** | 100dvh viewport for the 3D embed (iframe/WebGL), a minimal top bar, a bottom zone chip bar (7 items), elegant tooltips anchored to markers, a ⤢ full-screen control, a loading state with poster plus a thin route progress line, and a "View as list" accessible alternative |
| News | Listing | Tabs (4), featured + list, filter by year, pagination. Detail: source, date, headline, hero image, body, "Original article ↗" |
| Blogs | Editorial listing | Featured story full-bleed (image 21:9 + headline `display-l`), then an asymmetric grid (7-col + two stacked 5-col), category label, date, reading time, category filter. Article: 680px measure, pull quotes, a reading-progress route line under the nav. No invented posts. |

All pages end with §11 Final CTA + §12 Footer.

---

## 7. Responsive strategy

| Breakpoint | Width | Notes |
|---|---|---|
| `sm` | <640 | 4-col grid, 16px gutters, display type clamps hold the drama |
| `md` | 640–1023 | 8-col; maps use the stacked layout |
| `lg` | 1024–1439 | 12-col; pinned scenes on |
| `xl` | ≥1440 | max content 1600, type at its upper clamp |

**Mobile rules (not just stacking):**
- Pinned scroll scenes become time-based reveals (except the Amenities horizontal scroll, which becomes a native swipe).
- Maps become a **map + chip rail + bottom sheet**, and hover becomes tap.
- The hero uses a separate 4:5 encode and a 5-line headline at `clamp(3rem, …)`. It must still fill the first viewport.
- The persistent bottom action bar (ENQUIRE / Call / WhatsApp) keeps conversion in thumb reach.
- Horizontal swipe rows (business value, status milestones, news tabs) always show a peek of the next item plus a progress hairline.
- All tap targets are ≥ 48px, and the primary CTA is 52px tall and full width.

---

## 8. Accessibility (non-negotiable)

- Semantic landmarks, one `h1` (hero headline), sequential headings, and a skip link.
- **Each interactive map has a real control list** (zone index, route planner) as the primary interface. The SVG is an enhancement whose zones are also focusable with `aria-label` and expose `aria-pressed` / `aria-selected`.
- Tabs follow the ARIA tabs pattern. Dropdowns use disclosure buttons. Bottom sheets trap focus and close on `Esc`.
- Focus ring: a 2px yellow outline with 2px offset on dark and a 2px navy outline on light. Never removed.
- Contrast: body text ≥ 4.5:1 and large display ≥ 3:1, verified per token pair (yellow is never text on paper).
- Video: a pause control, no audio, captions or descriptions if any future video has narration, and a meaningful poster `alt`.
- **`prefers-reduced-motion`:** routes render fully drawn, counters show final values, no pinning or parallax, videos show the poster with a play button, the site-tour orbit stops, and Lenis smooth scroll is disabled.
- Counters render the final number in the DOM, with the animation as visual-only, so screen readers announce "~5.2 Mn sq. ft." and not "0".
- Forms: visible labels, required markers in text, error summary, and the success state announced via `role="status"`.

---

## 9. Performance

| Budget | Target |
|---|---|
| LCP (hero poster) | < 2.0s on 4G mid-tier mobile |
| CLS | < 0.05 |
| INP | < 200ms |
| Initial JS | < 180 KB gzip |
| Hero video | 1080p ≤ 6 MB, 720p mobile ≤ 3 MB, AV1/WebM + H.264 MP4 fallback |

- The hero **poster (AVIF, preloaded) is the LCP**. The video starts after the poster paints and after `load`, and is skipped entirely on `Save-Data`, slow connections, or reduced motion.
- `next/image` with AVIF/WebP, responsive `sizes`, and blur-up placeholders. Everything below the fold is lazy.
- Heavy islands (master plan, connectivity map, site tour, horizontal gallery) are **dynamically imported** and mounted on approach (IntersectionObserver with a 1-viewport rootMargin).
- Animate only `transform`, `opacity`, `clip-path` and `stroke-dashoffset`. No animated blur or filter. One shared ScrollTrigger instance per scene, killed on unmount.
- Fonts: `next/font` self-hosting, Latin subset, variable Manrope + Inter, and mono loaded only where used. `font-display: swap`, with size-adjusted fallbacks to prevent CLS.
- Static generation for all pages, with ISR or on-demand revalidation when the CMS publishes.

---

## 10. Technical architecture

**Stack:** Next.js (App Router) · React · TypeScript · Tailwind CSS v4 (CSS-first `@theme` tokens) · GSAP + ScrollTrigger (scroll scenes, route draws) · Lenis (smooth scroll) · plain CSS transitions for micro-interactions. No second animation library.

```
/app
  layout.tsx                 fonts, Nav, JourneyRail, Footer, EnquireBlock
  page.tsx                   Home (server component; composes sections)
  path-group/ logicity-advantage/ sustainability/ site-tour/ news/[slug]/ blogs/[slug]/
/components
  /navigation   Nav, NavDropdown, MobileMenu, MobileActionBar, JourneyRail
  /hero         Hero, HeroVideo, LocationAnchor, HeroScrollScene
  /stats        ScaleIndex, ScaleNode
  /master-plan  MasterPlan, ZoneIndex, ZoneDetail, PlanSvg, PhaseOverlay
  /project-status ProjectStatus, MediaViewer, MilestoneTimeline, Scrubber
  /path-group   PathGroup, MetricBand, EvolutionLine
  /advantage    HubOpener, SpecDrawing, Callout, GatiShaktiBand
  /connectivity-map ConnectivityMap, RoutePlanner, MapCanvas, ModeLegend
  /sustainability IgbcRing, InitiativeNode, StoryStrip, BusinessValueRow
  /amenities    AmenitiesGallery, AmenityPanel
  /site-tour    SiteTourPreview, SiteTourViewport, ZoneChips
  /news         NewsPreview, NewsTabs, NewsRow, FeaturedStory
  /blogs        BlogGrid, ArticleLayout
  /contact      EnquireBlock, EnquiryForm, IntentToggle, IndustryChips, QuickActions
  /footer       Footer, Wordmark
  /ui           Route, Metric, AssetSlot, ContentSlot, CoordTag, SectionHeader,
                Button, ArrowLink, Chip, Tabs, Marker, RevealText, Counter,
                HorizontalScroller, MediaFrame, BottomSheet, Icon
/content        typed seed content (homepage.ts, zones.ts, destinations.ts, …)
/lib
  content/      getHomepage(), getZones(), getNews()…  ← single swap point for CMS
  schemas/      zod schemas = future CMS models
  motion/       gsap setup, useRouteDraw, useCounter, useReducedMotion, lenis provider
/styles         tokens.css (@theme), globals.css
/public/assets  posters, svg (master plan layers), placeholders
```

**CMS readiness.** Components only take typed props, and all content flows through `/lib/content/*`. Today that reads `/content/*.ts`; later it reads the CMS (Sanity, Payload or Strapi, all good fits; choose with the client). The models below are defined now as zod schemas:

`SiteSettings` (contacts, WhatsApp, brochure, socials, coordinates?) · `HeroMedia` · `Metric` · `Zone` (id, name, description, facts[], image, svgPathId) · `Milestone` (phase, title, date, status, media) · `Destination` (§07 model) · `Amenity` · `Initiative` (+ optional verified metric) · `Benefit` · `NewsItem` (type: news|media|update|event, source, date, headline, image, url/body) · `BlogPost` (category, date, readingTime, hero, body) · `Enquiry` (form payload + intent).

**Fact-safety in code:** every optional fact (`distanceKm`, `coordinates`, `initiative.metric`, `milestone.date`) is nullable. The UI renders a `ContentSlot`, or hides the element, when the value is null, so nothing can show a made-up value by accident.

---

## 11. Build sequence

| Step | Scope | Exit criteria |
|---|---|---|
| 0 · Foundations | Tokens, fonts, grid, `Route`, `Metric`, `AssetSlot`, `Button`, `SectionHeader`, motion utilities, Lenis, reduced-motion hook | Token page renders; Route draws by scroll and by time |
| 1 · First viewport | Nav (all states, mobile menu) + Hero + scroll scene | **The first viewport alone sells SCALE.** Review before moving on |
| 2 · Explore | Scale Index · Master Plan | Keyboard-operable; mobile bottom sheet works |
| 3 · Proof | Project Status · PATH Group | CMS-shaped milestone data; sparse state looks good |
| 4 · Understand | Advantage opener + spec drawing · Connectivity map · Gati Shakti band | Route handoffs continuous across 05→06→07 |
| 5 · Value → Enquire | Sustainability + Business Value · Site Tour preview · News · Final CTA form · Footer | Form validates; success state; consent |
| 6 · QA pass | Responsive at 360/390/768/1024/1280/1440/1920 · a11y (axe + keyboard + VoiceOver/TalkBack) · Lighthouse · reduced motion · `?annotations=off` client deck screenshots | Budgets in §9 met |
| 7 · Inner pages | Templates in §6 | — |

---

## 12. Open questions and assets needed from the client

**Decisions**
1. "EXPLORE THE SITE → (logicity edge page)": which page is *Logicity Edge*: Site Tour (Logicity360) or Logicity Advantage?
2. Does the ~0.78 Mn sq. ft. customs-bonded infrastructure belong to the Dry Port/ICD zone?
3. "India's Largest" and "the largest MMLP zone" are client claims. Should they carry a source footnote?
4. Form destination: which CRM or email service? Who receives site-visit requests?
5. CMS preference, and who will update Project Status and News?
6. 3D site tour: vendor and format (Matterport, custom three.js, Unreal Pixel Streaming, pre-rendered)?
7. "KNOW MORE ABOUT PATH": internal `/path-group` page or the PATH Group corporate site?

**Assets**
- Official logo (SVG; colour + mono), brand colour codes, any brand guidelines
- Hero site/drone video (16:9 and 4:5) + poster frame
- Master plan as vector/CAD with zone boundaries, internal roads, gate, Phase 1 boundary, north point and scale
- **Verified** site coordinates and **verified** distances/times to each destination
- Project milestones with status, dates, and Constra imagery/timelapse
- PATH Group infrastructure photography
- Amenity photographs (7) and sustainability imagery
- IGBC certificate/mark with usage permission; any verified ESG metrics
- Leasing contact name, phone, email, WhatsApp number, brochure PDF, social URLs
- Privacy policy / consent wording
- Initial news, media coverage, project updates, events and blog content (or confirmation that the site launches with designed empty states)

---

## 13. Acceptance checklist (before showing the client)

- [ ] Could this pass for a ₹10,000 template? → No.
- [ ] Could it pass for any generic logistics company? → No.
- [ ] Does the first viewport immediately say **SCALE**, and say **DOBBASPET, BENGALURU**?
- [ ] Is the route line visibly continuous from hero to the Submit button?
- [ ] Do the master plan and connectivity map make you *want* to click?
- [ ] Is every number on the page in the §1 fact register?
- [ ] Is every missing asset or fact a labelled slot, not stock imagery or invented copy?
- [ ] Is yellow used only for action, and green only for sustainability and completed states?
- [ ] Is the site fully usable by keyboard, with reduced motion, and on a 360px phone?
- [ ] Are LCP, CLS and JS budgets met?

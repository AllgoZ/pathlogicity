# Client change round 2 — plan

> Received 2026-10-15. Source data re-crawled from https://www.pathlogicity.com/ the same day.
> Keeps the structure, the route-line idea and the motion system. Changes the theme, the type
> and the content listed below.

## Client feedback

| # | Feedback | What we change |
|---|---|---|
| 1 | Fonts need changing; sizes are too big or too small | Switch to **Open Sans**, the font on the client's own site. Rebuild the type scale: smaller display sizes, larger labels and body text, and no uppercase display headings |
| 2 | Colour scheme is too dark; keep it white/light with brand colours | Change every section to a **white / light-grey** base with the brand pinwheel colours as accents. The footer stays brand indigo `#201f85`, as on the client's site |
| 3 | Constra collaterals haven't been used | §04 Project Status becomes a **Constra site-progress viewer**, with Constra labels, video and image support, and real milestones from the client's site. **We have no Constra files yet, so the client needs to send them** (see below) |
| 4 | IGBC logo needs to be added | Add the official IGBC mark (from igbc.in) to the §08 sustainability ring, the trust strip and the footer |
| 5 | All the other logos from the main website need to be added | Add an "In association with" strip with **NHLML**, **RVNL** and **KIADB** (taken from pathlogicity.com) plus IGBC. It appears in §07.1 Gati Shakti and in the footer |
| 6 | Maps need to be integrated to show the location | §07 Connectivity is rebuilt on the **client's own location map** (`345.webp`), with animated route overlays, destination pins and zoom levels for the map and the site |

## 1 · Typography

- `next/font/google` → `Open_Sans` (variable font, 300–800). Remove Manrope, Inter and JetBrains Mono.
- Labels (`t-label`, `t-micro`) change from 11px mono to **12–13px Open Sans semibold**.
- Display sizes are capped:

| Utility | Before (max) | After (max) |
|---|---|---|
| `t-hero` | 11.5rem, uppercase | 5.25rem, sentence case |
| `t-xxl` | 26rem | 12rem |
| `t-xl` | 8rem, uppercase | 4.25rem |
| `t-l` | 5rem, uppercase | 3.25rem |
| `t-m` | 2.75rem | 2rem |
| `t-body-l` | 1.31rem | 1.19rem, with leading 1.65 |
| `t-micro` | 0.69rem | 0.75rem |

## 2 · Light theme and colour roles

Tokens (`app/globals.css`):

- Page backgrounds use a soft cool "mist": `canvas` `#f5f7fa` (base) and `canvas-2` `#ecf0f5` (alternate). Pure white `paper` `#ffffff` is reserved for cards, panels and logo tiles so they stand out from the page (follow-up, 2026-10-15: white was too stark).
- `ink` `#1a1c46` is used for headings. `steel-700` `#4b5168` is body text. `steel-500` `#5f667c` is muted text (≥4.5:1 on `canvas-2`).
- Brand accents stay the same: gold `#e7ac00`, green `#449e35`, blue `#0066b1`, indigo `#201f85`, orange `#ff6600`.

Colour roles on light surfaces, chosen to meet WCAG contrast:

- **Gold** is for action fills (CTAs, selected chips, the route comet). It is never used as text on white, because the contrast is only about 2:1.
- **Blue `#0066b1`** is for small accent text: section indices, kickers and links (5.9:1).
- **Green** is for sustainability and completed states.
- Large numerals cycle through the pinwheel colours (green → blue → indigo → orange-600), as on the client's site.

Section rhythm: white and light-grey sections alternate, and the footer is brand indigo. The hero keeps the client's key visual, with a **white scrim** behind the dark headline instead of a navy one.

## 3 · Logos and assets

New files go in `public/client/`:

- `partners/nhlml.webp`, `partners/rvnl.webp`, `partners/kiadb.webp` from pathlogicity.com
- `partners/igbc.png` from the official IGBC mark on igbc.in
- `logo-lockup-white.webp`, the client's white footer lockup

They are rendered by a new `PartnerLogos` UI component, with the copy kept in `content/home.ts` (`partners`).

## 4 · Connectivity map (§07)

- The base layer is the client map `/client/345.webp` (1320×1232, legend included).
- The SVG overlay uses the image's pixel coordinates. Each route below draws with the existing comet animation.

| Destination | Route on the map |
|---|---|
| NH 648 | North-east arc of the ring, from the site to Devanahalli |
| STRR | South-west arc, from Dobbaspet down past Magadi |
| NH 48 | Site → Nelamangala → Bengaluru |
| Dodbele Station | Along the rail line, 3.5 km |
| KIA | Along NH 648, then a spur to the airport, 55 km |
| Mangalore Port | West edge arrow, ~339 km |
| Chennai Port | Via Old Madras Road to the east edge arrow, ~376 km |
| 6 sidings | Site zoom with a pulse on the site parcel |

- The route planner, mode filter and distances stay. Camera levels become **Map** and **Site** (zoom), driven by GSAP.

## 5 · Content additions from pathlogicity.com

- **Milestones:** in-principle master plan approval (completed), Phase 1 development (in progress), and Phase 1 operational in Q4 2026 (upcoming).
- **Contact:** email `mmlp.blr@pathltd.com`, phone `9899880388`, and the Instagram and LinkedIn links.
- **Gati Shakti:** 35 MMLPs and ₹46,000 Cr of budgeted investment.

## Needs from the client

1. **Constra collaterals:** timelapse MP4s and/or progress photos, with a date for each milestone. Drop them in `public/constra/`.
2. Confirm **IGBC Platinum Pre-Certification**. Their site lists GRIHA.
3. A high-resolution transparent wordmark. The current text PNG is 109×42 px.

# Client round 7 — audit, plan and follow-up fixes

> Source: [`prompts/clientv2.md`](../prompts/clientv2.md). Audited 2026-11-06 against the code
> (not against `PLAN-CLIENT-ROUND-7.md`'s own claims), in a browser on the dev server and with a production build.
> The first pass is in [`PLAN-CLIENT-ROUND-7.md`](./PLAN-CLIENT-ROUND-7.md); this file records what the audit confirmed, what it fixed, and what is still blocked.

## 1. Verdict per client point

| # | Client point | Verified | Result |
|---|---|---|---|
| 1 | Logo in the browser tab | `<link rel=icon>` = `icon.png` 512×512, `apple-touch-icon` = `apple-icon.png` 180×180; both show the pinwheel mark; the old `icon.svg` is gone; no `metadata.icons` override | **Fixed** |
| 2 | Path Group tab last, before Enquire | Nav renders Home · Logicity Advantage · Sustainability · Site Tour · News · Blogs · Path Group; mobile menu and footer read the same list | **Fixed** |
| 3 | Dropdown grey a little darker | Item notes `steel-500` → `steel-700`, hover `porcelain` → `stone` | **Fixed on our reading**: the client did not say which grey (Q1) |
| 4 | "Path Group legacy" → "Path Group" | Kicker in `PathVerticals` reads "PATH Group"; no "PATH Legacy" string is rendered anywhere (only code comments) | **Fixed** |
| 5 | Renders before the legacy section | `app/page.tsx` order: Project status → Renders → verticals | **Fixed** |
| 6 | "Path Logicity in renders" | Headline "Path Logicity, *in renders.*" | **Fixed** |
| 7 | Road Engineering, Highway Construction photos changed | New crops from the client's two banners; alt text updated; the banner captions, dashed band and PATH arrow are not in the crops | **Fixed** |
| 7b | **Majhi Mumbai photo changed** | Still the old tennis-league logo graphic. **No photo was sent.** pathltd.com has only that logo, a 250×100 logo and a poster with baked-in text | **Blocked: needs the client** |
| 8 | CSR activities in the news tab | "CSR activities" tab exists (homepage preview and `/news`); it shows the designed empty state; nothing invented | **Structure done; content blocked** |
| 9 | Hero cursor movement | Window-level pointer tracking (lens no longer dropped over the nav, no stale re-entry). Checked in Chromium: no console errors | **Fixed on our reading**: the report was general (Q3) |
| 10 | 400-acre details only on hover | Previews auto-play when the list scrolls into view (≈2.8 s each), stop on hover or focus; verified cycling 1→4→1; the cue fades once the visitor hovers. **Gap found in the audit:** it was off on touch laptops and iPad landscape, and the cue said "Hover" on touch | **Fixed, and gap closed** (§2) |
| 11 | Two images "for blogs / media" | They are the same two photos as point 7 (the client's wording repeats them), so they sit on the vertical cards. Blogs and Media coverage hold real articles only | **Done on our reading** (Q2) |
| 12 | All images HD | See §3 | **Partly blocked** by source files |
| 13 | 5.2 million sq ft total warehousing area | Glance figure "5.2 Mn sq. ft. · Total warehousing area" (no "~"), the Warehousing zone fact and the renders caption; no other "5.2" wording remains | **Fixed** |
| 14 | Front page image to be worked on | Hero is Warehouse 17 at 1280×704 under the porcelain wash. On a 1920 screen it is visibly soft and pale | **Blocked: needs the client** (Q4) |
| 15 | Authorities: NHLML + Bengaluru MMLP Private Limited | Both listed; RVNL and KIADB gone from code and content; IGBC mark kept. **Gap found:** with three tiles the marquee cut tiles off mid-scroll | **Fixed, and gap closed** (§2) |

## 2. Fixed in this pass

1. **Authorities strip is a still row, not a marquee** (`components/ui/PartnerLogos.tsx`). The loop only runs for lists longer than four. The Gati Shakti band and the footer now show NHLML, Bengaluru MMLP and IGBC side by side, all legible, with an `aria-label`. Before, a three-tile loop slid tiles half out of view and could hide the Bengaluru MMLP name.
2. **400-acre previews and cue work on touch** (`components/stats/ScaleIndex.tsx`). Autoplay no longer requires a hover-capable pointer, so a touch laptop or iPad in landscape also sees the details. The "Hover over a point to preview it" cue now shows only on hover devices.

Also verified for the first time: `npx tsc --noEmit` clean and **`npm run build` passes** (12 static pages, `icon.png` and `apple-icon.png` emitted as routes).

## 3. HD images: what limits us

Source sizes were measured, and the client's own sites were searched for larger files (pathltd.com media library, 548 uploads).

| Image | Size | Can we improve it? |
|---|---|---|
| Renders, official plan, new Highway/Road photos, favicon | 1720–4485 px | Already HD |
| PATH Group banner (`highway.webp`) | 1200×750 | No larger clean version exists on pathltd.com (the 1920-wide slider images carry caption boxes) |
| IT Solutions | 476×625 | pathltd.com has 1200×800 IT images (`it-1…5.jpg`), but of different subjects (toll plaza, barrier, camera, a dashboard). Swapping the picture is the client's call |
| Hero, Warehouse 17 photos | 1280 px | Original needed. Re-encoding cannot add detail; the file we were given is itself a small, heavily compressed JPEG |
| Toll, Wayside, Majhi Mumbai, VU Dynamics | 800–924 px | Fine for cards |
| Location map | 1320×1232 | Original needed for very large screens |

Raising `next/image` quality was considered and left alone: on a 1280 px, already compressed source it adds bytes and no detail.

## 4. Still needed from the client

1. **Majhi Mumbai photo** (the only one of the three named photos not supplied).
2. **CSR images and text** (the tab is ready and empty).
3. **Bengaluru MMLP Private Limited**: logo and a one-line role. Shown as a name chip until then.
4. **Authorities**: "all authorities need to be changed. Client will share the information": confirm there is nothing further, and whether the **IGBC** mark should stay in "In association with" (it is a certification, not an authority). Also confirm the official spelling **"National Highways Logistics Management Limited"** (plural, as on NHLML's own mark; the note said "Highway").
5. **Front page image (Q4)**: what to change? Sharper (send the original, the current file is 1280 px), different framing, a lighter or no wash, or another photograph.
6. **Originals** of the hero, Warehouse 17 progress photo, PATH Group banner, IT Solutions, location map.
7. Q1 (which grey in the dropdown), Q3 (which cursor behaviour felt wrong), Q2 (should the two photos also be in Blogs / Media; Blogs needs real posts).

## 5. Not checked

No Lighthouse run, no Firefox/WebKit pass and no physical device for round 7. Checked in Chromium at 1440 and 1920 only.

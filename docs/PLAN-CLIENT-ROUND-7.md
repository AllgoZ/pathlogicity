# Client round 7 — plan and what shipped

> Source: [`prompts/clientv2.md`](../prompts/clientv2.md) plus two images the client sent
> (`prompts/Highway Construction.png`, `prompts/Road Engineering.png`). Date: 2026-11-04.
> Scope rule for this round: change only what the feedback names. No other code or behaviour was touched.

## 1. Feedback, how it was read, and the result

| # | Client feedback | Reading | Status | Where |
|---|---|---|---|---|
| 1 | Path Logicity logo in the browser tab | The tab icon was a placeholder (dark square, curve, dot). Use the client's pinwheel mark | **Done** | `app/icon.png` (512), `app/apple-icon.png` (180); `app/icon.svg` removed. Made from `public/client/logo-mark.png` |
| 2 | "About Path group" tab to the far right, last tab before Enquire | The **Path Group** dropdown moves to the end of the nav | **Done** | `navigation` in `content/home.ts` (desktop nav, mobile menu and footer all read it) |
| 3 | Dropdown's light grey made a little darker | The grey in the dropdown is the item note text (`steel-500`) and the hover fill (`porcelain`). Both darkened one step | **Done** (see Q1) | `components/navigation/Nav.tsx`: notes `steel-700`, hover `stone` |
| 4 | "Path Group legacy" must read "Path Group" | The verticals section heading "PATH Legacy" becomes "PATH Group" | **Done** | `components/path-group/PathVerticals.tsx` |
| 5 | "The Park in renders" goes before the Path Group Legacy section | Homepage order: Renders, then the verticals | **Done** | `app/page.tsx` |
| 6 | Rename to "Path Logicity in renders" | Headline `Path Logicity, in renders.`; the small kicker above it is now "Renders" so the name is not said twice | **Done** | `components/gallery/RendersGallery.tsx` |
| 7 | Road Engineering, Majhi Mumbai and Highway Construction photos to be changed | Two photos were supplied (Highway Construction, Road Engineering). Both are 4000×1667 banners with a caption box, a dashed band and the PATH arrow baked in, so each was **cropped to a clean 4:3-ish window** with none of those marks, and saved as WebP q90 (1720×1290 and 1460×1095) | **Partly done**: Highway Construction and Road Engineering done. **Majhi Mumbai: no new photo supplied** (see Q2) | `public/client/path-group/highway-construction.webp`, `engineering.webp`; alt text in `content/home.ts` |
| 8 | CSR activities in the news tab; client will share images and content | Add a **CSR activities** tab beside Media coverage and Events. It shows the designed empty state until content arrives. No item was invented | **Structure done, content waiting** | `NewsType` in `lib/content/types.ts`; `TABS` in `components/news/NewsPreview.tsx` |
| 9 | First screen has issues in cursor movement | Probed in Chromium with scripted mouse paths. Two real faults found and fixed (below) | **Done** (see Q3) | `components/hero/Hero.tsx`, desktop pointer scene only |
| 10 | Second screen (400 acres): details only appear when the cursor moves to the right | The four preview photos are hover-only. On desktop they now **play through by themselves** when the list scrolls into view (about 2.8 s each) and stop the moment the visitor hovers or tabs to one. A quiet cue, "Hover over a point to preview it", fades out once they take over. Off under reduced motion. Phones never had previews and are unchanged | **Done** | `components/stats/ScaleIndex.tsx` |
| 11 | Images (Highway Construction.png, Road Engineering.png) for the blogs / media section | Blogs and Media coverage hold real articles only (the site never invents posts), and the images carry the PATH banner captions "Superior Quality" and "Expanding Capabilities". Used as the vertical photos (item 7) | **Not done**: needs the client's decision (Q2) | — |
| 12 | All images to be HD | Audited the pixel sizes (section 3). The two new photos and the favicon are done. The rest are limited by the sources the client has given | **Blocked on source files** | section 3 |
| 13 | "5.2 million sq ft Total Warehousing Area" | The figure now reads **5.2 Mn sq. ft. — Total warehousing area** (the "~" is gone). Also on the Warehousing zone fact and the renders caption | **Done** | `glance`, `zones[0].facts`, `renders` in `content/home.ts` |
| 14 | Front page image needs to be worked on | Not specific: could mean resolution, crop, the wash over it, or a different photo | **Not done**: needs the client's decision (Q4) | — |
| 15 | All authorities to change; client will share the information. Two to be included: National Highway Logistics Management Limited and Bengaluru MMLP Private Limited | The "In association with" strip (footer and Gati Shakti band) now lists those two, plus the IGBC certification mark. **RVNL and KIADB removed.** Bengaluru MMLP Private Limited has no logo or role yet, so it shows as a name in a chip | **Done** (see Q5); logo and role waiting | `partners` in `content/home.ts`; `Partner` type; `components/ui/PartnerLogos.tsx` |

### Hero cursor — what was wrong
Found by driving a mouse through the hero in headless Chromium and reading the lens state:
1. **The lens dropped when the pointer crossed the nav strip** at the top of the hero (the fixed header is outside the hero element, so the browser reported "left the hero"). The clear circle vanished and the depth drift reset every time.
2. **The lens came back in the wrong place.** After leaving and re-entering, it re-appeared where it was last, then slid to the pointer.

Fix: the desktop scene now tracks the pointer on the window against the hero's own box (no enter/leave on the section), starts the lens under the pointer on entry, closes it when the pointer leaves the box or the window, and re-checks on scroll so a resting mouse never leaves a lens behind. Phone drag, the pinned scroll, the route draw and reduced motion are untouched.

## 2. Questions for the client (assumptions I made, easy to reverse)

- **Q1.** Is "light grey" in the dropdown the text under each item, or the hover background? Both were darkened; if it is something else, say which.
- **Q2.** The two photos were used for the Highway Construction and Road Engineering cards. Is that what was meant, or should they also (or instead) appear in Blogs / Media? Blogs needs real posts (title, text) to show them. **Majhi Mumbai still needs a new photo.**
- **Q3.** The cursor report was general. If something else felt wrong (the headline letters lifting, the photo drifting), describe it and it can be tuned.
- **Q4.** "Front page image needs to be worked on": what should change? Sharper (needs the original file, the current one is 1280 px wide), different framing, less of the light wash, or a different photograph?
- **Q5.** "All authorities to be changed": I removed RVNL and KIADB and kept the IGBC certification mark (it is a certificate, not an authority). Confirm, and send the logos and a one-line role for both authorities.

## 3. HD image audit

| Image | Pixels | Verdict |
|---|---|---|
| Highway Construction, Road Engineering (new) | 1720×1290, 1460×1095 | HD for cards; cropped from 4000 px banners |
| Favicon (new) | 512×512, 180×180 | Done |
| Renders (5 of 6), official plan | 3301×1750 to 4485×3301, 2774×1583 | HD |
| Aerial render used for Logistics Parks, and the milestone 04 image | 1143×702 | Soft above about 1100 px; no larger source on file |
| Hero (Warehouse 17) | 1280×704 | **Soft on large screens**; needs the original |
| Warehouse 17 progress photo | 1280×720 | Needs the original |
| PATH Group banner | 1200×750 | Needs the original (pathltd.com has nothing larger) |
| Toll, Wayside | 800×580 | Fine for cards; originals would help |
| Majhi Mumbai, VU Dynamics | 924×1215 | Fine for cards |
| IT Solutions | 476×625 | **Low**; needs the original |
| Location map | 1320×1232 | Needs the original for large screens |

Nothing in the code can add detail to a low-resolution source. The one lever left is raising the `next/image` quality above the default 75 for the hero. It was not done: it needs a `images.qualities` change in `next.config.ts` and costs mobile performance (Lighthouse mobile is about 70), so it should wait for the originals.

## 4. What changed (files)

`app/icon.png` · `app/apple-icon.png` · `app/icon.svg` (deleted) · `app/page.tsx` · `content/home.ts` · `lib/content/types.ts` · `components/navigation/Nav.tsx` · `components/gallery/RendersGallery.tsx` · `components/path-group/PathVerticals.tsx` · `components/news/NewsPreview.tsx` · `components/ui/PartnerLogos.tsx` · `components/stats/ScaleIndex.tsx` · `components/hero/Hero.tsx` · `public/client/path-group/highway-construction.webp` · `public/client/path-group/engineering.webp` · docs.

## 5. Checked

Typecheck clean. In Chromium at 1440×900 on the dev server: the tab icon links are `icon.png` 512 and `apple-icon.png` 180; the nav reads Home, Logicity Advantage, Sustainability, Site Tour, News, Blogs, Path Group; the homepage runs Scale, Master plan, Project status, Renders, then the verticals headed "PATH Group"; the 400-acre previews cycle 1→4 untouched and then follow the hover, and clear on leave; the news page has the CSR tab with the empty state; the authority strip lists NHLML and Bengaluru MMLP; the hero lens stays on across the nav strip, restarts under the pointer, and no console errors appeared. **Not checked:** a production build, Lighthouse, a physical device, WebKit/Firefox.

## 6. Waiting on the client
Majhi Mumbai photo · CSR images and text · Bengaluru MMLP logo and role (and NHLML confirmation) · answers Q1–Q5 · originals for the hero, Warehouse 17 photos, PATH Group banner and IT Solutions · any further "authority" information promised.

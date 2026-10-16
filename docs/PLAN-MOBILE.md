# Plan — mobile polish (animation flow, image viewing, minor fixes)

> 2026-10-16. Request: the desktop view is good; on mobile add better animation flow and image
> viewing flow, plus minor fixes. **Rule: desktop is untouched.** Every change is gated to
> `max-lg` / `max-sm` (CSS) or a phone-only check (JS), and desktop is verified pixel-identical
> against a baseline taken before the first edit (1440 and 1024 wide, `/`, `/logicity-advantage`, `/site-tour`).

## Audit (390 × 844, every section)

| # | Where | What a phone visitor sees | Severity |
|---|---|---|---|
| 1 | All sections | 110–130px of empty space above every section header (desktop `section-pad`), so each section opens on blank screen | Medium |
| 2 | Hero | The left-to-right porcelain wash hides most of the render on a narrow screen: the ship and plane are barely visible | High (first impression) |
| 3 | 03 Explore — master plan | The drawing is shrunk to 350px wide; legend, labels and zones are unreadable, and there is no way to look closer | High (image viewing) |
| 4 | 05.5 Renders | Cards are a plain snap row; you cannot tell which card is current, and a render cannot be opened large | High (image viewing) |
| 5 | 06.2 Amenities | Same snap row with no sense of focus | Low |
| 6 | 08.1 Business value | The swipe row's first card sits flush against the screen edge ("01 / Faster TAT" touch x = 0) because snap ignores the left padding | Medium (bug) |
| 7 | 09 Inside Logicity | When the camera zooms onto a zone the on-map name tag scales with it and is huge and cut off at the screen edge (the chips already name the zone) | Medium (bug) |
| 8 | Below the fold | Most blocks (milestones, sustainability list, glance figures, footer links) simply appear; only headlines animate | Medium (animation flow) |
| 9 | Fine as is | Scale, Gati Shakti network, News tabs, Enquire form, Footer layout, nav, action bar | — |

## Changes

### Foundation (phones only, < 640px)
1. **Section rhythm** — `section-pad` is reduced on phones (≈ 72–104px instead of 112–208px) so a section's header is on screen sooner.

### Image viewing flow
2. **Hero** (phones < 640px) — replace the left-to-right wash with a top-to-bottom one: a pale band behind the headline, the render clear through the middle (ship and plane), a pale band behind the location/actions. Tablet and desktop keep the current wash.
3. **Master plan (03)** — on < lg the plan becomes a **pannable, larger drawing** (about 1.85× width) inside the card. Choosing a zone — by tap, chip, or the first-view tour — **glides the view to that zone**. A small "Drag to pan" hint appears and disappears after the first pan.
4. **Renders (05.5)** — tapping a render (or its expand button) opens a **full-screen viewer**: image at full size, swipe left/right between renders, counter, caption, close button, Esc, focus handling and scroll lock.
5. **Focus effect on rails** (renders + amenities, < lg) — the current card is full size and full strength; the neighbours ease back (smaller, softer), and it animates as you swipe.

### Animation flow
6. **Scroll-in for blocks on mobile** — a small `MobileMotion` component reveals below-the-fold blocks as they arrive (rise + fade, staggered within a group): milestones, sustainability initiatives, glance figures, footer link groups, PATH Group sector rows. Phones/tablets only, motion-allowed only; elements already on screen are left alone; the WAAPI animation leaves no inline styles behind.

### Minor
7. **Business value** — add left scroll padding so the first card aligns with the page margin (snap now respects it).
8. **Inside Logicity (09)** — hide the on-map name tag on < lg (the highlighted chip already names the zone).

## Out of scope
Anything at ≥ lg (1024px and up), content, copy, fonts, colours, routes, the enquiry form logic, performance work.

## Verification
- Desktop: full-page screenshots at 1440 and 1024 compared pixel-for-pixel to the baseline (reduced-motion, so animation timing cannot differ).
- Mobile: screenshots of every changed section; tap/swipe flows (plan pan, viewer open/swipe/close, rail focus); reduced motion (no reveals, no smooth pan); no horizontal overflow; no console errors; typecheck + production build.

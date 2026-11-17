# Hero redo (round 9) — plan and what shipped

> Source: the client/owner's note of 2026-11-17: *"the animation is not good, the `data-hero-hud` is a separate white block, redo the whole hero: keep the current image (`hero-v4.webp`), clean / aesthetic / attractive animation, motion, flow and text placement. Do not change anything else."*
> Scope: `components/hero/Hero.tsx` and the hero block of `app/globals.css` only. Everything outside the hero keeps working because the hero still exposes `id="top"`, `data-stage="discover"` and the `[data-hero-end]` sentinel (nav threshold, route spine, journey rail read them).

## 1. What was wrong (from the screenshot and the code)

| # | Problem | Cause |
|---|---|---|
| 1 | Animation feels busy and unfinished | A roaming lens (a yellow ring plus a milky see-through hole) wandered over the photo on its own; the pencil layer showed through it as a ghost; 140% of scroll was captured by a pin; a loopy route was drawn across the photo; photo, headline and lens all drifted at once |
| 2 | The white frosted HUD is a separate slab | `data-hero-hud` was a `bg-paper/90` card with a blur, so it read as a different page glued onto the bottom of the photo |
| 3 | Headline fights the photo | Dark ink text sat on the roof, the half-built frame and the sunlit facade; "Logistics Hub" (indigo) was the least legible line; four lines made a tall block in the middle of the image |
| 4 | Too many things asking for attention | location card, ring, route, drag pill, scroll cue, label — all at once |

## 2. The new hero — one idea: *the drawing becomes the building, and the route sets off*

### Composition (desktop, 1600 × 900)
```
┌───────────────────────────────────────────────────────────────┐
│  nav (unchanged; a light veil keeps it readable)               │
│                                                                │
│                  the photograph, clear                          │
│                  (no wash, no card, no ring)                   │
│                                                                │
│  ─ Dobbaspet, Bengaluru · NH 648 · NH 48 · STRR                │  ← small kicker, gold dash
│  India's Largest                                               │  ← white, 2 lines, bottom-left
│  Multimodal Logistics Hub        (accent line in gold)         │
│  ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │  ← gold route line, draws across
│  A connected logistics ecosystem…        [EXPLORE]  ENQUIRE →  │
│  ╎ Scroll                                  Illustrative image  │
└───────────────────────────────────────────────────────────────┘
   everything below the photo's mid-line sits on ONE soft deep-ink gradient that fades into the image
```
* One continuous surface: the information is **on** the photograph, on a bottom gradient (`ink` 88% → 0), not in a card.
* The headline is white, two lines (the content's four short lines are grouped in pairs, nothing is reworded), the last line in gold (`yellow-400`, on a dark scrim, so it is legible).
* Location moves from a boxed block to a one-line kicker above the headline. The copy and the two actions form one row under the route line. The "Illustrative image" label and the scroll cue form a quiet last line.
* Phones: the same order stacked at the bottom (kicker, headline, route line, copy, two actions); the top 40% of the photograph stays clear.

### Motion, in order (all CSS keyframes, so nothing flashes before hydration and layout shift stays 0)
1. **0.0 s** the pencil drawing of the scene is on screen (the generated `hero-v4-sketch.webp`).
2. **0.3 – 2.0 s** the photograph *develops* across the drawing, left to right, behind a thin gold scan edge (the client-approved idea from round 8, without the lens).
3. **0.9 s →** the kicker fades in; headline words rise through masks, one after another.
4. **1.7 – 2.7 s** the gold route line draws left to right across the base of the headline, a gold node leading it; it ends with a soft ping.
5. **2.0 s →** the copy and the two actions rise in turn.
6. **Ambient:** the photograph breathes in a slow 28 s drift (scale 1.04 → 1.10). Nothing else moves by itself.
7. **Pointer (desktop, fine pointer):** the photograph and the headline shift a few px at different depths (`gsap.quickTo`); that is the only interaction.
8. **Scroll (no pin):** the photograph parallaxes down a little and scales, the text lifts and fades. The page is never held.
9. **Phones:** a finger drags the photograph sideways to look around (momentum, a first slow sweep, a small hint that disappears at the first drag) — the existing behaviour, without the lens.

Reduced motion: the finished image, headline and route line, no drift, no scroll effects, no sweep. Save-Data is treated the same (film paused).

### What is removed
The lens + ring, the cursor reticle, the white HUD card, the hero pin (140% of scroll), the route drawn across the photograph, the porcelain cover fade, and the pill-shaped drag hint's heavy white background.

### What is kept
Content (`hero.headline`, `copy`, `location`, `video`, `sketch`), the optional film branch (`video.src`) with its play/pause control, `id="top"`, `data-stage="discover"`, the `[data-hero-end]` sentinel, the nav veil, the phone drag-to-look-around.

## 3. Files
| File | Change |
|---|---|
| `components/hero/Hero.tsx` | rewritten |
| `app/globals.css` | the hero keyframes block (round 5 + round 8) replaced with the new one; no other rule touched |
| `architecture files/*` | ARCHITECTURE (M14, M20, M21, M23, M24 replaced by M25) and a HANDOVER change-log row |

## 4. Verification
Typecheck; Chromium at 1600×900, 1280×720, 1024×768 and a 390×844 touch page: first-frame, mid-develop and settled screenshots, scroll exit, pointer parallax, no console errors, no horizontal overflow, reduced motion (final state shown); nav still turns solid after the hero.

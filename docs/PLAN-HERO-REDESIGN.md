# Hero redesign — plan (client round 6, point 3)

**Client feedback (2026-10-30):** the hero "is so plain, not interactive, does not feel good"; they want animation that
makes it more attractive and interactive on phone and desktop, with creative freedom. After the first attempt (fact cards,
ticker, trailing ring, sheen) the instruction was: **do not clutter the hero, give the best animation possible, try
something different, perfect for mobile and desktop.**

**Status: IMPLEMENTED 2026-10-30 (uncommitted), second iteration.** Files: `components/hero/Hero.tsx`, the "Hero redesign"
block in `app/globals.css`. `content/home.ts` is untouched by this iteration. Not yet tried on a physical device.

## Iteration 1 (replaced)

Curtain wipe, letter headline, cursor lens, trailing ring, depth parallax, three floating fact cards (a ticker on phones),
live reticle and pin, sheen. Judged too busy. **Removed:** the fact cards and ticker (and `hero.chips`), the ring, the sheen,
the tap ripple, the expanding reticle label and the tappable pin. The reticle and the phone pin are back to how they were.

## Iteration 2 — the pinwheel opening (tried, then removed)

The brand pinwheel opened onto the photograph (SVG mask, ~2.3 s) before the headline arrived. The client found the
opening too long, so it was **removed the same day** along with its start-gating (`data-intro`), the `<noscript>` rule and
the 3.6 s safety timer. Nothing else changed.

## Current hero (final for round 6)

Nothing is added to the layout. The photograph, headline, bottom bar, reticle, route and phone behaviour are as before; the
additions are two quiet interactions and a letter animation:

| # | What | Desktop | Phone |
|---|---|---|---|
| 1 | **Letter-by-letter headline** starting at ~160 ms (so no waiting); letters lift and turn blue under the cursor | yes | entrance only |
| 2 | **Clear lens.** The porcelain wash that keeps the text readable lifts in a soft circle under the cursor (a finger while dragging), so the photograph can be looked at. No extra element is drawn | cursor | finger |
| 3 | **Calm depth.** Photo, headline and reticle drift a few pixels against each other as the mouse moves (the reticle stays on the roof) | cursor | — (the existing drag-to-look stays) |

**Kept as is:** slow image drift, the desktop pin with the route drawing into §02, the phone drag-to-look with momentum, the
phone route line, the bottom bar and its timing (650 / 900 ms), the scroll cue, the "site photograph" label, the reticle.

**How:** the lens is a CSS mask on the wash (`--mx`, `--my`, `--lens`) driven by GSAP tweens inside the existing
`MQ.desktop` / `MQ.mobile` scenes, so it is off under reduced motion; the letters are CSS keyframes (`hero-char`), off under
reduced motion. No React state per frame.

## Verification (local production build)

Typecheck and build; Chromium, Firefox and WebKit load with no console errors; desktop and phone screenshots; cursor lens
checked. Earlier measurements on this hero (before the opening was removed): Lighthouse desktop 96 / mobile 66, accessibility
100 / 97 (the 97 is the PATH Group verticals cards, round 5, not the hero). Not yet tried on a physical device.

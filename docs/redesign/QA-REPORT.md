# Phase 4 — QA report

> 2026-10-15. This covers the premium redesign (Phases 1–3) on a production build (`next build` +
> `next start`). Evidence is in `docs/redesign/phase-4/`.

## Summary

| Check | Result |
|---|---|
| Lighthouse — desktop | **Performance 96 · Accessibility 100 · Best Practices 100 · SEO 100** |
| Lighthouse — mobile (default simulated throttling) | **Performance 67–75** (varies by run) · Accessibility 100 · Best Practices 100 · SEO 100 |
| Lighthouse — inner page (`/sustainability`, mobile) | Performance 88 · Accessibility 100 · Best Practices 100 · SEO 100 |
| CLS | **0** everywhere |
| Horizontal overflow at 320 / 360 / 390 / 768 / 1024 / 1280 px | **None** |
| Reduced motion (`prefers-reduced-motion: reduce`) | No content left hidden, no errors, no preloader |
| Keyboard | Logical tab order. Focus ring is gold over dark surfaces and indigo on light ones |
| Cross-browser — Edge, Firefox, WebKit (Safari engine) | No errors. Fonts, odometers, map routes and callouts all work. Layout is consistent |

## Plan targets vs. measured

| Target (REDESIGN-PLAN §8 / UI-PLAN §9) | Measured | Status |
|---|---|---|
| LCP < 2.0s (4G mobile) | **0.62s** with 4× CPU and no network throttle. **2.8s** with Lighthouse devtools throttling (slow 4G, 1.6 Mbps). **4.4–4.6s** in Lighthouse's simulated model | Met on a real fast connection. Not met under Lighthouse's slow-4G profile |
| CLS < 0.05 | 0 | Met |
| Desktop performance | 96 | Met |
| Mobile performance | 67–75 | Below 90. See "Remaining" |

The simulated mobile LCP is pessimistic. In a direct measurement (Chrome, 412px phone viewport,
4× CPU), first paint is at 256ms and the hero image paints at 624ms. Lighthouse's model attributes
the main-thread script work after load to the LCP "render delay".

## Fixes made during QA

### Performance
- **Preloader is desktop-only.** On phones it held back the hero image (the LCP element). It still plays once per session on desktop.
- **Lazy motion setup** (`lib/motion/hooks.ts` → `useMotion`).
  - Scenes near the fold set up immediately; the rest set up one viewport before they're reached, through a single shared IntersectionObserver.
  - A `ScrollTrigger.refresh()` runs only when a pinned scene (the gallery) mounts.
  - Before this, hydration created about 100 ScrollTriggers in one long task.
- **Scroll re-renders removed.** The nav, journey rail and mobile action bar re-rendered on every scroll frame. They now use `useScrolledPast` / `useHideOnScroll`, which update only when a threshold is crossed.
- **Hero render cost cut.** The colour grade is baked into `public/client/hero-gate.webp` instead of a live CSS filter plus blend overlay. The reveal is transform-only (composited) instead of an animated clip-path.
- **Route maths.** `getTotalLength()` is cached per path geometry instead of measured every frame.
- **Smooth scroll on touch.** Lenis no longer runs on touch devices, where native scrolling is already smooth.
- **Assets and fonts.**
  - The hub now uses a 17 KB `logo-mark-160.png` instead of the 221 KB original.
  - Instrument Serif loads italic only and is not preloaded.

**Result:** desktop went from 83 to 96. Mobile went from about 56 to about 70, and TBT from about 800ms to about 300–490ms (simulated).

### Accessibility (97 → 100)
- **Milestone contrast.** Inactive milestone text is no longer faded; only the decorative numeral dims, to 60%, which passes the 3:1 large-text rule.
- **Surface morph timing.** The light↔midnight blend now applies only as a section enters (`immediateRender: false`) and finishes before its text is readable. Before, off-screen sections sat as dark text on midnight.
- **Hero film control.** The "Pause film" button is shown only when there is a video. Its accessible name now matches its visible label.
- **Nav focus over the hero.** The nav gets gold focus rings while it floats over the dark hero.
- **Journey rail.** It renders only on the homepage. On inner pages it produced links without an `href` (SEO 91 → 100).
- **320px labels.** Section labels no longer break the "04 /" index across lines.

## Remaining (not blocking)
1. **Mobile performance (~70).** The remaining cost is React hydration plus GSAP set-up on an animation-rich page, measured under 4× CPU throttling. Next steps, if the client wants 85+ on mobile:
   - Turn below-the-fold sections that only animate into server components with lighter CSS reveals.
   - Load the GSAP scenes for the map, gallery and site tour with dynamic imports.
2. **Slow-4G LCP (2.8s).** The fonts (Jakarta + Open Sans) and the hero image compete for bandwidth. A smaller first-paint subset of Jakarta, or a lower-quality first hero frame, would help.
3. **Real devices.** These checks used desktop engines with mobile emulation. A pass on a physical iPhone (Safari) and a mid-range Android is still recommended before launch.

## How to re-run
```bash
npm run build
npx next start -p 3100
npx lighthouse http://localhost:3100/ --output=html --view
```

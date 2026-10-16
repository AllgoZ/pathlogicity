# Round 4 — QA report

> 2026-10-16. Covers round 4 (R4-1 to R4-6): light theme, Open Sans only, new hero, free-scrolling
> gallery, interactive official plan, Amenities, Gati Shakti network, route spine, inner pages and the
> enquiry API. Production build (`next build` + `next start -p 3100`), Chromium 1248, Firefox and WebKit
> via Playwright. Evidence: `docs/redesign/r4/` (desktop sections, mobile, inner pages, per-engine heroes).
> Not covered: physical devices, the Constra section (parked by decision).

## Summary

| Check | Result |
|---|---|
| Lighthouse desktop — `/` | **Performance 98 · Accessibility 100 · Best Practices 100 · SEO 100** (LCP 1.0s, TBT 50ms, CLS 0) |
| Lighthouse desktop — `/logicity-advantage`, `/blogs` | 99 · 100 · 100 · 100 and 100 · 100 · 100 · 100 |
| Lighthouse mobile — `/` | **Performance ~70 typical, 57–72 across five runs** · Accessibility 100 · Best Practices 100 · SEO 100 (LCP 5.2–5.7s, TBT 340–660ms) |
| Lighthouse mobile — `/logicity-advantage` | Performance 63–66 · Accessibility 100 (heaviest page: five interactive sections) |
| CLS | **0** on every run |
| Horizontal overflow at 320 / 360 / 390 / 768 / 1024 / 1280 / 1440 / 1920 px, all 7 routes | **None** |
| Cross-browser (Chromium, Firefox, WebKit), all 7 routes | **No console or page errors.** One `h1` per page, no overflow; master-plan zone selection works in all three |
| Reduced motion (`prefers-reduced-motion: reduce`) | No hidden text, **0 pinned sections**, route spine drawn in full, no errors |
| Keyboard | 28 consecutive Tab stops on the homepage: every one has a visible focus indicator and is in view. Skip link first |
| Enquiry API | Verified: dev success, production 503 + on-page fallback, 400/405/413/422, honeypot, and webhook delivery against a local capture server |

## What changed since round 3 (Phase 4)

| | Round 3 | Round 4 |
|---|---|---|
| Desktop performance | 96 | **98** |
| Mobile performance | 67–75 | **57–72 (typical ~70)** — same band, wider variance |
| Desktop accessibility | 100 | 100 (after the fixes below) |
| Pinned scroll scenes | 2 (hero 2.4 vh, gallery 5.0 vh) | **0** |
| Page length | ~27 viewports | **23.1** (after adding Amenities and the network graphic) |
| Dark share of scroll | ~45% | **4.3%** (footer only) |
| Console errors | 0 | 0 |

## Fixes made during QA

- **Accessibility 97 → 100 (homepage), 95 → 100 (`/logicity-advantage`).**
  - `ui/Rail`: the scroller had `role="region"`, which stripped list semantics from its `<li>` items. The region role now sits on a wrapper and the scroller is a plain `role="list"`.
  - `advantage/SpecDrawing`: the section title was an `h3`, so on the Advantage page it followed the `h1` with no `h2`. It is now an `h2` (still correct on the homepage, after another `h2`).
- **Hero image priority.** Next 16 deprecates `priority`; the hero now uses `preload` + `fetchPriority="high"` (Lighthouse had flagged the missing priority hint).
- **Hydration mismatch** (found earlier in R4-4): the Gati Shakti network printed slightly different floats on the server and in the browser; coordinates are now rounded.
- **Hit-testing bug** (found in R4-3): the plan overlay also covered the caption and sat ~22px low; the drawing and overlay now share one wrapper.

## Remaining (not blocking)

1. **Mobile performance ~70.** LCP is the hero render on a phone (image fetched in ~0.3s; the rest is main-thread hydration plus motion set-up, 0.7s of "render delay"). Unchanged in kind from round 3 and still below the 90 target. Options if the client wants 85+: server-render the below-fold sections that only animate (CSS reveals), and lazy-load the plan overlay, map and network. The Advantage page is the heaviest (63–66).
2. **Real devices.** Nothing here was run on a physical iPhone or mid-range Android. Check: the plan tap targets, the Rail swipe, the route spine in the left margin on phones, and the diagonal hero seam.
3. **Page-transition wipe** (`<ViewTransition>`) still not confirmed visually in headless runs; check in a real Chromium window. It is now a light curtain.
4. **Client confirmations** that affect what ships (see HANDOVER §4): legend → zone mapping on the official plan; Path Group figures (27/17+/~5,000 vs 30+/18/~6,100+); IGBC vs GRIHA; real photographs for five amenities; the enquiry destination (`ENQUIRY_WEBHOOK_URL`); copy we wrote (hero location line, page intros, enquiry confirmation, blog empty state).
5. **Constra** project status viewer: parked for later by decision.
6. Lighthouse on inner pages other than the three above was not run; they reuse the same components and passed the browser checks.

## How to re-run

```bash
npm run build && npx next start -p 3100
npx lighthouse http://localhost:3100/ --preset=desktop        # desktop
npx lighthouse http://localhost:3100/                          # mobile (expect 57-72)
```

Playwright scripts used here are not committed; they load each route, scroll the page, collect console
errors, check `scrollWidth - innerWidth`, tab through the first 28 stops, and compare reduced-motion
state. Lighthouse needs a Chrome: Playwright's `chromium-*` build works via `CHROME_PATH`.
